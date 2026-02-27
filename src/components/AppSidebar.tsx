"use client";

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Package,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  DollarSign,
  Scissors,
  Car
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PawPrint, label: 'Pets', path: '/dashboard' },
  { icon: Users, label: 'Clientes', path: '/customers' },
  { icon: Scissors, label: 'Serviços', path: '/services' },
  { icon: Package, label: 'Inventário', path: '/inventory' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: Car, label: 'Taxi Dog', path: '/taxidog' },
  { icon: DollarSign, label: 'Financeiro', path: '/financial' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useStore();
  const brand = settings.brand;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        {brand.logoDataUrl ? (
          <img
            src={brand.logoDataUrl}
            alt={brand.name}
            className="w-8 h-8 rounded-xl object-contain"
          />
        ) : (
          <div className="bg-primary p-2 rounded-2xl shadow-sm shadow-primary/20 overflow-hidden">
            <PawPrint className="text-white" size={24} />
          </div>
        )}
        <span className="font-black text-xl text-slate-900 tracking-tight truncate">{brand.name}</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-2xl transition-all group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;