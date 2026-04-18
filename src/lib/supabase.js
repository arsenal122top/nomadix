import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  typeof supabaseUrl === 'string' &&
  /^https?:\/\//.test(supabaseUrl) &&
  typeof supabaseKey === 'string' &&
  supabaseKey.length > 0

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null
