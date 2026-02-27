"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useStore } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast";

export default function DeleteCustomerDialog({
  customerId,
  customerName,
  triggerLabel = "Excluir Cliente",
  redirectTo = "/customers",
}: {
  customerId: string;
  customerName?: string;
  triggerLabel?: string;
  redirectTo?: string;
}) {
  const navigate = useNavigate();
  const { deleteCustomer } = useStore();
  const [open, setOpen] = React.useState(false);

  const onConfirm = () => {
    deleteCustomer(customerId);
    showSuccess("Cliente excluído com sucesso.");
    setOpen(false);
    navigate(redirectTo);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full bg-white text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} className="mr-2" />
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            {customerName ? `O cliente "${customerName}" ` : "Este cliente "}será removido com todos os pets e agendamentos relacionados. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
          Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}