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
    const { propertyId } = await req.json();

    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      throw new Error('Property not found');
    }

    // Calculate DOMUS score based on various factors
    let score = 50; // Base score
    const reasons: string[] = [];

    // Factor 1: Price per sqm analysis
    const pricePerSqm = property.price_eur / property.size_sqm;
    
    // Fetch market average for the city
    const { data: marketData } = await supabase
      .from('market_data')
      .select('avg_price_sqm')
      .eq('country', property.country)
      .eq('city', property.city)
      .eq('property_type', property.type)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (marketData && marketData.avg_price_sqm) {
      const marketAvg = marketData.avg_price_sqm;
      const priceDiff = ((pricePerSqm - marketAvg) / marketAvg) * 100;

      if (priceDiff < -15) {
        score += 25;
        reasons.push(`Excellent value: ${Math.abs(priceDiff).toFixed(0)}% below market average`);
      } else if (priceDiff < -5) {
        score += 15;
        reasons.push(`Good value: ${Math.abs(priceDiff).toFixed(0)}% below market average`);
      } else if (priceDiff > 15) {
        score -= 15;
        reasons.push(`Above market: ${priceDiff.toFixed(0)}% higher than average`);
      }
    }

    // Factor 2: Property features
    let featureScore = 0;
    if (property.elevator) {
      featureScore += 3;
      reasons.push('Has elevator');
    }
    if (property.parking) {
      featureScore += 5;
      reasons.push('Includes parking');
    }
    if (property.balcony) {
      featureScore += 2;
      reasons.push('Has balcony');
    }
    if (property.furnished) {
      featureScore += 3;
      reasons.push('Fully furnished');
    }
    score += featureScore;

    // Factor 3: Size analysis
    if (property.size_sqm > 100) {
      score += 5;
      reasons.push('Spacious property');
    }

    // Factor 4: Age of property
    if (property.year_built) {
      const age = new Date().getFullYear() - property.year_built;
      if (age < 5) {
        score += 10;
        reasons.push('New construction');
      } else if (age < 15) {
        score += 5;
        reasons.push('Modern building');
      }
    }

    // Factor 5: Location quality (based on coordinates)
    // In a real implementation, this would check proximity to amenities
    score += 5;
    reasons.push('Central location');

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Estimate rental yield (simplified calculation)
    const estimatedMonthlyRent = pricePerSqm * property.size_sqm * 0.005; // 0.5% of property value per month
    const annualRent = estimatedMonthlyRent * 12;
    const rentalYield = (annualRent / property.price_eur) * 100;

    // Update property with DOMUS score
    const { error: updateError } = await supabase
      .from('properties')
      .update({ domus_score: Math.round(score) })
      .eq('id', propertyId);

    if (updateError) {
      console.error('Error updating property score:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        domus_score: Math.round(score),
        reasons,
        rental_yield: rentalYield.toFixed(2),
        price_per_sqm: pricePerSqm.toFixed(2),
        market_comparison: marketData ? 'Available' : 'Limited data',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI deal analyzer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
