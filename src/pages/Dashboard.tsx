"use client";

import React from 'react';
import PetCard from '@/components/PetCard';
import AddPetDialog from '@/components/AddPetDialog';
import StatsCard from '@/components/StatsCard';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import QuickSaleDialog from '@/components/QuickSaleDialog';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Scissors,
  Car
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useStore } from "@/store/store";

const CHART_DATA = [
  { name: 'Seg', atendimentos: 12 },
  { name: 'Ter', atendimentos: 19 },
  { name: 'Qua', atendimentos: 15 },
  { name: 'Qui', atendimentos: 22 },
  { name: 'Sex', atendimentos: 30 },
  { name: 'Sáb', atendimentos: 25 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { pets, customers } = useStore();

  const recentPets = pets.slice(0, 6).map((p) => {
    const owner = customers.find((c) => c.id === p.customerId)?.name ?? "—";
    return {
      id: p.id,
      name: p.name,
      species: p.species,
      owner,
      photo: p.photoDataUrl ?? "",
      taxiDog: p.taxiDogPref,
    };
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel de Controle</h1>
            <p className="text-slate-500">Gerencie sua clínica com eficiência.</p>
          </div>
          <div className="flex items-center gap-3">
            <AddPetDialog />
          </div>
        </header>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/agenda')}
            className="h-auto py-4 flex-col gap-2 rounded-3xl bg-white border-none shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar size={20} />
            </div>
            <span className="font-bold text-xs">Agenda</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/services')}
            className="h-auto py-4 flex-col gap-2 rounded-3xl bg-white border-none shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Scissors size={20} />
            </div>
            <span className="font-bold text-xs">Serviços</span>
          </Button>
          <QuickSaleDialog />
          <Button
            variant="outline"
            onClick={() => navigate('/taxidog')}
            className="h-auto py-4 flex-col gap-2 rounded-3xl bg-white border-none shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Car size={20} />
            </div>
            <span className="font-bold text-xs">Taxi Dog</span>
          </Button>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total de Pets" value={String(pets.length)} icon={Users} color="bg-blue-500" />
          <StatsCard title="Hoje" value="12" icon={Calendar} color="bg-orange-500" />
          <StatsCard title="Concluídos" value="85%" icon={CheckCircle2} color="bg-green-500" />
          <StatsCard title="Faturamento" value="R$ 1.240" icon={DollarSign} color="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Pets Recentes</h2>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 rounded-xl border-none bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentPets.map((pet) => (
                <PetCard key={pet.id as any} {...(pet as any)} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm h-full">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-primary" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Atendimentos / Semana</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="atendimentos" radius={[6, 6, 0, 0]}>
                      {CHART_DATA.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 4 ? '#22c55e' : '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;