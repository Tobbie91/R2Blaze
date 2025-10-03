// components/RequireAdmin.tsx
import { ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './components/AuthProvider'


export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <div className="p-6">Checking access…</div>

  // not logged in → go to /login
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  // must have role=admin in app_metadata
  const role = (user.app_metadata as any)?.role
  if (role !== 'admin') return <Navigate to="/login" replace />

  return <>{children}</>
}
