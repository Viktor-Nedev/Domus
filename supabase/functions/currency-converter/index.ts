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
    const { baseCurrency = 'EUR' } = await req.json();

    // Fetch exchange rates from API
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    const response = await fetch(
      `https://app-9y1d22zfrldt-api-w9Rbo8E7p2b9.gateway.appmedo.com/v6/8192723d20263507156f9754/latest/${baseCurrency}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error(`Exchange rate API error: ${data['error-type']}`);
    }

    // Update currency rates in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const rates = data.conversion_rates;
    const updates = Object.entries(rates).map(([currency, rate]) => ({
      currency_code: currency,
      rate_to_eur: baseCurrency === 'EUR' ? Number(rate) : 1 / Number(rate),
      last_updated: new Date().toISOString(),
    }));

    // Upsert rates
    const { error: upsertError } = await supabase
      .from('currency_rates')
      .upsert(updates, { onConflict: 'currency_code' });

    if (upsertError) {
      console.error('Error updating currency rates:', upsertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        rates: updates,
        updated_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Currency converter error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
