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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Camera, Car, Save, User } from "lucide-react";
import type { Pet, PetSize } from "@/store/types";
import { useStore } from "@/store/store";
import { showSuccess } from "@/utils/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("failed_to_read_file"));
    reader.readAsDataURL(file);
  });
}

export default function PetEditDialog({
  pet,
  trigger,
}: {
  pet: Pet;
  trigger: React.ReactNode;
}) {
  const { updatePet } = useStore();
  const [open, setOpen] = React.useState(false);

  const [name, setName] = React.useState(pet.name);
  const [birthDate, setBirthDate] = React.useState(pet.birthDate ?? "");
  const [size, setSize] = React.useState<PetSize>(pet.size ?? "Médio");
  const [taxiDogPref, setTaxiDogPref] = React.useState(Boolean(pet.taxiDogPref));
  const [photoDataUrl, setPhotoDataUrl] = React.useState<string | undefined>(pet.photoDataUrl);

  React.useEffect(() => {
    if (!open) return;
    setName(pet.name);
    setBirthDate(pet.birthDate ?? "");
    setSize(pet.size ?? "Médio");
    setTaxiDogPref(Boolean(pet.taxiDogPref));
    setPhotoDataUrl(pet.photoDataUrl);
  }, [open, pet]);

  const onPickPhoto = async (file?: File | null) => {
    if (!file) return;
    const data = await fileToDataUrl(file);
    setPhotoDataUrl(data);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePet(pet.id, {
      name: name.trim() || pet.name,
      birthDate: birthDate || undefined,
      size,
      taxiDogPref,
      photoDataUrl,
    });
    showSuccess("Pet atualizado!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Editar pet</DialogTitle>
          <DialogDescription>Atualize foto, data de nascimento, porte e preferências.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-6 py-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 rounded-3xl border-2 border-white shadow-sm">
              <AvatarImage src={photoDataUrl} alt={name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User size={28} />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Label className="text-sm">Foto</Label>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full bg-white"
                  onClick={() => document.getElementById(`pet-photo-${pet.id}`)?.click()}
                >
                  <Camera size={18} className="mr-2" /> Escolher foto
                </Button>
                <input
                  id={`pet-photo-${pet.id}`}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" required />
            </div>

            <div className="space-y-2">
              <Label>Data de nascimento</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Porte</Label>
              <Select value={size} onValueChange={(v) => setSize(v as any)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o porte" />
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

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white p-2 rounded-xl">
                <Car size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-orange-900">Taxi Dog</p>
                <p className="text-xs text-orange-700">Preferência de leva e traz</p>
              </div>
            </div>
            <Switch checked={taxiDogPref} onCheckedChange={setTaxiDogPref} />
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