"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/store";
import { showError, showSuccess } from "@/utils/toast";
import { ImageUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 500 * 1024;

export default function LogoUploader() {
  const { settings, updateSettings } = useStore();
  const logo = settings.brand.logoDataUrl;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const validateAndLoad = (file: File) => {
    if (file.size > MAX_BYTES) {
      showError("Arquivo muito grande. Use uma imagem de até 500KB.");
      return;
    }

    const okTypes = ["image/png", "image/svg+xml", "image/jpeg", "image/jpg"];
    if (!okTypes.includes(file.type)) {
      showError("Formato não suportado. Use PNG, JPG ou SVG.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      updateSettings({ brand: { logoDataUrl: dataUrl } });
      showSuccess("Logo atualizada!");
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    validateAndLoad(file);
  };

  const onRemove = () => {
    updateSettings({ brand: { logoDataUrl: undefined } });
    showSuccess("Logo removida.");
  };

  const openPicker = () => fileInputRef.current?.click();

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    validateAndLoad(file);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <Card className="border-none bg-slate-50/60 rounded-[1.5rem] p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-dashed p-3 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-slate-200 bg-white",
          )}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          role="button"
          aria-label="Solte a imagem aqui"
          title="Solte a imagem aqui"
          onClick={openPicker}
        >
          <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center">
            {logo ? (
              <img src={logo} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                <ImageUp size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800">Logo</p>
            <p className="text-xs text-slate-500 truncate">
              PNG, JPG ou SVG • até 500KB • clique ou arraste para enviar
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleInputChange}
          />
          <Button type="button" className="rounded-xl gap-2" onClick={openPicker}>
            <ImageUp size={16} /> Enviar
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl gap-2 bg-white"
            onClick={onRemove}
            disabled={!logo}
          >
            <Trash2 size={16} /> Remover
          </Button>
        </div>
      </div>
    </Card>
  );
}