import { supabase } from "@/integrations/supabase/client";
import type { AppSettings } from "@/store/types";

/**
 * Fetch settings from the public.app_settings table, row id='global'.
 * Requires a public SELECT policy.
 */
export async function fetchRemoteSettings(): Promise<AppSettings | null> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("brand_name, brand_logo_data_url, notifications")
    .eq("id", "global")
    .single();

  if (error || !data) return null;

  const settings: AppSettings = {
    brand: {
      name: data.brand_name || "PetManager",
      logoDataUrl: data.brand_logo_data_url || undefined,
    },
    notifications: {
      whatsapp24h: data.notifications?.whatsapp24h ?? true,
      whatsapp2h: data.notifications?.whatsapp2h ?? true,
      reminderTemplate:
        data.notifications?.reminderTemplate ??
        "Olá! Lembrete do agendamento de {servico} do pet {pet} em {data} às {hora}. Caso precise reagendar, por favor nos avise. Obrigado!",
    },
  };

  return settings;
}

/**
 * Save settings via Edge Function using Service Role (secure write).
 * Invoke by function name so the client builds the correct URL.
 */
export async function saveRemoteSettings(settings: AppSettings): Promise<void> {
  const { error } = await supabase.functions.invoke("settings", {
    body: {
      id: "global",
      brand_name: settings.brand.name,
      brand_logo_data_url: settings.brand.logoDataUrl ?? null,
      notifications: settings.notifications,
    } as any,
  });

  if (error) {
    throw error;
  }
}