// AdminLogin.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../components/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // const signIn = async () => {
  //   setErr(null)

  //   if (!email.trim() || !password) {
  //     setErr('Please enter your email and password.')
  //     return
  //   }

  //   setLoading(true)
  //   const { error } = await supabase.auth.signInWithPassword({ email, password })
  //   setLoading(false)

  //   if (error) setErr(error.message)
  //   else window.location.href = '/admin'
  // }

  const signIn = async () => {
    setErr(null)
    if (!email.trim() || !password) return setErr('Please enter your email and password.')

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else navigate('/admin/uploader/new', { replace: true }); // SPA redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">Admin Login</h1>
        <p className="text-sm text-gray-500 text-center mt-1">Sign in to manage products & uploads</p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => { e.preventDefault(); signIn(); }}
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          {/* Optional links */}
          {/* <div className="text-center">
            <a href="/admin-forgot" className="text-sm text-emerald-700 hover:underline">
              Forgot password?
            </a>
          </div> */}
        </form>
      </div>
    </div>
  )
}

