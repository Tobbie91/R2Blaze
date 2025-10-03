// src/layouts/AdminLayout.tsx
import { Outlet, Link } from "react-router-dom";
import { supabase } from "../components/supabase";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin" className="font-semibold">Admin</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/admin/uploader/new" className="hover:underline">Uploader</Link>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
              className="rounded border px-2 py-1"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
