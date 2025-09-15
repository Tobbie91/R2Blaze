import { useState } from 'react'
import { supabase } from '../components/supabase'


export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMagicLink = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/admin',  // Redirect to admin page after login
      },
    })
    if (error) {
      setError('Error: ' + error.message)
    } else {
      alert('Check your inbox for the login link!')
    }
    setLoading(false)
  }

  return (
    <div>
      <input 
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendMagicLink} disabled={loading}>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
      {error && <div>{error}</div>}
    </div>
  )
}
