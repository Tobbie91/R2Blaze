import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog, type Product } from '../store/catalog'
import ImageUploader from '../components/ImageUploader'
import { STORE, CLOUDINARY } from '../config'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
}

/** normalize many URL styles to something we can render in <img> */
function toDirectImageUrl(input: string) {
  let s = input.trim()
  if (!s) return ''
  if (/^data:image\/[a-zA-Z]+;base64,/.test(s)) return s
  if (/^\/\//.test(s)) s = `https:${s}`
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s)
      const host = u.hostname
      if (host.includes('drive.google.com')) {
        const m = u.pathname.match(/\/file\/d\/([^/]+)/)
        const id = m?.[1] || u.searchParams.get('id')
        if (id) return `https://drive.google.com/uc?export=view&id=${id}`
      }
      if (host.includes('dropbox.com')) {
        u.searchParams.delete('dl'); u.searchParams.set('raw', '1')
        return u.toString()
      }
      if (host === 'imgur.com' || host.endsWith('.imgur.com')) {
        const seg = u.pathname.split('/').filter(Boolean)
        const id = seg[0]
        if (id && !['a', 'gallery'].includes(id) && !/\.(jpg|jpeg|png|webp|gif)$/i.test(id)) {
          return `https://i.imgur.com/${id}.jpg`
        }
      }
      return u.toString()
    } catch { return '' }
  }
  if (s.startsWith('/')) return s
  if (/^[a-z0-9._-]+\/[^ ]+\.(jpg|jpeg|png|webp|gif)$/i.test(s)) return `/${s}`
  if (/^[a-z0-9.-]+\.[a-z]{2,}([\/?].*)?$/i.test(s)) return `https://${s}`
  return ''
}

