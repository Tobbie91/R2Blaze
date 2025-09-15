import { createClient } from '@supabase/supabase-js'

// Access the environment variables using `import.meta.env`
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }

