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
import { Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { showSuccess } from '@/utils/toast';
import { useStore } from "@/store/store";
import type { TransactionCategory } from "@/store/types";

function parsePriceToCents(input: string): number {
  const digits = (input || "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const AddTransactionDialog = () => {
  const { addTransaction } = useStore();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<'income' | 'expense'>('income');

  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState<TransactionCategory | "">("");

  React.useEffect(() => {
    if (!open) return;
    // reset defaults when opening
    setType("income");
    setDescription("");
    setAmount("");
    setCategory("");
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = parsePriceToCents(amount);

    // Basic mapping safeguard
    const categoryMapped: TransactionCategory =
      (category as TransactionCategory) || (type === "income" ? "Serviços" : "Outros");

    addTransaction({
      type,
      description: description.trim(),
      category: categoryMapped,
      amountCents,
      date: new Date().toISOString().slice(0, 10),
      // paymentMethod could be added here later if needed
    });

    showSuccess("Transação registrada com sucesso!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full gap-2">
          <Plus size={18} /> Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Registrar Movimentação</DialogTitle>
          <DialogDescription>
            Adicione uma nova entrada ou saída ao seu fluxo de caixa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                type === 'income' ? 'bg-white shadow-sm text-green-600 font-bold' : 'text-slate-500'
              }`}
            >
              <ArrowUpRight size={18} /> Receita
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                type === 'expense' ? 'bg-white shadow-sm text-red-600 font-bold' : 'text-slate-500'
              }`}
            >
              <ArrowDownRight size={18} /> Despesa
            </button>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Banho e Tosa do Max"
                className="rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0,00"
                  className="rounded-xl"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Produtos">Produtos</SelectItem>
                    <SelectItem value="Taxi Dog">Taxi Dog</SelectItem>
                    <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                    <SelectItem value="Fixos">Fixos</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className={`w-full py-6 rounded-xl text-lg font-semibold ${
                type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Confirmar Registro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;