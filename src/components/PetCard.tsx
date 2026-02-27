"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PawPrint, ChevronRight, Car, Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useStore, getPetById } from "@/store/store";
import PetEditDialog from "@/components/PetEditDialog";

interface PetCardProps {
  id: any;
  name: string;
  species: string;
  owner: string;
  photo: string;
  taxiDog?: boolean;
}

const PetCard = ({ id, name, species, owner, photo, taxiDog = false }: PetCardProps) => {
  const navigate = useNavigate();
  const { pets } = useStore();
  const storePet = typeof id === "string" ? getPetById(pets, id) : undefined;

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white/80 backdrop-blur-sm cursor-pointer group relative"
      onClick={() => navigate(`/pet/${id}`)}
    >
      {taxiDog && (
        <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white p-1.5 rounded-lg shadow-md">
          <Car size={14} />
        </div>
      )}

      {storePet && (
        <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <PetEditDialog
            pet={storePet}
            trigger={
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-xl bg-white/90 hover:bg-white shadow-sm"
                aria-label="Editar pet"
                title="Editar pet"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil size={14} className="text-slate-700" />
              </Button>
            }
          />
        </div>
      )}

      <CardContent className="p-6 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:scale-105 transition-transform">
          <AvatarImage src={photo} alt={name} className="object-cover" loading="lazy" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <PawPrint size={24} />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800">{name}</h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
              {species}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">Tutor: {owner}</p>
        </div>
        <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
      </CardContent>
    </Card>
  );
};

export default PetCard;