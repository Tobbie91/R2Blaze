// components/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

type AuthCtx = { loading: boolean; session: Session | null; user: User | null }
const Ctx = createContext<AuthCtx>({ loading: true, session: null, user: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let active = true
    // 1) initial fetch
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    // 2) subscribe to changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!active) return
      setSession(sess)
      setUser(sess?.user ?? null)
      setLoading(false)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return <Ctx.Provider value={{ loading, session, user }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

