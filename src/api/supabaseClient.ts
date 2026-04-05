import { createClient } from '@supabase/supabase-js'

// Мы используем import.meta.env, чтобы React подтянул данные из .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Ошибка: Ключи Supabase не найдены в .env.local!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)