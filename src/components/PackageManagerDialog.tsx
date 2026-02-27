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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Plus, Sparkles, X } from "lucide-react";
import type { Pet } from "@/store/types";
import { getActivePackage, getNextBathDateFromPackage, useStore } from "@/store/store";
import { showSuccess } from "@/utils/toast";

export default function PackageManagerDialog({
  pet,
  trigger,
}: {
  pet: Pet;
  trigger: React.ReactNode;
}) {
  const { addPackage, consumeBathFromActivePackage, deactivatePackage } = useStore();
  const [open, setOpen] = React.useState(false);

  const active = getActivePackage(pet);

  const [type, setType] = React.useState<"mensal" | "quinzenal">("mensal");
  const [startDate, setStartDate] = React.useState<string>(new Date().toISOString().slice(0, 10));

  React.useEffect(() => {
    if (!open) return;
    setStartDate(new Date().toISOString().slice(0, 10));
  }, [open]);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addPackage(pet.id, type, startDate);
    showSuccess("Pacote criado!");
  };

  const onConsume = () => {
    consumeBathFromActivePackage(pet.id);
    showSuccess("Banho consumido do pacote.");
  };

  const onDeactivate = () => {
    if (!active) return;
    deactivatePackage(pet.id, active.id);
    showSuccess("Pacote desativado.");
  };

  const nextDate = active ? getNextBathDateFromPackage(active) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Pacotes de banho</DialogTitle>
          <DialogDescription>
            Mensal: 4 banhos (1 por semana). Quinzenal: 2 banhos (1 a cada 15 dias).
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[2rem] bg-white/70 border border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900">Pacote ativo</p>
                  <p className="text-xs text-slate-500">Vinculado ao pet</p>
                </div>
              </div>
              {active ? (
                <Badge className="rounded-full bg-green-100 text-green-700 border-none">Ativo</Badge>
              ) : (
                <Badge className="rounded-full bg-slate-100 text-slate-700 border-none">Nenhum</Badge>
              )}
            </div>

            {active ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Tipo</span>
                  <span className="font-bold text-slate-800 capitalize">{active.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Progresso</span>
                  <span className="font-bold text-slate-800">{active.usedBaths} / {active.totalBaths}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Próximo banho</span>
                  <span className="font-bold text-primary">{nextDate}</span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Button onClick={onConsume} className="rounded-full flex-1">
                    <CheckCircle2 size={18} className="mr-2" /> Consumir banho
                  </Button>
                  <Button onClick={onDeactivate} variant="outline" className="rounded-full bg-white">
                    <X size={18} className="mr-2" /> Encerrar
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Dica: ao consumir o último banho, o pacote é encerrado automaticamente.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Crie um pacote ao lado para iniciar.</p>
            )}
          </div>

          <div className="rounded-[2rem] bg-white/70 border border-slate-100 p-5">
            <form onSubmit={onCreate} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900">Criar novo pacote</p>
                  <p className="text-xs text-slate-500">Ao criar, o pacote anterior (se houver) é encerrado.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal (4 banhos)</SelectItem>
                    <SelectItem value="quinzenal">Quinzenal (2 banhos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data de início</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="pl-10 rounded-xl bg-white" required />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20">
                  Criar pacote
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
