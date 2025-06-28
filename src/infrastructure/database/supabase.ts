import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(supabaseUrl: string, supabaseKey: string) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, supabaseKey);
} 