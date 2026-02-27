"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScheduleServiceDialog from "@/components/ScheduleServiceDialog";
import ServicePackageCard from "@/components/ServicePackageCard";
import PackageManagerDialog from "@/components/PackageManagerDialog";
import PetEditDialog from "@/components/PetEditDialog";
import DeletePetDialog from "@/components/DeletePetDialog";
import { useStore, getPetById, getCustomerById, getActivePackage, getNextBathDateFromPackage } from "@/store/store";
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Edit2,
  Scissors,
  Droplets,
  MapPin,
  Scale,
  Activity,
  Plus,
  Car,
} from "lucide-react";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, customers } = useStore();

  const pet = id ? getPetById(pets, id) : undefined;
  const customer = pet ? getCustomerById(customers, pet.customerId) : undefined;

  if (!pet) {
    return (
      <div className="min-h-screen bg-background p-6 pb-16">
        <div className="max-w-3xl mx-auto bg-white/80 rounded-[2rem] p-8">
          <p className="text-slate-700 font-semibold">Pet não encontrado.</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4 rounded-full">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const activePkg = getActivePackage(pet);
  const nextBathDate = activePkg ? getNextBathDateFromPackage(activePkg) : "—";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="hover:bg-white/50 rounded-full">
            <ArrowLeft size={20} className="mr-2" /> Voltar
          </Button>
          <div className="flex gap-2">
            <ScheduleServiceDialog />
            <PetEditDialog
              pet={pet}
              trigger={
                <Button variant="outline" size="icon" className="rounded-full bg-white" aria-label="Editar pet" title="Editar pet">
                  <Edit2 size={18} />
                </Button>
              }
            />
            <DeletePetDialog petId={pet.id} petName={pet.name} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative">
              <img
                src={
                  pet.photoDataUrl ||
                  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop"
                }
                alt={pet.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {pet.taxiDogPref && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-xl shadow-lg flex items-center gap-2">
                  <Car size={16} />
                  <span className="text-xs font-bold">Taxi Dog Ativo</span>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-primary" /> Tutor
                </h3>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-700">{customer?.name ?? "—"}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Phone size={14} /> {customer?.phone ?? "—"}
                  </p>
                  <p className="text-sm text-slate-500 flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" /> {customer?.address ?? "—"}
                  </p>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-3 py-1.5">
                      <Car size={14} className="text-orange-600" />
                      <span className="text-xs font-bold text-orange-800">Taxi Dog:</span>
                      <span className="text-xs text-orange-800">{pet.taxiDogPref ? "Ativo" : "Não"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-primary" /> Informações
                </h3>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Scale size={16} /> <span className="text-sm">Porte</span>
                  </div>
                  <span className="font-bold text-slate-900">{pet.size ?? "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <h1 className="text-4xl font-black text-slate-900">{pet.name}</h1>
                <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-1 rounded-full">
                  {pet.species}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Calendar size={20} className="text-primary" /> Pacotes de Banho
                    </h3>
                    <PackageManagerDialog
                      pet={pet}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-primary font-bold">
                          <Plus size={16} className="mr-1" /> Gerenciar
                        </Button>
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    {activePkg ? (
                      <ServicePackageCard
                        type={activePkg.type}
                        totalServices={activePkg.totalBaths}
                        usedServices={activePkg.usedBaths}
                        nextServiceDate={nextBathDate}
                      />
                    ) : (
                      <div className="rounded-[2rem] bg-white/50 border border-slate-100 p-6">
                        <p className="font-bold text-slate-900">Sem pacote ativo</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Crie um pacote para controlar banhos recorrentes.
                        </p>
                        <div className="mt-4">
                          <PackageManagerDialog
                            pet={pet}
                            trigger={<Button className="rounded-full">Criar pacote</Button>}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-500">
                      Mensal: 4 banhos (1 por semana). Quinzenal: 2 banhos (1 a cada 15 dias).
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white/50 border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-900">Observações</h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Use agendamentos + pacotes para registrar banhos e organizar o Taxi Dog.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Banho
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Tosa
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Taxi Dog
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-primary" /> Histórico Recente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                        <Scissors size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Banho e Tosa</p>
                        <p className="text-xs text-slate-500">Último registro (demo)</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">
                      Concluído
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                        <Droplets size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Banho</p>
                        <p className="text-xs text-slate-500">Último registro (demo)</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">
                      Concluído
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default PetDetails;