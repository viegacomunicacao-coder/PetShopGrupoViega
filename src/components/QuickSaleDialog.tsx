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
import { ShoppingBag, Search, Trash2 } from "lucide-react";
import { showSuccess } from '@/utils/toast';

const QuickSaleDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([{ id: 1, name: '', price: 0, qty: 1 }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Venda realizada com sucesso!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 rounded-3xl bg-white border-none shadow-sm hover:shadow-md transition-all"
        >
          <div className="p-2 bg-green-50 text-green-600 rounded-xl">
            <ShoppingBag size={20} />
          </div>
          <span className="font-bold text-xs">Venda Rápida</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Venda Rápida</DialogTitle>
          <DialogDescription>
            Registre a venda de produtos para um cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente (Opcional)</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">João Silva</SelectItem>
                  <SelectItem value="2">Maria Oliveira</SelectItem>
                  <SelectItem value="walkin">Consumidor Final</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Produtos</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input placeholder="Buscar produto..." className="pl-10 rounded-xl" />
                  </div>
                  <Button type="button" variant="secondary" className="rounded-xl">Adicionar</Button>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-bold text-slate-700">Ração Premium 15kg</p>
                      <p className="text-slate-500">R$ 189,90</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg bg-white">
                        <button type="button" className="px-2 py-1 text-slate-400">-</button>
                        <span className="px-2 font-bold">1</span>
                        <button type="button" className="px-2 py-1 text-slate-400">+</button>
                      </div>
                      <button type="button" className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">Total da Venda</span>
                <span className="text-2xl font-black text-primary">R$ 189,90</span>
              </div>
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="card">Cartão de Crédito/Débito</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20">
              Finalizar Venda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSaleDialog;