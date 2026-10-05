import { createClient } from "@supabase/supabase-js";

const cleanEnvValue = (value) => {
  if (!value) return "";

  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
};

const supabaseUrl = cleanEnvValue(
  import.meta.env.VITE_SUPABASE_URL
);

const supabaseAnonKey = cleanEnvValue(
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is missing from .env");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is missing from .env");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

