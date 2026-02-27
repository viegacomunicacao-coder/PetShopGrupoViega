"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { TaxiDogStatus } from "@/store/types";
import { cn } from "@/lib/utils";

export default function TaxiDogStatusPill({ status }: { status: TaxiDogStatus }) {
  return (
    <Badge
      className={cn(
        "rounded-full border-none",
        status === "pending" && "bg-slate-100 text-slate-700",
        status === "in_progress" && "bg-orange-100 text-orange-700",
        status === "completed" && "bg-green-100 text-green-700",
      )}
    >
      {status === "pending" ? "Pendente" : status === "in_progress" ? "Em rota" : "Concluído"}
    </Badge>
  );
}
