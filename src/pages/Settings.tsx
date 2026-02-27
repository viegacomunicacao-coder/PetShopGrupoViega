"use client";

import React from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Bell, Shield, Save, Key, Smartphone, Phone, Clock, BadgeCheck } from "lucide-react";
import { useStore } from "@/store/store";
import { Switch } from "@/components/ui/switch";
import { showSuccess } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";
import LogoUploader from "@/components/LogoUploader";

const Settings = () => {
  const { settings, updateSettings } = useStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Configurações salvas com sucesso!");
  };

  const notifications = settings.notifications;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500">Gerencie as preferências do seu sistema</p>
        </header>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <TabsTrigger value="general" className="rounded-lg gap-2">
              <Store size={16} /> Geral
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg gap-2">
              <Bell size={16} /> Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2">
              <Shield size={16} /> Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck size={18} className="text-primary" /> Identidade
                </CardTitle>
                <CardDescription>
                  Personalize nome e logo do estabelecimento em todo o sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Nome do estabelecimento</Label>
                  <Input
                    id="brandName"
                    value={settings.brand.name}
                    onChange={(e) => updateSettings({ brand: { name: e.target.value } })}
                    className="rounded-xl"
                    placeholder="Ex.: PetShop Central"
                  />
                </div>

                <LogoUploader />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle>Dados do Estabelecimento</CardTitle>
                <CardDescription>
                  Informações que aparecerão nos comprovantes e agendamentos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="shopName">Nome do Pet Shop / Clínica</Label>
                      <Input id="shopName" defaultValue="PetManager Matriz" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input id="cnpj" defaultValue="00.000.000/0001-00" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail de Contato</Label>
                      <Input id="email" type="email" defaultValue="contato@petmanager.com" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" defaultValue="(11) 4002-8922" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input id="address" defaultValue="Av. Paulista, 1000 - São Paulo, SP" className="rounded-xl" />
                  </div>
                  <Button type="submit" className="rounded-xl gap-2">
                    <Save size={18} /> Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle>Preferências de Alerta</CardTitle>
                <CardDescription>
                  Configure os lembretes de WhatsApp automáticos para os tutores.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">WhatsApp 24 horas antes</p>
                      <p className="text-sm text-slate-500">Envia lembrete 24h antes do horário agendado.</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.whatsapp24h}
                    onCheckedChange={(v) =>
                      updateSettings({
                        notifications: {
                          whatsapp24h: v,
                          whatsapp2h: notifications.whatsapp2h,
                          reminderTemplate: notifications.reminderTemplate,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">WhatsApp 2 horas antes</p>
                      <p className="text-sm text-slate-500">Envia lembrete 2h antes do horário agendado.</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.whatsapp2h}
                    onCheckedChange={(v) =>
                      updateSettings({
                        notifications: {
                          whatsapp24h: notifications.whatsapp24h,
                          whatsapp2h: v,
                          reminderTemplate: notifications.reminderTemplate,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem de lembrete (WhatsApp)</Label>
                  <Textarea
                    value={notifications.reminderTemplate}
                    onChange={(e) =>
                      updateSettings({
                        notifications: {
                          whatsapp24h: notifications.whatsapp24h,
                          whatsapp2h: notifications.whatsapp2h,
                          reminderTemplate: e.target.value,
                        },
                      })
                    }
                    className="rounded-xl"
                    rows={4}
                    placeholder="Use {pet}, {servico}, {data}, {hora} para inserir informações dinâmicas."
                  />
                  <p className="text-xs text-slate-500">
                    Variáveis disponíveis: {"{pet}"}, {"{servico}"}, {"{data}"}, {"{hora}"}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Proteja seu acesso e gerencie senhas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                      <Key size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-700">Alterar Senha</p>
                      <p className="text-sm text-slate-500">Recomendamos trocar a cada 90 dias.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Configurar
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                      <Smartphone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-700">Autenticação em Duas Etapas</p>
                      <p className="text-sm text-slate-500">Adicione uma camada extra de proteção.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;