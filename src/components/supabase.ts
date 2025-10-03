// components/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,       // keep user logged in across refreshes
    autoRefreshToken: true,     // refresh tokens in the background
    detectSessionInUrl: true,   // handles email link flows if you use OTP
  },
})

