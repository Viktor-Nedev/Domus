import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const HF_TOKEN = Deno.env.get('HF_TOKEN');
    if (!HF_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Hugging Face API token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Hugging Face API using the provided structure
    const hfResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen3.5-35B-A3B:novita',
        messages: [
          {
            role: 'system',
            content: `You are an emergency housing location analyzer. When given a location name, determine:
1. Is it a CITY or a COUNTRY?
2. What is the official full name?
3. If it's a city, which country is it in?
4. What is the emergency phone number for that location?
5. Brief safety information for displaced persons

Respond ONLY with valid JSON in this exact format:
{
  "type": "city" or "country",
  "name": "official name",
  "country": "country name (if city)",
  "emergency_number": "emergency phone number",
  "safety_info": "brief safety information (2-3 sentences)"
}

Be accurate and concise. If the location is not recognized, set type to "unknown".`
          },
          {
            role: 'user',
            content: `Analyze this location: ${location}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('Hugging Face API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hfData = await hfResponse.json();
    const aiResponse = hfData.choices[0]?.message?.content;

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse AI response
    let parsedResponse;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(aiResponse);
      }
    } catch (e) {
      // If AI didn't return valid JSON, create a fallback response
      parsedResponse = {
        type: 'unknown',
        name: location,
        country: '',
        emergency_number: '112',
        safety_info: 'Please contact local authorities for emergency assistance.'
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-location-analyzer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
