"use client";

import React from "react";
import { useStore, getPetById, getCustomerById } from "@/store/store";
import { toast } from "sonner";

function onlyDigits(s: string) {
  return s.replace(/\D+/g, "");
}

function toWhatsAppNumber(phone?: string) {
  if (!phone) return "";
  let digits = onlyDigits(phone);
  if (!digits) return "";
  if (!digits.startsWith("55")) digits = "55" + digits;
  return digits;
}

function replaceAllLocal(haystack: string, needle: string, replacement: string) {
  return haystack.split(needle).join(replacement);
}

function renderTemplate(
  template: string,
  parts: { pet: string; servico: string; data: string; hora: string },
) {
  let out = template || "";
  out = replaceAllLocal(out, "{pet}", parts.pet);
  out = replaceAllLocal(out, "{servico}", parts.servico);
  out = replaceAllLocal(out, "{data}", parts.data);
  out = replaceAllLocal(out, "{hora}", parts.hora);
  return out;
}

const STORAGE_KEY = "petmanager_reminders_sent_v1";

type SentMap = Record<string, true>;

function loadSent(): SentMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no");
    return JSON.parse(raw) as SentMap;
  } catch {
    return {};
  }
}

function saveSent(map: SentMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export default function ReminderScheduler() {
  const { appointments, pets, customers, settings } = useStore();
  const sentRef = React.useRef<SentMap>(loadSent());

  React.useEffect(() => {
    const tick = () => {
      const now = Date.now();
      for (const a of appointments) {
        const pet = getPetById(pets, a.petId);
        if (!pet) continue;
        const cust = getCustomerById(customers, pet.customerId);
        const phone = toWhatsAppNumber(cust?.phone);
        if (!phone) continue;

        const target = new Date(`${a.date}T${a.time}:00`).getTime();
        const t24 = target - 24 * 60 * 60 * 1000;
        const t2 = target - 2 * 60 * 60 * 1000;

        const dateStr = new Date(a.date + "T00:00:00").toLocaleDateString("pt-BR");
        const tpl = settings.notifications.reminderTemplate;

        if (settings.notifications.whatsapp24h && now >= t24 && now - t24 < 60 * 1000) {
          const key = `${a.id}_24`;
          if (!sentRef.current[key]) {
            sentRef.current[key] = true;
            saveSent(sentRef.current);
            const msg = renderTemplate(tpl, {
              pet: pet.name,
              servico: a.serviceName,
              data: dateStr,
              hora: a.time,
            });
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
            toast("Lembrete WhatsApp (24h): " + pet.name, {
              description: `${a.serviceName} em ${a.date} às ${a.time}`,
              action: {
                label: "Abrir WhatsApp",
                onClick: () => window.open(url, "_blank"),
              },
            });
          }
        }

        if (settings.notifications.whatsapp2h && now >= t2 && now - t2 < 60 * 1000) {
          const key = `${a.id}_2`;
          if (!sentRef.current[key]) {
            sentRef.current[key] = true;
            saveSent(sentRef.current);
            const msg = renderTemplate(tpl, {
              pet: pet.name,
              servico: a.serviceName,
              data: dateStr,
              hora: a.time,
            });
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
            toast("Lembrete WhatsApp (2h): " + pet.name, {
              description: `${a.serviceName} em ${a.date} às ${a.time}`,
              action: {
                label: "Abrir WhatsApp",
                onClick: () => window.open(url, "_blank"),
              },
            });
          }
        }
      }
    };

    const id = setInterval(tick, 30 * 1000);
    tick();
    return () => clearInterval(id);
  }, [appointments, pets, customers, settings]);

  return null;
}