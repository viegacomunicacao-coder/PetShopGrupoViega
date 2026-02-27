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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Camera, MapPin, Car, CalendarDays, UserRound } from "lucide-react";
import { useStore } from "@/store/store";
import type { Species, PetSize } from "@/store/types";
import { showSuccess } from "@/utils/toast";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("failed_to_read_file"));
    reader.readAsDataURL(file);
  });
}

const AddPetDialog = () => {
  const { customers, addCustomer, addPet } = useStore();
  const [open, setOpen] = React.useState(false);

  const [photoDataUrl, setPhotoDataUrl] = React.useState<string | undefined>(undefined);
  const [petName, setPetName] = React.useState("");
  const [species, setSpecies] = React.useState<Species>("Cachorro");
  const [birthDate, setBirthDate] = React.useState("");
  const [size, setSize] = React.useState<PetSize>("Médio");

  const [ownerName, setOwnerName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [taxiDogPref, setTaxiDogPref] = React.useState(false);

  const onPickPhoto = async (file?: File | null) => {
    if (!file) return;
    const data = await fileToDataUrl(file);
    setPhotoDataUrl(data);
  };

  const reset = () => {
    setPhotoDataUrl(undefined);
    setPetName("");
    setSpecies("Cachorro");
    setBirthDate("");
    setSize("Médio");
    setOwnerName("");
    setAddress("");
    setTaxiDogPref(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingCustomer = customers.find(
      (c) => c.name.toLowerCase() === ownerName.trim().toLowerCase(),
    );
    const customerId = existingCustomer
      ? existingCustomer.id
      : addCustomer({ name: ownerName.trim(), address: address.trim() || undefined });

    addPet({
      name: petName.trim(),
      species,
      customerId,
      birthDate: birthDate || undefined,
      size,
      photoDataUrl,
      taxiDogPref,
    });

    showSuccess("Pet cadastrado com sucesso!");
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" /> Novo Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cadastrar Novo Pet</DialogTitle>
          <DialogDescription>Foto + nascimento + tutor + porte + Taxi Dog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 rounded-3xl border-2 border-white shadow-sm">
              <AvatarImage src={photoDataUrl} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Camera size={28} />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label className="text-sm">Foto do pet</Label>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full bg-white"
                  onClick={() => document.getElementById("new-pet-photo")?.click()}
                >
                  <Camera size={18} className="mr-2" /> Escolher foto
                </Button>
                <input
                  id="new-pet-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickPhoto(e.target.files?.[0])}
                />
                {photoDataUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-slate-500"
                    onClick={() => setPhotoDataUrl(undefined)}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">A foto é salva no navegador (local).</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pet</Label>
                <Input
                  id="name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ex: Rex"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Espécie</Label>
                <Select value={species} onValueChange={(v) => setSpecies(v as Species)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cachorro">Cachorro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Porte</Label>
                <Select value={size} onValueChange={(v) => setSize(v as PetSize)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pequeno">Pequeno</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                    <SelectItem value="GG">GG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data de nascimento</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  type="date"
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome do Tutor</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="pl-10 rounded-xl"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Se o tutor já existir com o mesmo nome, o pet será vinculado automaticamente.</p>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro..."
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                  <Car size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-900">Utiliza Taxi Dog?</p>
                  <p className="text-xs text-orange-700">Ativar preferência de transporte</p>
                </div>
              </div>
              <Switch checked={taxiDogPref} onCheckedChange={setTaxiDogPref} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full py-6 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20">
              Finalizar Cadastro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;