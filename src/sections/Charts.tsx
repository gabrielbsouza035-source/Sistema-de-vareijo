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

  const getPeriodLabel = () => {
    switch (period) {
      case 'week':
        return 'Comparação Semanal';
      case 'month':
        return 'Comparação Mensal';
      case 'year':
        return 'Comparação Anual';
      default:
        return '';
    }
  };

  const getPeriodDescription = () => {
    switch (period) {
      case 'week':
        return 'Últimos 7 dias vs semana anterior';
      case 'month':
        return 'Últimas 4 semanas vs período anterior';
      case 'year':
        return 'Últimos 12 meses vs ano anterior';
      default:
        return '';
    }
  };

  const currentTotal = data.reduce((sum, item) => sum + item.current, 0);
  const previousTotal = data.reduce((sum, item) => sum + item.previous, 0);
  const variation = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border border-white/20">
          <p className="font-semibold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/70 text-sm">{entry.name}:</span>
              <span className="text-white font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-white/70">{value}</span>}
            />
            <Bar dataKey="current" name="Período Atual" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="previous" name="Período Anterior" fill="rgba(255,255,255,0.2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-white/70">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Período Atual" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#8b5cf6' }}
            />
            <Line 
              type="monotone" 
              dataKey="previous" 
              name="Período Anterior" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth={3}
              dot={{ fill: 'rgba(255,255,255,0.4)', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,255,255,0.3)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgba(255,255,255,0.3)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-white/70">{value}</span>}
            />
            <Area 
              type="monotone" 
              dataKey="current" 
              name="Período Atual" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCurrent)" 
            />
            <Area 
              type="monotone" 
              dataKey="previous" 
              name="Período Anterior" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrevious)" 
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-violet-500/20">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Período Atual</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(currentTotal)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/10">
              <BarChart3 className="w-6 h-6 text-white/60" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Período Anterior</p>
              <p className="text-2xl font-bold text-white/70">{formatCurrency(previousTotal)}</p>
            </div>
          </div>
        </div>
        <div className={`glass-card p-6 rounded-2xl ${variation >= 0 ? 'glow-green' : 'glow-red'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${variation >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {variation >= 0 ? (
                <ArrowUpRight className={`w-6 h-6 ${variation >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
              ) : (
                <ArrowDownRight className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <p className={`text-sm ${variation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Variação</p>
              <p className={`text-2xl font-bold ${variation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
              className={period === 'week' ? 'bg-violet-600 hover:bg-violet-700' : 'btn-secondary'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Semana
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
              className={period === 'month' ? 'bg-violet-600 hover:bg-violet-700' : 'btn-secondary'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Mês
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'outline'}
              onClick={() => setPeriod('year')}
              className={period === 'year' ? 'bg-violet-600 hover:bg-violet-700' : 'btn-secondary'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ano
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              onClick={() => setChartType('area')}
              className={chartType === 'area' ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'btn-secondary'}
            >
              Área
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => setChartType('bar')}
              className={chartType === 'bar' ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'btn-secondary'}
            >
              Barras
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              onClick={() => setChartType('line')}
              className={chartType === 'line' ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'btn-secondary'}
            >
              Linhas
            </Button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">{getPeriodLabel()}</h3>
            <p className="text-white/50 text-sm">{getPeriodDescription()}</p>
          </div>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Download className="w-5 h-5 text-white/60" />
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Dados Detalhados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Período</th>
                <th className="text-right">Período Atual</th>
                <th className="text-right">Período Anterior</th>
                <th className="text-right">Variação</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const itemVariation = item.previous > 0 
                  ? ((item.current - item.previous) / item.previous) * 100 
                  : 0;
                return (
                  <tr key={index}>
                    <td className="font-medium text-white">{item.period}</td>
                    <td className="text-right text-violet-400 font-semibold">
                      {formatCurrency(item.current)}
                    </td>
                    <td className="text-right text-white/60">
                      {formatCurrency(item.previous)}
                    </td>
                    <td className={`text-right font-semibold ${
                      itemVariation >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {itemVariation >= 0 ? '+' : ''}{itemVariation.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-white/5 font-bold">
                <td className="text-white">Total</td>
                <td className="text-right text-violet-400">{formatCurrency(currentTotal)}</td>
                <td className="text-right text-white/70">{formatCurrency(previousTotal)}</td>
                <td className={`text-right ${variation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
