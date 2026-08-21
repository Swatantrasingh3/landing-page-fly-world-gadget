import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseServerKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseServerKey) {
  throw new Error(
    "Supabase is not configured. Set SUPABASE_URL and SUPABASE_API_KEY on the server."
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
