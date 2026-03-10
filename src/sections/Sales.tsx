import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, TrendingUp, Calendar, Package, DollarSign, TrendingDown } from 'lucide-react';
import type { Product, Sale } from '@/types';

interface SalesProps {
  sales: Sale[];
  products: Product[];
  onAdd: (sale: Omit<Sale, 'id' | 'date' | 'profit'>) => void;
  onDelete: (id: string) => void;
}

export function Sales({ sales, products, onAdd, onDelete }: SalesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    onAdd({
      productId: product.id,
      productName: product.name,
      quantity: parseInt(quantity),
      unitPrice: product.price,
      total: product.price * parseInt(quantity),
    });

    setSelectedProduct('');
    setQuantity('1');
    setIsDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const totalSales = sales.length;
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards - Ajustado para 2 colunas em telas pequenas e 4 em grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Vendas', value: totalSales, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/20' },
          { label: 'Receita Total', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Lucro Total', value: formatCurrency(totalProfit), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Ticket Médio', value: formatCurrency(averageTicket), icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/20' },
        ].map((card, i) => (
          <div key={i} className="glass-card p-4 md:p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-3 md:p-4 rounded-xl ${card.bg} shrink-0`}>
              <card.icon className={`w-5 h-5 md:w-6 md:h-6 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-xs md:text-sm truncate">{card.label}</p>
              <p className="text-lg md:text-2xl font-bold text-white truncate">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales List */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-400" />
                Histórico de Vendas
              </h3>
              <button 
                onClick={() => setIsDialogOpen(true)} 
                className="btn-primary w-full sm:w-auto text-sm flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2 shrink-0" />
                Nova Venda
              </button>
            </div>

            {sales.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white/30" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma venda registrada</h3>
                <p className="text-white/50 mb-6">Comece registrando sua primeira venda</p>
                <button onClick={() => setIsDialogOpen(true)} className="btn-secondary mx-auto flex items-center px-6 py-2">
                  <Plus className="w-5 h-5 mr-2" />
                  Registrar Venda
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left px-6 py-4">Data</th>
                      <th className="text-left px-6 py-4">Produto</th>
                      <th className="text-center px-6 py-4">Qtd</th>
                      <th className="text-left px-6 py-4">Total</th>
                      <th className="text-left px-6 py-4">Lucro</th>
                      <th className="text-right px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sales]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((sale) => (
                      <tr key={sale.id} className="border-t border-white/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-white/30 shrink-0" />
                            <span className="text-sm whitespace-nowrap">{formatDate(sale.date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white max-w-[150px] truncate">
                          {sale.productName}
                        </td>
                        <td className="px-6 py-4 text-center">{sale.quantity}</td>
                        <td className="px-6 py-4 font-semibold text-blue-400 whitespace-nowrap">
                          {formatCurrency(sale.total)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-emerald-400 whitespace-nowrap">
                          {formatCurrency(sale.profit)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => confirm('Cancelar venda?') && onDelete(sale.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white/50 hover:text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-400" />
              Venda Rápida
            </h3>
            <button 
              onClick={() => setIsDialogOpen(true)} 
              className="w-full btn-primary mb-4 flex items-center justify-center py-3 rounded-xl whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2 shrink-0" />
              Nova Venda
            </button>
            <p className="text-white/50 text-sm text-center italic">
              Selecione produtos em estoque
            </p>
          </div>

          {/* Performance Card */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-violet-400" />
              Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Margem Média</span>
                  <span className="text-white font-medium">
                    {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                    style={{ width: `${Math.min(totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0, 100)}%` }}
                  />
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${totalProfit > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <p className="text-xs sm:text-sm flex items-center gap-2">
                  {totalProfit > 0 ? '✓ Lucratividade positiva' : '⚠ Atenção à lucratividade'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Responsivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 w-[95vw] max-w-md mx-auto rounded-3xl overflow-hidden p-6">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">Registrar Venda</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label className="text-white/70">Produto *</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="input-modern w-full h-12">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 bg-slate-900">
                  {products.filter(p => p.stock > 0).map((product) => (
                    <SelectItem key={product.id} value={product.id} className="text-white focus:bg-white/10">
                      {product.name} ({product.stock} em estoque)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Quantidade *</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-modern h-12"
              />
            </div>

            {selectedProduct && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 animate-in fade-in duration-300">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Venda:</span>
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency((products.find(p => p.id === selectedProduct)?.price || 0) * parseInt(quantity || '0'))}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                className="btn-primary w-full h-12 order-none sm:order-2 flex items-center justify-center whitespace-nowrap"
                disabled={!selectedProduct}
              >
                Registrar Venda
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="btn-secondary w-full h-12 order-2 sm:order-none flex items-center justify-center"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}