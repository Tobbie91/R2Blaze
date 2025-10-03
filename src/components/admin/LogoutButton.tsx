// src/admin/LogoutButton.tsx

import { supabase } from "../supabase";


export default function LogoutButton() {
  return (
    <button
      onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
      className="rounded border px-3 py-1.5 text-sm"
    >
      Logout
    </button>
  );
}
