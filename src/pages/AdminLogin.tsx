// import { useEffect, useState } from 'react'
// import { supabase } from '../components/supabase'

// export default function AdminPage() {
//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase.auth.getUser()
//       if (data?.user) {
//         // Check if the user has admin role
//         const { data: userRole } = await supabase
//           .from('users')  // Assuming you have a 'users' table with a role column
//           .select('role')
//           .eq('id', data.user.id)
//           .single()

//         if (userRole?.role === 'admin') {
//           setUser(data.user)
//         } else {
//           window.location.href = '/unauthorized' // Redirect if not admin
//         }
//       } else {
//         window.location.href = '/login' // Redirect to login page if not logged in
//       }
//       setLoading(false)
//     }

//     fetchUser()
//   }, [])

//   return (
//     <div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : user ? (
//         <div>
//           <h1>Welcome, {user.email}</h1>
//           <p>You're logged in as an admin!</p>
//         </div>
//       ) : (
//         <p>Unauthorized access</p>
//       )}
//     </div>
//   )
// }
import { useState } from 'react'
import { supabase } from '../components/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMagicLink = async () => {
    setLoading(true)
    setError('')
    
    // Send the magic link using Supabase authentication
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />

        <button
          onClick={sendMagicLink}
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-md"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  )
}
