import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const msg = "Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
  if (import.meta.env.PROD) {
    throw new Error(msg);
  } else {
    console.warn(msg);
  }
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
