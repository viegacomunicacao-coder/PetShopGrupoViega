"use client";

import React from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";
import AddServiceDialog from "@/components/AddServiceDialog";
import EditServiceDialog from "@/components/EditServiceDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Scissors, Droplets, Stethoscope, Clock, Trash2 } from "lucide-react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function iconForCategory(cat?: string) {
  const c = (cat || "").toLowerCase();
  if (c.includes("tosa")) return { Icon: Scissors, color: "text-purple-600", bg: "bg-purple-50" };
  if (c.includes("veter")) return { Icon: Stethoscope, color: "text-red-600", bg: "bg-red-50" };
  return { Icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" };
}
function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const Services = () => {
  const { services, deleteService } = useStore();
  const [query, setQuery] = React.useState("");

  const filtered = services.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Serviços</h1>
            <p className="text-slate-500">Gerencie o catálogo de serviços e preços</p>
          </div>
          <AddServiceDialog />
        </header>

        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Buscar serviços..."
              className="pl-10 py-6 rounded-2xl border-none bg-white shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((service) => {
              const { Icon, color, bg } = iconForCategory(service.category);
              return (
                <Card key={service.id} className="border-none shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("p-3 rounded-2xl", bg, color)}>
                        <Icon size={24} />
                      </div>
                      <div className="flex gap-1 opacity-100 transition-opacity">
                        <EditServiceDialog service={service} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mb-1">{service.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <Clock size={14} /> {service.durationMin} min
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-2xl font-black text-primary">{brl(service.priceCents)}</span>
                      <Badge variant="outline" className="rounded-full">{service.active ? "Ativo" : "Inativo"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;