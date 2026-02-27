"use client";

import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import AddProductDialog from '@/components/AddProductDialog';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: 1, name: "Ração Premium Cães Adultos", category: "Alimentação", stock: 15, price: "R$ 189,90", status: "Em estoque" },
  { id: 2, name: "Shampoo Hipoalergênico", category: "Higiene", stock: 4, price: "R$ 45,00", status: "Baixo estoque" },
  { id: 3, name: "Brinquedo Mordedor Corda", category: "Brinquedos", stock: 22, price: "R$ 29,90", status: "Em estoque" },
  { id: 4, name: "Antipulgas NexGard", category: "Saúde", stock: 0, price: "R$ 85,00", status: "Esgotado" },
];

const Inventory = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />
      
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Inventário</h1>
            <p className="text-slate-500">Controle de produtos e suprimentos</p>
          </div>
          <AddProductDialog />
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input 
              placeholder="Buscar produtos..." 
              className="pl-10 py-6 rounded-2xl border-none bg-white shadow-sm"
            />
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 font-bold text-slate-600 text-sm uppercase tracking-wider">Produto</th>
                    <th className="p-6 font-bold text-slate-600 text-sm uppercase tracking-wider">Categoria</th>
                    <th className="p-6 font-bold text-slate-600 text-sm uppercase tracking-wider">Estoque</th>
                    <th className="p-6 font-bold text-slate-600 text-sm uppercase tracking-wider">Preço</th>
                    <th className="p-6 font-bold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PRODUCTS.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <Package size={20} />
                          </div>
                          <span className="font-bold text-slate-700">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-6 text-slate-500">{product.category}</td>
                      <td className="p-6 font-semibold text-slate-700">{product.stock} un.</td>
                      <td className="p-6 font-bold text-primary">{product.price}</td>
                      <td className="p-6">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "border-none px-3 py-1",
                            product.status === "Em estoque" && "bg-green-100 text-green-700",
                            product.status === "Baixo estoque" && "bg-orange-100 text-orange-700",
                            product.status === "Esgotado" && "bg-red-100 text-red-700"
                          )}
                        >
                          {product.status === "Baixo estoque" && <AlertTriangle size={12} className="mr-1" />}
                          {product.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inventory;