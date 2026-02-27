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
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import type { Customer } from "@/store/types";
import { useStore } from "@/store/store";
import { showSuccess } from "@/utils/toast";

export default function ProfileEditDialog({
  customer,
  trigger,
}: {
  customer: Customer;
  trigger: React.ReactNode;
}) {
  const { updateCustomer } = useStore();
  const [open, setOpen] = React.useState(false);

  const [name, setName] = React.useState(customer.name);
  const [email, setEmail] = React.useState(customer.email ?? "");
  const [phone, setPhone] = React.useState(customer.phone ?? "");
  const [address, setAddress] = React.useState(customer.address ?? "");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setName(customer.name);
    setEmail(customer.email ?? "");
    setPhone(customer.phone ?? "");
    setAddress(customer.address ?? "");
    setNotes("");
  }, [open, customer]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(customer.id, {
      name: name.trim() || customer.name,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    });
    showSuccess("Perfil atualizado!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Editar tutor</DialogTitle>
          <DialogDescription>Atualize os dados de contato e endereço.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-6 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10 rounded-xl" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="pl-10 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="pl-10 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl" placeholder="Preferências do cliente, ponto de referência, etc." />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20">
              <Save size={18} className="mr-2" /> Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
