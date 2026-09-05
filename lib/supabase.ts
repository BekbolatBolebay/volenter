import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txeohywoansohvvdkrkc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4ZW9oeXdvYW5zb2h2dmRrcmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjI3MzAsImV4cCI6MjA3NTY5ODczMH0.OgCrrRaQ2aCj6ddQXmel0EJWI9JDsJQ1elMEKwrTPn8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
