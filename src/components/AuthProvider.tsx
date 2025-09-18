// src/components/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

type Profile = { id: string; email: string | null; role: 'admin'|'user' }
type Ctx = { loading: boolean; session: any; profile: Profile | null }

const AuthCtx = createContext<Ctx>({ loading: true, session: null, profile: null })
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile|null>(null)

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session?.user?.id) await loadProfile(session.user.id)
      setLoading(false)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      setSession(sess)
      if (sess?.user?.id) await loadProfile(sess.user.id)
      else setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('id,email,role').eq('id', userId).maybeSingle()
    setProfile(data ?? null)
  }

  return <AuthCtx.Provider value={{ loading, session, profile }}>{children}</AuthCtx.Provider>
}
