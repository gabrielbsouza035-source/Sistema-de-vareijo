import { Package, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { DashboardStats } from '@/types';

interface DashboardProps {
  stats: DashboardStats;
  lowStockCount: number;
  overdueDebtsCount: number;
}

export function Dashboard({ stats, lowStockCount, overdueDebtsCount }: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts.toString(),
      subtitle: `${stats.totalStock} unidades em estoque`,
      icon: Package,
      type: 'neutral' as const,
      trend: null,
    },
    {
      title: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      subtitle: `${stats.totalSales} vendas realizadas`,
      icon: TrendingUp,
      type: 'positive' as const,
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: 'Lucro Total',
      value: formatCurrency(stats.totalProfit),
      subtitle: `Margem: ${stats.totalRevenue > 0 ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1) : 0}%`,
      icon: DollarSign,
      type: 'positive' as const,
      trend: { value: 8.3, isPositive: true },
    },
    {
      title: 'Saldo de Dívidas',
      value: formatCurrency(stats.debtsToReceive - stats.debtsToPay),
      subtitle: `A receber: ${formatCurrency(stats.debtsToReceive)}`,
      icon: TrendingDown,
      type: stats.debtsToReceive - stats.debtsToPay >= 0 ? 'positive' : 'negative' as const,
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome - Ajustado padding para mobile */}
      <div className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Bem-vindo ao <span className="gradient-text">Varejo Pro</span>
          </h2>
          <p className="text-white/60 max-w-xl text-sm md:text-base">
            Gerencie seus produtos, acompanhe suas vendas e controle suas finanças 
            em um só lugar. Seu negócio mais organizado do que nunca.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className={`glass-card-hover p-6 rounded-2xl ${
                card.type === 'positive' ? 'glow-green' : 
                card.type === 'negative' ? 'glow-red' : 'glow-purple'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  card.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
                  card.type === 'negative' ? 'bg-red-500/20 text-red-400' :
                  'bg-violet-500/20 text-violet-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                {card.trend && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    card.trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {card.trend.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {card.trend.value}%
                  </div>
                )}
              </div>
              <h3 className="text-white/60 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-xl md:text-2xl font-bold text-white mb-2 break-all">{card.value}</p>
              <p className="text-white/40 text-xs">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 space-y-4">
          {(lowStockCount > 0 || overdueDebtsCount > 0) && (
            <>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Atenção Necessária
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowStockCount > 0 && (
                  <div className="glass-card p-5 rounded-xl border-l-4 border-amber-400">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/20 shrink-0">
                        <Package className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Estoque Baixo</h4>
                        <p className="text-white/60 text-sm mb-3">
                          {lowStockCount} produto(s) críticos
                        </p>
                        <button className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                          Ver produtos →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {overdueDebtsCount > 0 && (
                  <div className="glass-card p-5 rounded-xl border-l-4 border-red-400">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-red-500/20 shrink-0">
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Dívidas Vencidas</h4>
                        <p className="text-white/60 text-sm mb-3">
                          {overdueDebtsCount} pendência(s)
                        </p>
                        <button className="text-red-400 text-sm font-medium hover:text-red-300 transition-colors">
                          Ver dívidas →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Resumo Financeiro - CORRIGIDO PARA RESPONSIVIDADE */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo Financeiro</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-400 mb-1 uppercase tracking-wider font-medium">A Receber</p>
                <p className="text-lg font-bold text-white break-all">{formatCurrency(stats.debtsToReceive)}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 mb-1 uppercase tracking-wider font-medium">A Pagar</p>
                <p className="text-lg font-bold text-white break-all">{formatCurrency(stats.debtsToPay)}</p>
              </div>
              <div className={`text-center p-4 rounded-xl border ${
                stats.debtsToReceive - stats.debtsToPay >= 0 
                  ? 'bg-emerald-500/10 border-emerald-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <p className={`text-xs mb-1 uppercase tracking-wider font-medium ${
                  stats.debtsToReceive - stats.debtsToPay >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>Saldo</p>
                <p className="text-lg font-bold text-white break-all">
                  {formatCurrency(stats.debtsToReceive - stats.debtsToPay)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              Resumo do Dia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-white/60 text-sm">Vendas Hoje</span>
                <span className="font-semibold text-white">0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-white/60 text-sm">Receita Hoje</span>
                <span className="font-semibold text-emerald-400">{formatCurrency(0)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-white/60 text-sm">Lucro Hoje</span>
                <span className="font-semibold text-violet-400">{formatCurrency(0)}</span>
              </div>
            </div>
          </div>

          <div className="gradient-border">
            <div className="gradient-border-inner p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Dica do Sistema</h3>
              <p className="text-white/60 text-sm">
                Mantenha seu estoque sempre atualizado para evitar perdas de vendas. 
                Produtos com estoque baixo aparecem em alertas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}