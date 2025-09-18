// src/components/RequireAdmin.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { loading, session, profile } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="p-6">Checking access…</div>
  if (!session) return <Navigate to="/login" state={{ from: loc }} replace />
  if (profile?.role !== 'admin') return <div className="p-6">You don’t have access.</div>
  return children
}
