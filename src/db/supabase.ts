import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://rcazysuigxfvmuorhglz.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYXp5c3VpZ3hmdm11b3JoZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODcxMjgsImV4cCI6MjA4Nzg2MzEyOH0.JRaeYiMws8naYeLiUV2P58J9oBkhIc0Kx739y9CvHcE";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(
    "Missing Supabase credentials in environment. Using default DOMUS Supabase project values."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
