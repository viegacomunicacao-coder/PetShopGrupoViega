"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import PetCard from '@/components/PetCard';
import AddPetDialog from '@/components/AddPetDialog';
import ProfileEditDialog from "@/components/ProfileEditDialog";
import DeleteCustomerDialog from "@/components/DeleteCustomerDialog";
import { useStore, getCustomerById, getPetsByCustomerId } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Edit2,
  User,
  CreditCard,
  History,
  Trash2
} from "lucide-react";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, pets } = useStore();

  const customer = id ? getCustomerById(customers, id) : undefined;
  const customerPets = customer ? getPetsByCustomerId(pets, customer.id) : [];

  if (!customer) {
    return (
      <div className="min-h-screen bg-background p-6 pb-16">
        <div className="max-w-3xl mx-auto bg-white/80 rounded-[2rem] p-8">
          <p className="text-slate-700 font-semibold">Cliente não encontrado.</p>
          <Button onClick={() => navigate('/customers')} className="mt-4 rounded-full">Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/customers')}
            className="hover:bg-white/50 rounded-full"
          >
            <ArrowLeft size={20} className="mr-2" /> Voltar para Clientes
          </Button>

          <div className="flex items-center gap-2">
            <ProfileEditDialog
              customer={customer}
              trigger={
                <Button variant="outline" className="rounded-full gap-2 bg-white">
                  <Edit2 size={18} /> Editar Perfil
                </Button>
              }
            />
            <DeleteCustomerDialog
              customerId={customer.id}
              customerName={customer.name}
              triggerLabel="Excluir Cliente"
              redirectTo="/customers"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 bg-primary/10 text-primary">
                  <AvatarFallback><User size={40} /></AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
                <p className="text-slate-500 text-sm">Cadastro: {new Date(customer.createdAt).toLocaleDateString('pt-BR')}</p>

                <div className="mt-8 space-y-4 text-left">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} className="text-primary" />
                    <span className="text-sm">{customer.email ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-primary" />
                    <span className="text-sm">{customer.phone ?? '—'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{customer.address ?? '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-white rounded-[2rem]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard size={20} />
                  <h3 className="font-bold">Resumo</h3>
                </div>
                <p className="text-primary-foreground/70 text-sm">Pets cadastrados</p>
                <p className="text-3xl font-black mt-1">{customerPets.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Pets do Cliente</h3>
                <AddPetDialog />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customerPets.map((pet) => (
                  <PetCard
                    key={pet.id as any}
                    id={pet.id as any}
                    name={pet.name}
                    species={pet.species}
                    owner={customer.name}
                    photo={pet.photoDataUrl ?? ''}
                    taxiDog={pet.taxiDogPref}
                  />
                ))}
              </div>
            </section>

            <section>
              <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <History size={20} className="text-primary" /> Últimas Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-slate-500">(Histórico completo será alimentado por agendamentos e vendas.)</div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetails;