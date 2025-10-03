// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './components/supabase'

export function useAuth() {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (!mounted) return
      setSession(sess)
      setUser(sess?.user ?? null)
      setReady(true)
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  return { ready, session, user }
}
