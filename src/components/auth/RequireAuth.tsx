"use client";

import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@/integrations/supabase/SessionProvider";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}