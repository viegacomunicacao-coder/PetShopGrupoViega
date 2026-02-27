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
import { Plus, Scissors, Clock, DollarSign } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useStore } from "@/store/store";

function parsePriceToCents(input: string): number {
  const digits = (input || "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const AddServiceDialog = () => {
  const { addService } = useStore();
  const [open, setOpen] = React.useState(false);

  const [name, setName] = React.useState("");
  const [duration, setDuration] = React.useState<string>("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState<string>("Banho");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const durationMin = parseInt(duration || "0", 10);
    const priceCents = parsePriceToCents(price);

    addService({
      name: name.trim(),
      durationMin: Number.isFinite(durationMin) ? durationMin : 0,
      priceCents,
      category,
      active: true,
    });

    showSuccess("Serviço adicionado com sucesso!");
    setOpen(false);
    setName("");
    setDuration("");
    setPrice("");
    setCategory("Banho");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus size={18} className="mr-2" /> Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Novo Serviço</DialogTitle>
          <DialogDescription>Cadastre um novo tipo de atendimento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                placeholder="Ex: Tosa na Tesoura"
                className="rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    className="pl-10 rounded-xl"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="price"
                    placeholder="0,00"
                    className="pl-10 rounded-xl"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
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
            <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold">
              Salvar Serviço
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;