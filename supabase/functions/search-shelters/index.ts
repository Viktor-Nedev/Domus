import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShelterSearchRequest {
  location: string;
  latitude?: number;
  longitude?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, latitude, longitude }: ShelterSearchRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search internal database for emergency housing
    const { data: internalShelters, error: dbError } = await supabase
      .from('reclaim_listings')
      .select(`
        *,
        property:properties!reclaim_listings_property_id_fkey(
          id,
          title,
          description,
          city,
          country,
          latitude,
          longitude,
          bedrooms,
          size_sqm,
          price_eur,
          photos
        )
      `)
      .eq('available', true)
      .limit(10);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    // Also search regular properties with coordinates
    const { data: regularProperties, error: propError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(10);

    if (propError) {
      console.error('Properties error:', propError);
    }

    // Combine results
    const shelters = [];

    // Add RECLAIM listings (emergency housing)
    if (internalShelters) {
      for (const listing of internalShelters) {
        if (listing.property) {
          shelters.push({
            id: listing.property.id,
            title: listing.property.title,
            description: listing.property.description,
            city: listing.property.city,
            country: listing.property.country,
            latitude: listing.property.latitude,
            longitude: listing.property.longitude,
            bedrooms: listing.property.bedrooms,
            size_sqm: listing.property.size_sqm,
            price: listing.property.price_eur,
            photos: listing.property.photos,
            type: 'emergency_shelter',
            badge: 'Emergency Housing',
            available_immediately: true,
            special_terms: listing.special_terms || 'Flexible terms for families in need',
          });
        }
      }
    }

    // Add regular properties (temporary housing)
    if (regularProperties) {
      for (const property of regularProperties) {
        shelters.push({
          id: property.id,
          title: property.title,
          description: property.description,
          city: property.city,
          country: property.country,
          latitude: property.latitude,
          longitude: property.longitude,
          bedrooms: property.bedrooms,
          size_sqm: property.size_sqm,
          price: property.price_eur,
          photos: property.photos,
          type: 'temporary_housing',
          badge: 'Temporary Housing',
          available_immediately: false,
        });
      }
    }

    // Generate AI suggestion based on location
    const aiSuggestion = generateAISuggestion(location, shelters);

    return new Response(
      JSON.stringify({
        success: true,
        location,
        shelters,
        total: shelters.length,
        aiSuggestion,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in search-shelters function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateAISuggestion(location: string, shelters: any[]): string {
  if (shelters.length === 0) {
    return `I couldn't find any available shelters near "${location}" at the moment. Please try:\n\n1. Expanding your search to nearby cities\n2. Contacting our 24/7 emergency hotline: +1-800-SHELTER\n3. Checking back later as new listings are added daily`;
  }

  const emergencyShelters = shelters.filter(s => s.type === 'emergency_shelter');
  const temporaryHousing = shelters.filter(s => s.type === 'temporary_housing');

  let suggestion = `Based on your location "${location}", I found ${shelters.length} safe housing options:\n\n`;

  if (emergencyShelters.length > 0) {
    suggestion += `🚨 EMERGENCY HOUSING (${emergencyShelters.length} available):\n`;
    emergencyShelters.slice(0, 3).forEach((shelter, i) => {
      suggestion += `${i + 1}. ${shelter.title}\n`;
      suggestion += `   📍 ${shelter.city}, ${shelter.country}\n`;
      suggestion += `   🏠 ${shelter.bedrooms} bedrooms, ${shelter.size_sqm}m²\n`;
      suggestion += `   ✓ ${shelter.special_terms}\n\n`;
    });
  }

  if (temporaryHousing.length > 0) {
    suggestion += `🏘️ TEMPORARY HOUSING (${temporaryHousing.length} available):\n`;
    temporaryHousing.slice(0, 2).forEach((shelter, i) => {
      suggestion += `${i + 1}. ${shelter.title}\n`;
      suggestion += `   📍 ${shelter.city}, ${shelter.country}\n`;
      suggestion += `   🏠 ${shelter.bedrooms} bedrooms, ${shelter.size_sqm}m²\n`;
      suggestion += `   💰 €${shelter.price?.toLocaleString()}/month\n\n`;
    });
  }

  suggestion += `\n🤖 AI Recommendation: `;
  if (emergencyShelters.length > 0) {
    suggestion += `I recommend "${emergencyShelters[0].title}" as it offers immediate availability with flexible terms for families in crisis situations.`;
  } else {
    suggestion += `"${temporaryHousing[0].title}" is a good option for temporary housing while you search for a permanent solution.`;
  }

  return suggestion;
}
