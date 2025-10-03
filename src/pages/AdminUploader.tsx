// src/pages/AdminProductEditor.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../components/supabase";

// ========= Types =========
type Product = {
  id: string;
  name: string;
  slug: string | null;
  price: number | null;
  main_image: string | null;
  other_images: string[] | null;
  brand: string | null;
  prev_price: number | null;
  description: string | null;
  features?: string[] | null; // NEW
  images?: string[] | null;   // NEW
  created_at?: string | null;
  updated_at?: string | null;
};

// ========= ENV =========
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
const FOLDER =
  (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || "product-images";

// ========= Helpers =========
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cld(
  publicIdOrUrl: string,
  t?: {
    w?: number;
    h?: number;
    crop?: "fill" | "fit" | "thumb" | "scale" | "crop";
    g?: "auto" | "center" | "faces";
    q?: "auto" | number;
    f?: "auto";
  }
) {
  try {
    if (/^https?:\/\//i.test(publicIdOrUrl)) return publicIdOrUrl;
  } catch {}
  const parts: string[] = [];
  if (t?.crop) parts.push(`c_${t.crop}`);
  if (t?.w) parts.push(`w_${t.w}`);
  if (t?.h) parts.push(`h_${t.h}`);
  if (t?.g) parts.push(`g_${t.g}`);
  if (t?.q !== undefined) parts.push(`q_${t.q}`);
  if (t?.f) parts.push(`f_${t?.f}`);
  const tr = parts.length ? parts.join(",") + "/" : "";
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${tr}${publicIdOrUrl}`;
}

// Small pill button
function Pill({
  children,
  onClick,
  variant = "ghost",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "danger" | "solid";
  title?: string;
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full text-xs px-2 py-1 transition";
  const styles: Record<string, string> = {
    ghost: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    danger:
      "border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300",
    solid: "bg-emerald-700 text-white hover:bg-emerald-800",
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

// ========= Features Tag Editor =========
function FeaturesEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function addFromInput() {
    const parts = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const dedup = Array.from(new Set([...value, ...parts]));
    onChange(dedup);
    setInput("");
    inputRef.current?.focus();
  }

  function removeAt(idx: number) {
    const copy = [...value];
    copy.splice(idx, 1);
    onChange(copy);
  }

  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.length === 0 && (
          <span className="text-xs text-gray-500">No features yet.</span>
        )}
        {value.map((f, idx) => (
          <span
            key={`${f}-${idx}`}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 text-xs"
          >
            {f}
            <button
              className="ml-1 text-emerald-700 hover:text-red-600"
              onClick={() => removeAt(idx)}
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className="w-full rounded border p-2 text-sm"
          placeholder="Type a feature and press Enter, or paste comma-separated"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromInput();
            }
          }}
        />
        <Pill variant="solid" onClick={addFromInput} title="Add feature(s)">
          Add
        </Pill>
      </div>

      <p className="mt-1 text-xs text-gray-500">
        Tips: Press Enter to add. You can paste multiple features separated by commas.
      </p>
    </div>
  );
}

// ========= Page =========
export default function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const creating = !id || id === "new";

  const [prod, setProd] = useState<Product>({
    id: "",
    name: "",
    slug: "",
    price: null,
    main_image: null,
    other_images: [],
    brand: "",
    prev_price: null,
    description: "",
    features: [],
    images: [],
  });

  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!creating);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingOthers, setUploadingOthers] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Pre-generate id when creating so uploads can use a stable path
  useEffect(() => {
    if (creating) {
      setProd((p) => (p.id ? p : { ...p, id: crypto.randomUUID() }));
    }
  }, [creating]);

  const CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

if (!CLOUD || !PRESET) {
  throw new Error(
    `Missing Cloudinary envs. CLOUD='${CLOUD}', PRESET='${PRESET}'. ` +
    `Check .env and restart the dev server.`
  );
}

console.log("[Cloudinary check]", { CLOUD, PRESET }); 

async function uploadToCloudinary(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);

  // while debugging, do NOT send folder (avoids folder restriction conflicts)
  // fd.append("folder", "r2blaze"); // enable later only if needed

  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
  const r = await fetch(url, { method: "POST", body: fd });
  const j = await r.json();

  if (!r.ok) {
    // <-- THIS shows the exact Cloudinary reason in your UI/console
    console.error("Cloudinary error:", j);
    throw new Error(j?.error?.message || "Cloudinary upload failed");
  }
  return j.secure_url as string;
}


  // Load for edit mode
  useEffect(() => {
    if (creating) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErr(error.message);
      } else if (alive && data) {
        const features: string[] = Array.isArray(data.features) ? data.features : [];
        const other: string[] = Array.isArray(data.other_images)
          ? data.other_images
          : [];
        const gallery: string[] =
          Array.isArray(data.images) && data.images.length
            ? data.images
            : [
                ...(data.main_image ? [data.main_image] : []),
                ...other,
              ];
        setProd({
          id: data.id,
          name: data.name ?? "",
          slug: data.slug ?? "",
          price: data.price ?? null,
          main_image: data.main_image ?? null,
          other_images: other,
          brand: data.brand ?? "",
          prev_price: data.prev_price ?? null,
          description: data.description ?? "",
          features,
          images: gallery,
          created_at: data.created_at ?? null,
          updated_at: data.updated_at ?? null,
        });
        setSlugTouched(true);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [creating, id]);

  const ngn = useMemo(
    () => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }),
    []
  );

  // Unique slug (create)
  async function ensureUniqueSlug(name: string, typed?: string | null) {
    const base = slugify((typed && typed.trim()) || name || "");
    if (!base) return null;
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .ilike("slug", `${base}%`);
    if (error || !data) return base;

    const existing = new Set(
      (data as { slug: string | null }[]).map((r) => (r.slug || "").toLowerCase())
    );
    if (!existing.has(base)) return base;
    for (let n = 2; n < 200; n++) {
      const candidate = `${base}-${n}`;
      if (!existing.has(candidate)) return candidate;
    }
    return `${base}-${Date.now()}`;
  }

  // Unique slug (save excluding current)
  async function ensureUniqueSlugForUpdate(
    candidate: string | null | undefined,
    currentId: string
  ) {
    const base = slugify(candidate || "");
    if (!base) return null;
    const { data, error } = await supabase
      .from("products")
      .select("id, slug")
      .ilike("slug", `${base}%`);
    if (error || !data) return base;

    const others = (data as { id: string; slug: string | null }[]).filter(
      (r) => r.id !== currentId
    );
    const existing = new Set(others.map((r) => (r.slug || "").toLowerCase()));
    if (!existing.has(base)) return base;
    for (let n = 2; n < 200; n++) {
      const candidateN = `${base}-${n}`;
      if (!existing.has(candidateN)) return candidateN;
    }
    return `${base}-${Date.now()}`;
  }

  // Auto-slug when name changes (unless user touched slug)
  function onNameChange(v: string) {
    setProd((p) => {
      const next = { ...p, name: v };
      if (!slugTouched) next.slug = slugify(v);
      return next;
    });
  }

  const [success, setSuccess] = useState<string | null>(null);

function showSuccess(msg: string, ms = 2500) {
  setSuccess(msg);
  window.setTimeout(() => setSuccess(null), ms);
}

  // Create
  async function createProduct() {
    if (!prod.name.trim()) return alert("Name is required");
    setSaving(true);
    try {
      const uniqueSlug = await ensureUniqueSlug(prod.name, prod.slug);
      const payload = {
        id: prod.id,
        name: prod.name.trim(),
        slug: uniqueSlug,
        price: prod.price != null ? Number(prod.price) : null,
        main_image: prod.main_image || null,
        other_images: Array.isArray(prod.other_images) ? prod.other_images : [],
        brand: prod.brand?.trim() || null,
        prev_price: prod.prev_price != null ? Number(prod.prev_price) : null,
        description: prod.description || "",
        features: Array.isArray(prod.features) ? prod.features : [],
        images: [
          ...(prod.main_image ? [prod.main_image] : []),
          ...((prod.other_images ?? []) as string[]),
        ],
      };
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      const newId = data!.id as string;
      navigate(`/admin/products/${encodeURIComponent(newId)}`, { replace: true });
    } catch (e: any) {
      if (e?.code === "23505")
        alert("Slug already exists. Try changing the product name/slug.");
      else alert(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  // Save
  async function saveProduct() {
    if (creating) return;
    setSaving(true);
    try {
      const desiredSlug = prod.slug?.trim() || slugify(prod.name || "");
      const uniqueSlug = await ensureUniqueSlugForUpdate(desiredSlug, prod.id);
  
      const payload = {
        name: prod.name?.trim(),
        slug: uniqueSlug,
        price: prod.price != null ? Number(prod.price) : null,
        main_image: prod.main_image || null,
        other_images: Array.isArray(prod.other_images) ? prod.other_images : [],
        brand: prod.brand?.trim() || null,
        prev_price: prod.prev_price != null ? Number(prod.prev_price) : null,
        description: prod.description ?? "",
        features: Array.isArray(prod.features) ? prod.features : [],
        images: [
          ...(prod.main_image ? [prod.main_image] : []),
          ...((prod.other_images ?? []) as string[]),
        ],
      };
  
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", prod.id);
  
      if (error) throw error;
  
      // ✅ success toast instead of alert
      showSuccess("Changes saved");
    } catch (e: any) {
      if (e?.code === "23505") {
        alert("Slug already exists. Try changing the product name/slug.");
      } else {
        alert(e.message || String(e));
      }
    } finally {
      setSaving(false);
    }
  }
  

  async function handleUploadMain(file: File) {
    if (!file) return;
    setUploadingMain(true);
    try {
      const url = await uploadToCloudinary(file);
      setProd(p => ({ ...p, main_image: url, images: [url, ...(p.other_images ?? [])] }));
    } catch (e:any) { alert(e.message || String(e)); }
    finally { setUploadingMain(false); }
  }
  
  async function handleUploadOthers(files: FileList | null) {
    if (!files?.length) return;
    setUploadingOthers(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files)) uploaded.push(await uploadToCloudinary(f));
      setProd(p => {
        const other = [...(p.other_images ?? []), ...uploaded];
        return { ...p, other_images: other, images: [ ...(p.main_image ? [p.main_image] : []), ...other ] };
      });
    } catch (e:any) { alert(e.message || String(e)); }
    finally { setUploadingOthers(false); }
  }
  

  // Remove an "other" image
  function removeOtherImage(url: string) {
    setProd((p) => {
      const newOthers = (p.other_images ?? []).filter((u) => u !== url);
      const nextImages = [
        ...(p.main_image ? [p.main_image] : []),
        ...newOthers,
      ];
      return { ...p, other_images: newOthers, images: nextImages };
    });
  }

  // Promote an "other" to main
  function makeMain(url: string) {
    setProd((p) => {
      const others = (p.other_images ?? []).filter((u) => u !== url);
      const putOldMainBack =
        p.main_image && p.main_image !== url ? [p.main_image, ...others] : others;
      const nextImages = [url, ...putOldMainBack];
      return {
        ...p,
        main_image: url,
        other_images: putOldMainBack,
        images: nextImages,
      };
    });
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading product…{" "}
        {err ? <span className="text-red-600 text-sm">{err}</span> : null}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button className="mb-4 text-sm text-emerald-700" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-emerald-900">
        {creating ? "Create Product" : "Edit Product"}
      </h1>

      {success && (
  <div className="fixed bottom-4 right-4 z-[1000] rounded-xl bg-emerald-600 text-white px-4 py-3 shadow-lg ring-1 ring-emerald-500/30">
    <div className="text-sm font-medium">✅ {success}</div>
  </div>
)}

      {/* BASIC INFO */}
      <section className="mt-6 rounded-2xl border p-5 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              className="mt-1 w-full rounded border p-2"
              value={prod.name || ""}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Slug</span>
            <input
              className="mt-1 w-full rounded border p-2"
              value={prod.slug || ""}
              onFocus={() => setSlugTouched(true)}
              onChange={(e) => setProd({ ...prod, slug: slugify(e.target.value) })}
            />
            <p className="mt-1 text-xs text-gray-500">
              We auto-generate this from the name. You can edit it.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Price (NGN)</span>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={prod.price ?? ""}
              onChange={(e) =>
                setProd({
                  ...prod,
                  price: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Previous Price (NGN)</span>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={prod.prev_price ?? ""}
              onChange={(e) =>
                setProd({
                  ...prod,
                  prev_price: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Brand</span>
            <input
              className="mt-1 w-full rounded border p-2"
              value={prod.brand || ""}
              onChange={(e) => setProd({ ...prod, brand: e.target.value })}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              rows={4}
              className="mt-1 w-full rounded border p-2"
              value={prod.description || ""}
              onChange={(e) => setProd({ ...prod, description: e.target.value })}
            />
          </label>

          {/* FEATURES */}
          <div className="md:col-span-2">
            <span className="text-sm font-medium">Features</span>
            <FeaturesEditor
              value={prod.features ?? []}
              onChange={(arr) => setProd((p) => ({ ...p, features: arr }))}
            />
          </div>
        </div>
      </section>

      {/* IMAGES */}
      <section className="mt-6 rounded-2xl border p-5 bg-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-semibold text-emerald-900">Images</h2>
          <div className="flex items-center gap-2">
            <label className="rounded border px-3 py-2 text-sm cursor-pointer">
              {uploadingOthers ? "Uploading…" : "Add gallery images"}
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadOthers(e.target.files)}
              />
            </label>
          </div>
        </div>

        {/* Main image */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Main image</div>
            <label className="rounded border px-3 py-2 text-sm cursor-pointer">
              {uploadingMain ? "Uploading…" : "Choose file"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUploadMain(e.target.files[0])}
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-44 aspect-square rounded-lg border overflow-hidden bg-gray-50">
              {prod.main_image ? (
                <img
                  src={cld(prod.main_image, {
                    w: 480,
                    h: 480,
                    crop: "fill",
                    g: "auto",
                    q: "auto",
                    f: "auto",
                  })}
                  alt="main"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full grid place-items-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {prod.main_image && (
                <Pill variant="danger" onClick={() => {
                  setProd((p) => {
                    // removing main keeps others as-is; gallery recomputed in save/locally here
                    const nextImages = [...(p.other_images ?? [])];
                    return { ...p, main_image: null, images: nextImages };
                  });
                }}>
                  Remove
                </Pill>
              )}
              {/* Quick pick: promote first gallery item (if exists) */}
              {prod.other_images && prod.other_images.length > 0 && (
                <Pill onClick={() => makeMain(prod.other_images![0])}>
                  Use first gallery as main
                </Pill>
              )}
            </div>
          </div>
        </div>

        {/* Other images (gallery editor) */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Gallery (other images)</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(prod.other_images ?? []).map((url) => (
              <div key={url} className="rounded-xl border overflow-hidden group bg-white">
                <img
                  src={cld(url, {
                    w: 400,
                    h: 400,
                    crop: "fill",
                    g: "auto",
                    q: "auto",
                    f: "auto",
                  })}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
                <div className="p-2 flex items-center justify-between gap-2">
                  <Pill variant="danger" onClick={() => removeOtherImage(url)}>
                    Remove
                  </Pill>
                  <Pill onClick={() => makeMain(url)} title="Make this the main image">
                    Make main
                  </Pill>
                </div>
              </div>
            ))}
            {(!prod.other_images || prod.other_images.length === 0) && (
              <div className="col-span-full text-sm text-gray-500">
                No gallery images yet.
              </div>
            )}
          </div>
        </div>

        {/* Unified images (read-only preview) */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">
            All images (saved as <code>images</code>)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(prod.images ?? []).map((url) => (
              <div key={url} className="rounded-xl border overflow-hidden">
                <img
                  src={cld(url, {
                    w: 400,
                    h: 400,
                    crop: "fill",
                    g: "auto",
                    q: "auto",
                    f: "auto",
                  })}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
            {(!prod.images || prod.images.length === 0) && (
              <div className="col-span-full text-sm text-gray-500">No images yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* META / SAVE */}
      <section className="mt-6 rounded-2xl border p-5 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500">Created</div>
            <div className="text-sm">
              {prod.created_at ? new Date(prod.created_at).toLocaleString() : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Updated</div>
            <div className="text-sm">
              {prod.updated_at ? new Date(prod.updated_at).toLocaleString() : "—"}
            </div>
          </div>
          <div className="md:text-right">
            {creating ? (
              <button
                onClick={createProduct}
                disabled={saving || !prod.name.trim()}
                className="rounded-xl bg-emerald-700 px-5 py-2 text-white disabled:opacity-50"
              >
                {saving ? "Creating…" : "Create product"}
              </button>
            ) : (
              <button
                onClick={saveProduct}
                disabled={saving}
                className="rounded-xl bg-emerald-700 px-5 py-2 text-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            )}
          </div>
        </div>
        {prod.price != null && (
          <div className="mt-2 text-xs text-gray-500">
            Current price: {ngn.format(Number(prod.price))}
          </div>
        )}
      </section>

      {err && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}
    </div>
  );
}
