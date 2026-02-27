"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import AddCustomerDialog from '@/components/AddCustomerDialog';
import { useStore } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Phone, User, ChevronRight } from "lucide-react";

const Customers = () => {
  const navigate = useNavigate();
  const { customers, pets } = useStore();
  const [query, setQuery] = React.useState("");

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").toLowerCase().includes(q)
    );
  });

  const petsCount = (customerId: string) => pets.filter((p) => p.customerId === customerId).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-500">Gerencie os tutores e seus contatos</p>
          </div>
          <AddCustomerDialog />
        </header>

        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="pl-10 py-6 rounded-2xl border-none bg-white shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((customer) => (
              <Card
                key={customer.id}
                className="border-none shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/customer/${customer.id}`)}
              >
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                      <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-slate-900">{customer.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Mail size={14} /> {customer.email ?? '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Phone size={14} /> {customer.phone ?? '—'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pets</p>
                      <p className="text-lg font-bold text-primary">{petsCount(customer.id)}</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Customers;