export default function Admin() {
  const add = useCatalog(s => s.add)
  const update = useCatalog(s => s.update)     // ✅ for editing
  const remove = useCatalog(s => s.remove)     // ✅ for deleting
  const products = useCatalog(s => s.products)

  // 🔐 Simple front-end gate (PIN stored in config; session in localStorage)
  const [authed, setAuthed] = useState<boolean>(() => localStorage.getItem('r2_admin_ok') === '1')
  const [pin, setPin] = useState('')
  function tryLogin() {
    if (pin === STORE.adminPin) { localStorage.setItem('r2_admin_ok','1'); setAuthed(true) }
    else alert('Wrong PIN')
  }
  function logout() { localStorage.removeItem('r2_admin_ok'); setAuthed(false) }

  // ——— add/edit form ———
  const [editingId, setEditingId] = useState<string | null>(null)
  const editingOriginal = useMemo(
    () => products.find(p => p.id === editingId) || null,
    [products, editingId]
  )

  const [form, setForm] = useState({
    name: '', brand: '', strap: 'metal', price: 0, prevPrice: 0, description: '', images: [] as string[],
  })
  const [imgUrl, setImgUrl] = useState('')
  const [imgErr, setImgErr] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState(false)

  const canUpload = Boolean(CLOUDINARY.cloudName && CLOUDINARY.uploadPreset)

  function addImageUrl(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const url = toDirectImageUrl(imgUrl)
    if (!url) { setImgErr('Enter a direct image link (Cloudinary/Dropbox raw, Drive file link, /images/...)'); return }
    setForm(f => ({ ...f, images: [...f.images, url] }))
    setImgUrl(''); setImgErr(null); setJustAdded(true); setTimeout(() => setJustAdded(false), 900)
  }

  function setCover(i: number) {
    setForm(f => {
      const arr = [...f.images]; const [img] = arr.splice(i,1); arr.unshift(img)
      return { ...f, images: arr }
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm({ name:'', brand:'', strap:'metal', price:0, prevPrice:0, description:'', images:[] })
    setImgUrl(''); setImgErr(null)
  }

  function onSave() {
    if (!form.name || !form.brand || !form.price || form.images.length === 0) {
      alert('Fill name, brand, price, and add at least one image'); return
    }

    if (editingId && editingOriginal) {
      const nameChanged = form.name.trim() !== editingOriginal.name
      update(editingId, {
        name: form.name,
        brand: form.brand,
        strap: form.strap as Product['strap'],
        price: Number(form.price),
        prevPrice: form.prevPrice ? Number(form.prevPrice) : undefined,
        images: form.images,
        description: form.description || 'No description yet.',
        slug: nameChanged ? `${slugify(form.name)}-${Math.floor(Math.random()*1000)}` : editingOriginal.slug,
      })
      alert('Product updated!')
      resetForm()
    } else {
      const p: Product = {
        id: `p-${Date.now()}`,
        name: form.name,
        slug: `${slugify(form.name)}-${Math.floor(Math.random() * 1000)}`,
        brand: form.brand,
        strap: form.strap as Product['strap'],
        price: Number(form.price),
        prevPrice: form.prevPrice ? Number(form.prevPrice) : undefined,
        images: form.images,
        description: form.description || 'No description yet.',
      } as Product
      add(p)
      alert('Product added!')
      resetForm()
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      brand: p.brand,
      strap: p.strap as any,
      price: p.price,
      prevPrice: p.prevPrice ?? 0,
      description: p.description ?? '',
      images: [...(p.images ?? [])],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function onDelete(id: string, name: string) {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      remove(id)
      if (editingId === id) resetForm()
    }
  }

  // 🔐 PIN screen
  if (!authed) {
    return (
      <div className="max-w-sm mx-auto border rounded-xl p-4">
        <h1 className="text-xl font-semibold mb-2">Admin login</h1>
        <input
          placeholder="Enter PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') tryLogin() }}
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={tryLogin} className="mt-3 px-4 py-2 rounded bg-emerald-700 text-white w-full">Enter</button>
        <p className="text-xs text-gray-600 mt-2">PIN is set in <code>src/config.ts</code>. This is client-side only.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT: Add/Edit form */}
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">{editingId ? 'Edit product' : 'Add product'}</h1>
          <div className="flex items-center gap-3">
            {editingId && (
              <button onClick={resetForm} className="text-sm text-gray-600 hover:underline">
                Cancel edit
              </button>
            )}
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>

        <div className="grid gap-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Brand"
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.strap}
              onChange={e => setForm({ ...form, strap: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option>metal</option><option>leather</option><option>rubber</option><option>silicon</option><option>fabric</option>
            </select>
            <input
              type="number"
              placeholder="Price (₦)"
              value={form.price}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              className="border rounded px-3 py-2"
            />
          </div>

          <input
            type="number"
            placeholder="Prev price (₦)"
            value={form.prevPrice}
            onChange={e => setForm({ ...form, prevPrice: Number(e.target.value) })}
            className="border rounded px-3 py-2"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border rounded px-3 py-2 min-h-[120px]"
          />

          {/* Upload from device → Cloudinary (adds a URL on success) */}
          {canUpload ? (
            <ImageUploader onUploaded={(url) => setForm(f => ({ ...f, images: [...f.images, url] }))} />
          ) : (
            <div className="text-xs text-gray-600">
              Paste an image URL below, or set <code>CLOUDINARY</code> in <code>src/config.ts</code> to enable uploads.
            </div>
          )}

          {/* Or paste an existing image URL */}
          <form className="space-y-1" onSubmit={addImageUrl}>
            <div className="flex gap-2">
              <input
                placeholder="…or paste image URL (https://, //, /images/..., Drive/Dropbox/Imgur)"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
              <button type="submit" className="px-3 py-2 border rounded" title="Add image URL">
                {justAdded ? '✓ Added' : 'Add'}
              </button>
            </div>
            {imgErr && <div className="text-xs text-red-600">{imgErr}</div>}
          </form>

          {/* Preview + remove + set cover */}
          {!!form.images.length && (
            <div className="flex gap-2 flex-wrap">
              {form.images.map((u, i) => (
                <div key={i} className="relative">
                  <img src={u} className="w-20 h-20 object-cover rounded border" />
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                      className="bg-black/70 text-white text-xs rounded-full px-1"
                      title="Remove"
                    >×</button>
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => setCover(i)}
                        className="bg-emerald-700 text-white text-[10px] rounded px-1"
                        title="Set as cover"
                      >cover</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={onSave} className="px-4 py-2 rounded bg-emerald-700 text-white">
            {editingId ? 'Save changes' : 'Save product'}
          </button>
          {!editingId && (
            <p className="text-xs text-gray-600">Products save to this device (localStorage). For multi-device sync later we can add Firebase.</p>
          )}
        </div>
      </div>

      {/* RIGHT: current products with View / Edit / Delete */}
      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Current products</h2>
        <ul className="space-y-2 text-sm">
          {products.map(p => (
            <li key={p.id} className={`flex items-center justify-between border rounded p-2 ${editingId === p.id ? 'ring-1 ring-emerald-500' : ''}`}>
              <div className="flex items-center gap-3">
                <img src={p.images?.[0] || '/images/placeholder.webp'} className="w-10 h-10 object-cover rounded border" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.brand} • ₦{p.price.toLocaleString('en-NG')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/products/${p.slug}`} className="px-3 py-1 rounded border hover:bg-gray-50">View</Link>
                <button onClick={() => startEdit(p)} className="px-3 py-1 rounded border hover:bg-gray-50">Edit</button>
                <button onClick={() => onDelete(p.id, p.name)} className="px-3 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </li>
          ))}
          {!products.length && <li className="text-gray-500">No products yet.</li>}
        </ul>

        {/* (optional) reset everything on this device */}
        <button
          onClick={() => {
            if (confirm('Reset catalog on this device? This removes all products you added here.')) {
              localStorage.removeItem('r2blaze_catalog'); location.reload()
            }
          }}
          className="mt-3 text-xs text-red-600 hover:underline"
        >
          Reset catalog (this device)
        </button>
        <button
  type="button"                             // 👈 important
  onClick={() => {
    try {
      const products = [{
        id: `p-${Date.now()}`,
        name: 'TAG Heuer Aquaracer',
        slug: `tag-heuer-aquaracer-${Math.floor(Math.random()*1000)}`,
        brand: 'TAG Heuer',
        strap: 'metal',
        price: 350000,
        images: ['https://res.cloudinary.com/dpuencehw/image/upload/v1756942556/r2blaze/tvtzn6kewsfhpz4vpd3u.jpg'],
        description: 'Seeded via button.',
      }];

      localStorage.setItem('r2blaze_catalog', JSON.stringify(products));
      console.log('Seeded:', products);
      alert('Seeded 1 product — reloading…');
      setTimeout(() => location.reload(), 50);  // tiny delay so storage commits
    } catch (e) {
      console.error('Seeding failed:', e);
      alert('Seeding failed — see Console');
    }
  }}
  className="px-3 py-2 border rounded"
>
  Seed 1 test product
</button>


      </div>
    </div>
  )
}



