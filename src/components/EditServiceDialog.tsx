"use client";

import React from "react";
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
import { Edit2, Clock, DollarSign } from "lucide-react";
import { useStore } from "@/store/store";
import type { Service } from "@/store/types";
import { showSuccess } from "@/utils/toast";

function centsToBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function parsePriceToCents(input: string): number {
  const digits = (input || "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export default function EditServiceDialog({ service }: { service: Service }) {
  const { updateService } = useStore();
  const [open, setOpen] = React.useState(false);

  const [name, setName] = React.useState(service.name);
  const [duration, setDuration] = React.useState(String(service.durationMin));
  const [price, setPrice] = React.useState(centsToBRL(service.priceCents).replace("R$", "").trim());
  const [category, setCategory] = React.useState(service.category ?? "Outros");
  const [active, setActive] = React.useState(service.active);

  React.useEffect(() => {
    if (!open) return;
    setName(service.name);
    setDuration(String(service.durationMin));
    setPrice(centsToBRL(service.priceCents).replace("R$", "").trim());
    setCategory(service.category ?? "Outros");
    setActive(service.active);
  }, [open, service]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateService(service.id, {
      name: name.trim(),
      durationMin: parseInt(duration || "0", 10) || 0,
      priceCents: parsePriceToCents(price),
      category,
      active,
    });
    showSuccess("Serviço atualizado!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
          <Edit2 size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar Serviço</DialogTitle>
          <DialogDescription>Atualize as informações do serviço.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nome do Serviço</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" className="pl-10 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input value={price} onChange={(e) => setPrice(e.target.value)} className="pl-10 rounded-xl" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Banho">Banho</SelectItem>
                  <SelectItem value="Tosa">Tosa</SelectItem>
                  <SelectItem value="Veterinária">Veterinária</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}