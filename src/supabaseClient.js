import { createClient } from "@supabase/supabase-js";

// Vite mengekspos variabel lingkungan melalui import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseAnonKey) {
    throw new Error("gaada VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY di .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)