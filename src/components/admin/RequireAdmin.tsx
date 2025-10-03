// src/components/admin/RequireAdmin.tsx
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../components/supabase";

export default function RequireAdmin() {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setOk(!!session);         // ✅ any signed-in user allowed
      setReady(true);
    })();
  }, [loc.pathname]);

  if (!ready) return <div className="p-6">Checking…</div>;
  if (!ok) return <Navigate to="/admin/login" replace state={{ from: loc }} />;
  return <Outlet />;
}


