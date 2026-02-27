"use client";

import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import MobileNav from '@/components/MobileNav';
import StatsCard from '@/components/StatsCard';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Download, ArrowUpRight, ArrowDownRight, Receipt, CreditCard, Banknote, QrCode, FileSpreadsheet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { cn } from "@/lib/utils";
import { exportElementToPDF } from "@/utils/pdf";
import { useStore } from "@/store/store";
import type { Transaction } from "@/store/types";
import { exportToCSV } from "@/utils/csv";

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function ymKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthShortPT(d: Date) {
  return d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
}
function isSameMonth(d: Date, ref: Date) {
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}
function toDate(isoDate: string) {
  return new Date(isoDate + "T00:00:00");
}

const Financial = () => {
  const { transactions } = useStore();

  // Recent transactions (latest 10)
  const recent = [...transactions].sort((a, b) =>
    (b.date + b.createdAt).localeCompare(a.date + a.createdAt)
  ).slice(0, 10);

  // Compute current month aggregates
  const now = new Date();
  const monthIncomes = transactions.filter(t => t.type === "income" && isSameMonth(toDate(t.date), now))
    .reduce((sum, t) => sum + t.amountCents, 0);
  const monthExpenses = transactions.filter(t => t.type === "expense" && isSameMonth(toDate(t.date), now))
    .reduce((sum, t) => sum + t.amountCents, 0);
  const net = monthIncomes - monthExpenses;
  const incomeCount = transactions.filter(t => t.type === "income" && isSameMonth(toDate(t.date), now)).length;
  const ticketMedio = incomeCount > 0 ? Math.round(monthIncomes / incomeCount) : 0;

  // Build last 6 months data
  const months: Array<{ key: string; label: string; start: Date; end: Date }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    months.push({ key: ymKey(d), label: monthShortPT(d).charAt(0).toUpperCase() + monthShortPT(d).slice(1), start, end });
  }
  const REVENUE_DATA = months.map((m) => {
    const receita = transactions.filter(t => t.type === "income").filter(t => {
      const dt = toDate(t.date);
      return dt >= m.start && dt <= m.end;
    }).reduce((sum, t) => sum + t.amountCents, 0);
    const despesas = transactions.filter(t => t.type === "expense").filter(t => {
      const dt = toDate(t.date);
      return dt >= m.start && dt <= m.end;
    }).reduce((sum, t) => sum + t.amountCents, 0);
    return { month: m.label, receita: Math.round(receita / 100), despesas: Math.round(despesas / 100) };
  });

  // Category income breakdown (top 3)
  const catMap = new Map<string, number>();
  transactions.filter(t => t.type === "income").forEach(t => {
    catMap.set(t.category, (catMap.get(t.category) || 0) + t.amountCents);
  });
  const allCats = Array.from(catMap.entries()).sort((a,b) => b[1] - a[1]);
  const CATEGORY_DATA = allCats.slice(0, 3).map(([name, value]) => {
    // assign stable colors
    const palette = ["#6366f1", "#22c55e", "#f97316", "#06b6d4", "#a855f7"];
    const idx = Math.floor(Math.random() * palette.length);
    return { name, value: Math.round(value / 100), color: palette[idx] };
  });

  // Payment methods distribution (percent from incomes)
  const pmCounts = new Map<string, number>();
  let totalIncomeCount = 0;
  transactions.filter(t => t.type === "income").forEach(t => {
    totalIncomeCount += 1;
    const pm = t.paymentMethod || "—";
    pmCounts.set(pm, (pmCounts.get(pm) || 0) + 1);
  });
  const pmArray = Array.from(pmCounts.entries()).map(([name, count]) => ({
    name,
    value: totalIncomeCount > 0 ? Math.round((count / totalIncomeCount) * 100) : 0,
    icon: name === "PIX" ? QrCode : name === "Cartão" ? CreditCard : Banknote,
  }));
  const PAYMENT_DATA = pmArray.length ? pmArray : [
    { name: "PIX", value: 0, icon: QrCode },
    { name: "Cartão", value: 0, icon: CreditCard },
    { name: "Dinheiro", value: 0, icon: Banknote },
  ];

  const onExportPDF = async () => {
    await exportElementToPDF("financial-report", "Relatorio-Financeiro.pdf");
  };

  const onExportCSV = () => {
    const rows = transactions.map((t: Transaction) => ({
      Data: t.date,
      Tipo: t.type === "income" ? "Receita" : "Despesa",
      Descrição: t.description,
      Categoria: t.category,
      Valor: (t.amountCents / 100).toFixed(2).replace(".", ","),
      "Forma de Pagamento": t.paymentMethod || "",
    }));
    exportToCSV(rows, "transacoes.csv");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background pb-16">
      <AppSidebar />
      <MobileNav />

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Financeiro</h1>
            <p className="text-slate-500">Controle de fluxo de caixa e faturamento</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="rounded-full gap-2 bg-white" onClick={onExportCSV}>
              <FileSpreadsheet size={18} /> Exportar CSV
            </Button>
            <Button variant="outline" className="rounded-full gap-2 bg-white" onClick={onExportPDF}>
              <Download size={18} /> Exportar PDF
            </Button>
            <AddTransactionDialog />
          </div>
        </header>

        <div id="financial-report" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Tabs defaultValue="month" className="w-full sm:w-auto">
              <TabsList className="rounded-full bg-white border border-slate-100 shadow-sm p-1">
                <TabsTrigger value="today" className="rounded-full">Hoje</TabsTrigger>
                <TabsTrigger value="week" className="rounded-full">Semana</TabsTrigger>
                <TabsTrigger value="month" className="rounded-full">Mês</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-white border border-slate-100 text-slate-700">Fechamento: 18:00</Badge>
              <Badge className="rounded-full bg-green-100 text-green-700 border-none">Caixa aberto</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Receita (mês)" value={formatBRL(monthIncomes)} icon={TrendingUp} color="bg-green-500" />
            <StatsCard title="Despesas (mês)" value={formatBRL(monthExpenses)} icon={TrendingDown} color="bg-red-500" />
            <StatsCard title="Lucro líquido" value={formatBRL(net)} icon={DollarSign} color="bg-primary" />
            <StatsCard title="Ticket médio" value={formatBRL(ticketMedio)} icon={Receipt} color="bg-orange-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Receitas x Despesas</CardTitle>
              </CardHeader>
              <CardContent className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 14, border: '1px solid #eef2f7' }}
                      cursor={{ fill: '#f8fafc' }}
                      formatter={(val: any, name: string) => {
                        const label = name === "receita" ? "Receita" : "Despesas";
                        return [formatBRL(Number(val) * 100), label];
                      }}
                    />
                    <Area type="monotone" dataKey="receita" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                    <Area type="monotone" dataKey="despesas" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="6 6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="lg:col-span-1 space-y-6">
              <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Receita por categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CATEGORY_DATA} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 14, border: '1px solid #eef2f7' }}
                        cursor={{ fill: '#f8fafc' }}
                        formatter={(value: number) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                      />
                      <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                        {CATEGORY_DATA.map((c, idx) => (
                          <Cell key={idx} fill={c.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Formas de pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PAYMENT_DATA.map((p) => (
                    <div key={p.name} className="flex items-center justify-between rounded-2xl bg-slate-50/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700">
                          <p.icon size={18} />
                        </div>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                      </div>
                      <span className="font-black text-slate-900">{p.value}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Últimas transações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "p-2 rounded-xl shrink-0",
                        t.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}
                    >
                      {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{t.description}</p>
                      <p className="text-xs text-slate-500">{new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={cn("font-black", t.type === 'income' ? "text-green-600" : "text-red-600")}>
                      {t.type === 'income' ? '+' : '-'} {formatBRL(t.amountCents)}
                    </p>
                    <Badge variant="outline" className="text-[10px] uppercase px-2 py-0 rounded-full bg-white">
                      {t.category}
                    </Badge>
                  </div>
                </div>
              ))}

              {recent.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-6">
                  Sem transações registradas.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Financial;