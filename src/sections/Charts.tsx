import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import type { RevenueData } from '@/types';

interface ChartsProps {
  getRevenueData: (period: 'week' | 'month' | 'year') => RevenueData[];
}

export function Charts({ getRevenueData }: ChartsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('area');

  const data = getRevenueData(period);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentTotal = data.reduce((sum, item) => sum + item.current, 0);
  const previousTotal = data.reduce((sum, item) => sum + item.previous, 0);
  const variation = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

  const renderChart = () => {
    // Ajuste de margens dinâmico: menos espaço no mobile para o gráfico respirar
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: -20, bottom: 0 },
    };

    const shared = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="period" 
          stroke="rgba(255,255,255,0.5)" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.5)" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(0)+'k' : value}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          itemStyle={{ fontSize: '12px' }}
        />
      </>
    );

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {shared}
            <Bar dataKey="current" name="Atual" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="previous" name="Anterior" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {shared}
            <Line type="monotone" dataKey="current" name="Atual" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="previous" name="Anterior" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {shared}
            <Area type="monotone" dataKey="current" name="Atual" stroke="#8b5cf6" fill="url(#colorCurrent)" strokeWidth={3} />
            <Area type="monotone" dataKey="previous" name="Anterior" stroke="rgba(255,255,255,0.2)" fill="transparent" strokeDasharray="5 5" />
          </AreaChart>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      
      {/* 1. Cards de Resumo - Grid Empilhável */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/20 shrink-0">
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white/60 text-xs sm:text-sm">Atual</p>
            <p className="text-lg sm:text-2xl font-bold text-white truncate">{formatCurrency(currentTotal)}</p>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 shrink-0">
            <BarChart3 className="w-5 h-5 text-white/60" />
          </div>
          <div className="min-w-0">
            <p className="text-white/60 text-xs sm:text-sm">Anterior</p>
            <p className="text-lg sm:text-2xl font-bold text-white/70 truncate">{formatCurrency(previousTotal)}</p>
          </div>
        </div>

        <div className={`glass-card p-4 sm:p-6 rounded-2xl flex items-center gap-4 sm:col-span-2 lg:col-span-1 ${variation >= 0 ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
          <div className={`p-3 rounded-xl shrink-0 ${variation >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {variation >= 0 ? <ArrowUpRight className="w-5 h-5 text-emerald-400" /> : <ArrowDownRight className="w-5 h-5 text-red-400" />}
          </div>
          <div className="min-w-0">
            <p className={`text-xs sm:text-sm ${variation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Variação</p>
            <p className={`text-lg sm:text-2xl font-bold ${variation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* 2. Controles do Gráfico - Layout Adaptativo */}
      <div className="flex flex-col gap-3">
        {/* Filtro de Período */}
        <div className="flex bg-white/5 p-1 rounded-xl w-full overflow-x-auto no-scrollbar">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                period === p ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
            </button>
          ))}
        </div>

        {/* Filtro de Tipo de Gráfico */}
        <div className="flex bg-white/5 p-1 rounded-xl w-full overflow-x-auto no-scrollbar">
          {(['area', 'bar', 'line'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                chartType === t ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Área do Gráfico */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-bold text-white">Desempenho</h3>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4 text-white/60" />
          </button>
        </div>
        <div className="h-[250px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Tabela com Scroll Horizontal Seguro */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Detalhamento</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase text-white/40 tracking-tighter">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 text-right">Atual</th>
                <th className="px-4 py-3 text-right">Anterior</th>
                <th className="px-4 py-3 text-right">Var.</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {data.map((item, index) => {
                const itemVariation = item.previous > 0 ? ((item.current - item.previous) / item.previous) * 100 : 0;
                return (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white/90 whitespace-nowrap">{item.period}</td>
                    <td className="px-4 py-3 text-right text-violet-400 whitespace-nowrap">{formatCurrency(item.current)}</td>
                    <td className="px-4 py-3 text-right text-white/30 whitespace-nowrap">{formatCurrency(item.previous)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${itemVariation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {itemVariation >= 0 ? '↑' : '↓'}{Math.abs(itemVariation).toFixed(0)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}