import { useState, type ChangeEvent } from 'react'
import { supabase } from '../components/supabase'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setErrorMsg(null)

    try {
      // give each upload a unique name to avoid "duplicate" errors
      const objectName = `images/${crypto.randomUUID()}-${file.name}`

      const { data, error } = await supabase
        .storage
        .from('product-images') // ensure this bucket exists
        .upload(objectName, file /*, { upsert: true }*/)

      if (error) throw error

      // OPTIONAL: if the bucket is public, get a public URL:
      // const { data: pub } = supabase.storage.from('product-images').getPublicUrl(objectName)
      // console.log('public URL:', pub.publicUrl)

      alert('File uploaded successfully!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMsg(msg)
    } finally {
      setLoading(false)
      // Optional: clear the input so the same file can be selected again
      e.target.value = ''
    }
  }

  return (
    <div>
      <input type="file" onChange={uploadFile} />
      {loading && <p>Uploading...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
    </div>
  )
}


