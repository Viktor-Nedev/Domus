import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user preferences
    const { data: preferences, error: prefError } = await supabase
      .from('buyer_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (prefError || !preferences) {
      throw new Error('User preferences not found');
    }

    // Build query based on preferences
    let query = supabase
      .from('properties')
      .select(`
        *,
        broker:profiles!broker_id(id, name, account_type, agency_name)
      `)
      .eq('status', 'active');

    // Apply filters
    if (preferences.budget_min) {
      query = query.gte('price_eur', preferences.budget_min);
    }
    if (preferences.budget_max) {
      query = query.lte('price_eur', preferences.budget_max);
    }
    if (preferences.property_types && preferences.property_types.length > 0) {
      query = query.in('type', preferences.property_types);
    }
    if (preferences.countries && preferences.countries.length > 0) {
      query = query.in('country', preferences.countries);
    }
    if (preferences.cities && preferences.cities.length > 0) {
      query = query.in('city', preferences.cities);
    }
    if (preferences.bedrooms_min) {
      query = query.gte('bedrooms', preferences.bedrooms_min);
    }
    if (preferences.bedrooms_max) {
      query = query.lte('bedrooms', preferences.bedrooms_max);
    }
    if (preferences.size_min) {
      query = query.gte('size_sqm', preferences.size_min);
    }
    if (preferences.size_max) {
      query = query.lte('size_sqm', preferences.size_max);
    }

    query = query.order('domus_score', { ascending: false }).limit(20);

    const { data: properties, error: propError } = await query;

    if (propError) {
      throw new Error('Error fetching properties');
    }

    // Calculate match scores for each property
    const matches = (properties || []).map((property: any) => {
      let matchScore = 50; // Base score
      const reasons: string[] = [];

      // Budget match
      if (preferences.budget_min && preferences.budget_max) {
        const budgetMid = (preferences.budget_min + preferences.budget_max) / 2;
        const priceDiff = Math.abs(property.price_eur - budgetMid) / budgetMid;
        if (priceDiff < 0.1) {
          matchScore += 20;
          reasons.push('Perfect price match');
        } else if (priceDiff < 0.2) {
          matchScore += 10;
          reasons.push('Good price match');
        }
      }

      // Location match
      if (preferences.countries?.includes(property.country)) {
        matchScore += 10;
        reasons.push(`Located in preferred country: ${property.country}`);
      }
      if (preferences.cities?.includes(property.city)) {
        matchScore += 15;
        reasons.push(`Located in preferred city: ${property.city}`);
      }

      // Property type match
      if (preferences.property_types?.includes(property.type)) {
        matchScore += 10;
        reasons.push(`Matches preferred type: ${property.type}`);
      }

      // Size match
      if (preferences.size_min && preferences.size_max) {
        const sizeMid = (preferences.size_min + preferences.size_max) / 2;
        const sizeDiff = Math.abs(property.size_sqm - sizeMid) / sizeMid;
        if (sizeDiff < 0.15) {
          matchScore += 10;
          reasons.push('Ideal size');
        }
      }

      // Features bonus
      if (property.parking && preferences.proximity_transport > 7) {
        matchScore += 5;
        reasons.push('Has parking (important for you)');
      }
      if (property.elevator && property.floor > 2) {
        matchScore += 3;
        reasons.push('Has elevator');
      }

      // DOMUS score influence
      if (property.domus_score > 80) {
        matchScore += 10;
        reasons.push('Excellent DOMUS deal score');
      } else if (property.domus_score > 70) {
        matchScore += 5;
        reasons.push('Good DOMUS deal score');
      }

      // Ensure score is between 0 and 100
      matchScore = Math.max(0, Math.min(100, matchScore));

      return {
        property,
        match_score: Math.round(matchScore),
        reasons,
      };
    });

    // Sort by match score
    matches.sort((a, b) => b.match_score - a.match_score);

    return new Response(
      JSON.stringify({
        success: true,
        matches: matches.slice(0, 10), // Return top 10 matches
        total: matches.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI matcher error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
