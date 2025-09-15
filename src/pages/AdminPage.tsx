// src/AdminPage.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../components/supabase'


export default function AdminPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)  // If user is logged in, show the admin page
      } else {
        window.location.href = '/login'  // Redirect to login page if not logged in
      }
    }

    fetchUser()
  }, [])

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <p>You're logged in as an admin!</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
