import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseServerKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_API_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServerKey) {
  throw new Error(
    "Supabase is not configured. Set SUPABASE_URL and a Supabase API key on the server."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServerKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
