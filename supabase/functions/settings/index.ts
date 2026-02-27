import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, serviceRoleKey);

    if (req.method !== "POST") {
      console.error("[settings] invalid method", { method: req.method });
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const payload = await req.json();
    console.log("[settings] upsert request", { payload });

    const row = {
      id: payload.id || "global",
      brand_name: payload.brand_name ?? null,
      brand_logo_data_url: payload.brand_logo_data_url ?? null,
      notifications: payload.notifications ?? {},
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("app_settings").upsert(row, {
      onConflict: "id",
    });

    if (error) {
      console.error("[settings] upsert error", { error });
      return new Response("Upsert failed", { status: 500, headers: corsHeaders });
    }

    console.log("[settings] upsert ok");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[settings] unexpected error", e);
    return new Response("Unexpected error", { status: 500, headers: corsHeaders });
  }
});