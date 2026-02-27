"use client";

import React from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "@/store/store";

const TITLES: Record<string, string> = {
  "/": "Login",
  "/dashboard": "Dashboard",
  "/agenda": "Agenda",
  "/taxidog": "Taxi Dog",
  "/financial": "Financeiro",
  "/services": "Serviços",
  "/inventory": "Inventário",
  "/customers": "Clientes",
  "/settings": "Configurações",
};

function computeTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/pet/")) return "Pet";
  if (pathname.startsWith("/customer/")) return "Cliente";
  return "App";
}

function upsertMeta(nameOrProp: { name?: string; property?: string }, content: string) {
  const selector = nameOrProp.name
    ? `meta[name="${nameOrProp.name}"]`
    : `meta[property="${nameOrProp.property}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    if (nameOrProp.name) el.setAttribute("name", nameOrProp.name);
    if (nameOrProp.property) el.setAttribute("property", nameOrProp.property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
}

export default function DocumentTitle() {
  const { pathname } = useLocation();
  const { settings } = useStore();
  const brand = settings.brand;

  React.useEffect(() => {
    const section = computeTitle(pathname);
    document.title = `${brand.name} • ${section}`;

    upsertMeta({ name: "theme-color" }, "#ff0068");
    upsertMeta(
      { name: "description" },
      `${brand.name}: gestão simples e bonita para pet shops e clínicas — agenda, Taxi Dog, serviços, clientes, pets e financeiro em um só lugar.`,
    );
    upsertMeta({ property: "og:title" }, `${brand.name} • ${section}`);

    const icon = upsertLink("icon");
    icon.setAttribute("type", brand.logoDataUrl?.includes("image/svg+xml") ? "image/svg+xml" : "image/png");
    icon.setAttribute("href", brand.logoDataUrl || "/favicon.ico");
  }, [pathname, brand.name, brand.logoDataUrl]);

  return null;
}