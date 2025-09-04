import { useRef, useState } from 'react'
import { CLOUDINARY } from '../config'

type Props = { onUploaded: (url: string) => void }

export default function ImageUploader({ onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)

  const canUpload = Boolean(CLOUDINARY.cloudName && CLOUDINARY.uploadPreset)

  function openPicker() {
    if (!canUpload) {
      alert('Set CLOUDINARY.cloudName & uploadPreset in src/config.ts, or paste a URL instead.')
      return
    }
    fileRef.current?.click()
  }

  async function handleFile(file: File) {
    setFilename(file.name)
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY.uploadPreset!)
      if (CLOUDINARY.folder) fd.append('folder', CLOUDINARY.folder)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/upload`, {
        method: 'POST',
        body: fd,
      })

      const json = await res.json()
      if (!res.ok || !json.secure_url) {
        const msg =
          (json?.error && (json.error.message || JSON.stringify(json.error))) ||
          'Upload failed. Check cloudName/preset.'
        console.error('Cloudinary upload error:', json)
        alert(msg)
        return
      }
      onUploaded(json.secure_url as string)
    } catch (e) {
      console.error(e)
      alert('Upload error. See console for details.')
    } finally {
      setBusy(false)
      setFilename(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
      <button
        type="button"
        onClick={openPicker}
        className="px-3 py-2 border rounded"
        disabled={busy}
      >
        {busy ? 'Uploading…' : 'Upload image'}
      </button>
      {filename && <span className="text-xs text-gray-600">{filename}</span>}
      {!canUpload && (
        <span className="text-xs text-gray-600">
          (Cloudinary not configured — use the URL field.)
        </span>
      )}
    </div>
  )
}
