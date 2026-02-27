"use client";

import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, PawPrint, LayoutDashboard, Users, Package, Calendar, Settings, LogOut, DollarSign, Scissors, Car } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
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

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const { settings } = useStore();
  const brand = settings.brand;

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-2 min-w-0">
        {brand.logoDataUrl ? (
          <img
            src={brand.logoDataUrl}
            alt={brand.name}
            className="w-6 h-6 rounded-lg object-contain"
          />
        ) : (
          <div className="bg-primary p-1.5 rounded-2xl shadow-sm shadow-primary/20 overflow-hidden">
            <PawPrint className="text-white" size={20} />
          </div>
        )}
        <span className="font-black text-lg text-slate-900 truncate">{brand.name}</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Abrir menu" title="Abrir menu">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 border-none">
          <div className="p-6 flex items-center gap-3 border-b border-slate-50">
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
            <span className="font-black text-xl text-slate-900 truncate">{brand.name}</span>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl transition-all",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-semibold">Sair</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;