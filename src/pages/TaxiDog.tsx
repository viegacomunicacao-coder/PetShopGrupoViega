"use client";

import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import TaxiDogStatusPill from "@/components/TaxiDogStatusPill";
import { useStore, buildTaxiRoutesForDate, getCustomerById, getPetById } from "@/store/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Car, MapPin, Phone, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

function onlyDigits(s: string) {
  return s.replace(/\D+/g, "");
}
function toWaLink(phone?: string, text?: string) {
  if (!phone) return "";
  let digits = onlyDigits(phone);
  if (!digits) return "";
  if (!digits.startsWith("55")) digits = "55" + digits;
  const msg = encodeURIComponent(text ?? "Olá! Chegaremos em breve para o Taxi Dog.");
  return `https://wa.me/${digits}?text=${msg}`;
}

const TaxiDog = () => {
  const { customers, pets, appointments } = useStore();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [routeStatus, setRouteStatus] = React.useState<Record<string, "pending" | "in_progress" | "completed">>({});

  const day = (date ?? new Date()).toISOString().slice(0, 10);
  const routes = buildTaxiRoutesForDate(pets, customers, appointments, day).map((r) => ({
    ...r,
    status: routeStatus[r.id] ?? r.status,
  }));

  const activeCount = routes.filter((r) => r.status !== "completed").length;

  const setStatus = (id: string, status: "pending" | "in_progress" | "completed") => {
    setRouteStatus((s) => ({ ...s, [id]: status }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Taxi Dog</h1>
            <p className="text-slate-500">Rotas derivadas dos agendamentos com Taxi Dog</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-2 rounded-full">
              <Car size={16} className="mr-2" /> {activeCount} rotas ativas
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Cronograma</h2>

            <div className="space-y-3">
              {routes.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-semibold">Nenhuma rota para esta data.</p>
                  <p className="text-xs text-slate-400 mt-1">Crie agendamentos com Taxi Dog na Agenda.</p>
                </div>
              ) : (
                routes.map((route) => {
                  const pet = getPetById(pets, route.petId);
                  const customer = getCustomerById(customers, route.customerId);
                  const label = route.leg === "pickup" ? "Coleta" : "Entrega";
                  const wa = toWaLink(customer?.phone, `Olá ${customer?.name ?? ""}! Chegaremos para ${label.toLowerCase()} do pet ${pet?.name ?? ""} às ${route.time}.`);

                  return (
                    <Card key={route.id} className="border-none shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative">
                              <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                <AvatarImage src={pet?.photoDataUrl} loading="lazy" />
                                <AvatarFallback>PET</AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-sm",
                                  label === 'Coleta' ? "bg-blue-500" : "bg-orange-500"
                                )}
                              >
                                {label === 'Coleta' ? (
                                  <ArrowRight size={12} />
                                ) : (
                                  <ArrowRight size={12} className="rotate-180" />
                                )}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-slate-900">{pet?.name ?? "—"}</h3>
                                <Badge variant="outline" className="text-[10px] uppercase rounded-full">{label}</Badge>
                                <TaxiDogStatusPill status={route.status} />
                              </div>
                              <p className="text-sm text-slate-500 truncate">
                                <span className="font-semibold text-slate-600">Tutor:</span> {customer?.name ?? "—"}
                              </p>
                              <p className="text-sm text-slate-500 flex items-center gap-1 truncate">
                                <MapPin size={14} /> {route.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 border-t md:border-none pt-4 md:pt-0">
                            <div className="text-right">
                              <p className="text-xs text-slate-400 font-bold uppercase">Horário</p>
                              <p className="font-black text-slate-900 flex items-center gap-1">
                                <Clock size={14} /> {route.time}
                              </p>
                            </div>

                            {wa && (
                              <Button
                                variant="outline"
                                className="rounded-full bg-white gap-2"
                                onClick={() => window.open(wa, "_blank")}
                                aria-label="Enviar mensagem via WhatsApp"
                                title="Enviar mensagem via WhatsApp"
                              >
                                <MessageCircle size={16} className="text-green-600" /> WhatsApp
                              </Button>
                            )}

                            <div className="flex items-center gap-2">
                              {route.status === "completed" ? (
                                <Button size="sm" variant="outline" className="rounded-full bg-white" onClick={() => setStatus(route.id, "pending")}>
                                  Reabrir
                                </Button>
                              ) : route.status === "in_progress" ? (
                                <>
                                  <Button size="sm" className="rounded-full bg-orange-500 hover:bg-orange-600" onClick={() => setStatus(route.id, "completed")}>
                                    Finalizar
                                  </Button>
                                  <Button size="sm" variant="outline" className="rounded-full bg-white" onClick={() => setStatus(route.id, "pending")}>
                                    Pausar
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm" className="rounded-full" onClick={() => setStatus(route.id, "in_progress")}>
                                  Iniciar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-4">
                <Calendar mode="single" selected={date} onSelect={setDate} locale={ptBR} />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-white rounded-[2rem]">
              <CardContent className="p-8">
                <h3 className="text-xl font-black mb-4">Resumo</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/70">Total de rotas</span>
                    <span className="text-2xl font-black">{routes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/70">Concluídas</span>
                    <span className="text-2xl font-black">{routes.filter((r) => r.status === "completed").length}</span>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-primary-foreground/70 mb-2">Progresso</p>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full"
                        style={{ width: routes.length ? `${Math.round((routes.filter((r) => r.status === 'completed').length / routes.length) * 100)}%` : "0%" }}
                      />
                    </div>
                    <p className="text-right text-xs mt-2 font-bold">
                      {routes.length ? Math.round((routes.filter((r) => r.status === 'completed').length / routes.length) * 100) : 0}% Concluído
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaxiDog;