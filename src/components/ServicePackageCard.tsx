"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Circle } from "lucide-react";

interface ServicePackageProps {
  type: 'mensal' | 'quinzenal';
  totalServices: number;
  usedServices: number;
  nextServiceDate: string;
}

const ServicePackageCard = ({ type, totalServices, usedServices, nextServiceDate }: ServicePackageProps) => {
  const progress = (usedServices / totalServices) * 100;
  
  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 capitalize">Pacote {type}</h4>
              <p className="text-xs text-slate-500">{totalServices} banhos inclusos</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-none">
            Ativo
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Progresso</span>
            <span className="font-bold text-slate-700">{usedServices} de {totalServices}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
          
          <div className="flex gap-2 pt-2">
            {Array.from({ length: totalServices }).map((_, i) => (
              <div key={i} className="flex-1 flex justify-center">
                {i < usedServices ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-slate-200" />
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Próximo banho:</span>
            <span className="text-xs font-bold text-primary">{nextServiceDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicePackageCard;