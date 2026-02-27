"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PawPrint, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { useStore } from "@/store/store";
import { useSession } from "@/integrations/supabase/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const Index = () => {
  const navigate = useNavigate();
  const { settings } = useStore();
  const brand = settings.brand;
  const { session } = useSession();

  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showSuccess("Login realizado com sucesso!");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          showSuccess("Cadastro criado! Verifique seu e-mail para confirmar o acesso.");
        } else {
          showSuccess("Conta criada e sessão iniciada!");
        }
      }
    } catch (err: any) {
      showError(err?.message || "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  const onRecover = async () => {
    if (!email) {
      showError("Informe seu e-mail para recuperar a senha.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      showSuccess("Se existir uma conta, enviaremos um e-mail de recuperação.");
    } catch (err: any) {
      showError(err?.message || "Não foi possível iniciar a recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pb-16">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <PawPrint className="absolute top-10 left-10 rotate-12 text-primary" size={120} />
        <PawPrint className="absolute bottom-20 right-20 -rotate-12 text-primary" size={160} />
        <PawPrint className="absolute top-1/2 left-1/4 rotate-45 text-primary" size={80} />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pb-2">
          {brand.logoDataUrl ? (
            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden bg-transparent">
              <img
                src={brand.logoDataUrl}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="mx-auto bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20 overflow-hidden">
              <PawPrint className="text-white" size={32} />
            </div>
          )}
          <CardTitle className="text-3xl font-bold text-slate-900">{brand.name}</CardTitle>
          <CardDescription className="text-slate-500">
            {mode === "signin" ? "Acesse sua conta para gerenciar seus clientes" : "Crie sua conta para começar"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 py-6 rounded-xl border-slate-200 focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button type="button" variant="link" className="p-0 h-auto text-xs text-primary" onClick={onRecover}>
                  Esqueceu a senha?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 py-6 rounded-xl border-slate-200 focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {loading ? "Aguarde..." : mode === "signin" ? "Entrar no Sistema" : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {mode === "signin" ? (
              <>
                Não tem conta?{" "}
                <button
                  type="button"
                  className="text-primary font-semibold underline underline-offset-4"
                  onClick={() => setMode("signup")}
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já possui conta?{" "}
                <button
                  type="button"
                  className="text-primary font-semibold underline underline-offset-4"
                  onClick={() => setMode("signin")}
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;