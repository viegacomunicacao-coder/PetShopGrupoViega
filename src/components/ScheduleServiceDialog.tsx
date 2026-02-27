"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, Clock, Car } from "lucide-react";
import { showSuccess } from '@/utils/toast';
import { useStore } from "@/store/store";

const ScheduleServiceDialog = () => {
  const { pets, customers, addAppointment } = useStore();
  const [open, setOpen] = React.useState(false);

  const [petId, setPetId] = React.useState<string>(pets[0]?.id ?? "");
  const [serviceName, setServiceName] = React.useState("Banho");
  const [date, setDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = React.useState<string>("09:00");
  const [taxiDog, setTaxiDog] = React.useState(false);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setPetId(pets[0]?.id ?? "");
    setServiceName("Banho");
    setDate(new Date().toISOString().slice(0, 10));
    setTime("09:00");
    setTaxiDog(false);
    setNotes("");
  }, [open, pets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return;

    addAppointment({
      petId,
      serviceName,
      date,
      time,
      taxiDog,
      status: "Pendente",
      notes: notes.trim() || undefined,
    });

    showSuccess("Agendamento criado!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
          <CalendarDays size={18} className="mr-2" /> Agendar Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Agendar Serviço</DialogTitle>
          <DialogDescription>
            Escolha o pet, serviço, data e horário para o atendimento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Pet</Label>
              <Select value={petId} onValueChange={setPetId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((p) => {
                    const owner = customers.find((c) => c.id === p.customerId)?.name ?? "—";
                    return (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} • {owner}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Serviço</Label>
              <Select value={serviceName} onValueChange={setServiceName}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Banho">Banho</SelectItem>
                  <SelectItem value="Banho e Tosa">Banho e Tosa</SelectItem>
                  <SelectItem value="Tosa">Tosa</SelectItem>
                  <SelectItem value="Consulta Veterinária">Consulta Veterinária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-10 rounded-xl" required />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                  <Car size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-900">Taxi Dog</p>
                  <p className="text-xs text-orange-700">Leva e traz o pet</p>
                </div>
              </div>
              <Switch checked={taxiDog} onCheckedChange={setTaxiDog} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: Alergia a shampoo de coco" className="rounded-xl" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold">
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleServiceDialog;