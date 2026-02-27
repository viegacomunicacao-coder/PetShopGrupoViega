"use client";

import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import ScheduleServiceDialog from "@/components/ScheduleServiceDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Clock,
  MoreVertical,
  Scissors,
  Droplets,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Car
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useStore, getPetById, getCustomerById } from "@/store/store";

const iconForService = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("tosa")) return Scissors;
  if (n.includes("consulta")) return Stethoscope;
  return Droplets;
};

const colorForService = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("tosa")) return { bg: "bg-purple-50", color: "text-purple-600" };
  if (n.includes("consulta")) return { bg: "bg-blue-50", color: "text-blue-600" };
  return { bg: "bg-cyan-50", color: "text-cyan-600" };
};

function toDateTime(dateISO: string, timeHHmm: string) {
  return new Date(`${dateISO}T${timeHHmm}:00`);
}

type SelectableStatus = "Pendente" | "Em andamento" | "Concluído";

function normalizeStatus(s: string): SelectableStatus {
  if (s === "Concluído" || s === "Em andamento" || s === "Pendente") return s as SelectableStatus;
  if (s === "Confirmado") return "Em andamento";
  if (s === "Atrasado") return "Pendente";
  return "Pendente";
}

const Agenda = () => {
  const { appointments, pets, customers, updateAppointment } = useStore();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedPetId, setSelectedPetId] = React.useState<string>("all");

  const day = (date ?? new Date()).toISOString().slice(0, 10);

  const filteredAppointments = appointments.filter((a) =>
    (selectedPetId === "all" || a.petId === selectedPetId)
  );

  const appointmentsForDay = filteredAppointments
    .filter((a) => a.date === day)
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((a) => {
      const pet = getPetById(pets, a.petId);
      const cust = pet ? getCustomerById(customers, pet.customerId) : undefined;
      const Icon = iconForService(a.serviceName);
      const palette = colorForService(a.serviceName);
      return {
        id: a.id,
        time: a.time,
        pet: pet?.name ?? "—",
        owner: cust?.name ?? "—",
        service: a.serviceName,
        status: a.status,
        taxiDog: a.taxiDog,
        icon: Icon,
        ...palette,
      };
    });

  const now = new Date();
  const upcomingForPet = selectedPetId === "all" ? [] : appointments
    .filter((a) => a.petId === selectedPetId)
    .filter((a) => toDateTime(a.date, a.time).getTime() > now.getTime())
    .sort((a, b) => toDateTime(a.date, a.time).getTime() - toDateTime(b.date, b.time).getTime())
    .slice(0, 5)
    .map((a) => {
      const pet = getPetById(pets, a.petId);
      const Icon = iconForService(a.serviceName);
      const palette = colorForService(a.serviceName);
      return {
        id: a.id,
        date: a.date,
        time: a.time,
        service: a.serviceName,
        taxiDog: a.taxiDog,
        icon: Icon,
        ...palette,
      };
    });

  const selectedPetName = selectedPetId === "all"
    ? ""
    : (getPetById(pets, selectedPetId)?.name ?? "");

  const goPrevDay = () => setDate((d) => addDays(d ?? new Date(), -1));
  const goNextDay = () => setDate((d) => addDays(d ?? new Date(), 1));

  const statusClass = (s: SelectableStatus) =>
    s === "Pendente"
      ? "bg-orange-100 text-orange-700"
      : s === "Em andamento"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  const onChangeStatus = (id: string, value: SelectableStatus) => {
    updateAppointment(id, { status: value });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Agenda</h1>
              <p className="text-slate-500">Gerencie os horários de atendimento</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">Filtrar por Pet:</span>
              <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                <SelectTrigger className="w-60 rounded-xl bg-white">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pets</SelectItem>
                  {pets.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border border-slate-100">
              <Button onClick={goPrevDay} variant="ghost" size="icon" className="rounded-full" aria-label="Dia anterior">
                <ChevronLeft size={18} />
              </Button>
              <span className="px-4 font-bold text-slate-700 min-w-[200px] text-center">
                {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecione uma data"}
              </span>
              <Button onClick={goNextDay} variant="ghost" size="icon" className="rounded-full" aria-label="Próximo dia">
                <ChevronRight size={18} />
              </Button>
            </div>

            <ScheduleServiceDialog />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800">
                Compromissos {selectedPetId !== "all" ? `• ${selectedPetName}` : ""}
              </h2>
              <Badge variant="outline" className="rounded-full bg-white">
                {appointmentsForDay.length} atendimentos
              </Badge>
            </div>

            <div className="space-y-3">
              {appointmentsForDay.length > 0 ? appointmentsForDay.map((item) => {
                const sel = normalizeStatus(item.status);
                return (
                  <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        <div className="w-20 flex flex-col items-center justify-center border-r border-slate-50 bg-slate-50/30">
                          <span className="text-lg font-black text-slate-700">{item.time}</span>
                          <Clock size={14} className="text-slate-400" />
                        </div>
                        <div className="flex-1 p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={cn("p-3 rounded-2xl", item.bg, item.color)}>
                              <item.icon size={24} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-slate-900 truncate">
                                {item.pet} <span className="font-normal text-slate-400 text-sm">• {item.owner}</span>
                              </h3>
                              <p className="text-sm text-slate-500 truncate">{item.service}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {item.taxiDog && (
                              <Badge className="rounded-full bg-orange-100 text-orange-700 border-none">
                                <Car size={12} className="mr-1" /> Taxi
                              </Badge>
                            )}

                            <Select
                              value={sel}
                              onValueChange={(v) => onChangeStatus(item.id, v as SelectableStatus)}
                            >
                              <SelectTrigger className={cn(
                                "h-8 rounded-full px-3 text-sm font-medium",
                                statusClass(sel)
                              )}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                                <SelectItem value="Em andamento">Em andamento</SelectItem>
                                <SelectItem value="Concluído">Concluído</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button variant="ghost" size="icon" className="text-slate-400" aria-label="Mais ações">
                              <MoreVertical size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }) : (
                <div className="text-center py-12 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400">
                    Nenhum agendamento {selectedPetId !== "all" ? "para este pet " : ""}nesta data.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-none"
                  locale={ptBR}
                />
              </CardContent>
            </Card>

            {selectedPetId !== "all" && (
              <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    Próximos de {selectedPetName}
                  </h3>
                  <div className="space-y-3">
                    {upcomingForPet.length > 0 ? upcomingForPet.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-xl", u.bg, u.color)}>
                            <u.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{u.service}</p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(u.date + "T00:00:00"), "dd/MM", { locale: ptBR })} • {u.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.taxiDog && (
                            <Badge className="rounded-full bg-orange-100 text-orange-700 border-none text-[10px]">
                              <Car size={10} className="mr-1" /> Taxi
                            </Badge>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-slate-400 text-sm py-6">
                        Sem próximos agendamentos para este pet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-sm bg-primary text-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Resumo do Dia</h3>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/70">Total de serviços</span>
                    <span className="font-bold">{appointmentsForDay.length}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[100%]" />
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

export default Agenda;