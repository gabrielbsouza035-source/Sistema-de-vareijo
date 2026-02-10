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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-violet-500/20">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total de Vendas</p>
              <p className="text-2xl font-bold text-white">{totalSales}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500/20">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Lucro Total</p>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalProfit)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-amber-500/20">
              <Package className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(averageTicket)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales List */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-400" />
                Histórico de Vendas
              </h3>
              <button onClick={() => setIsDialogOpen(true)} className="btn-primary text-sm">
                <Plus className="w-4 h-4 mr-2" />
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
                <button onClick={() => setIsDialogOpen(true)} className="btn-secondary">
                  <Plus className="w-5 h-5 mr-2" />
                  Registrar Venda
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Total</th>
                      <th>Lucro</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sales]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((sale) => (
                      <tr key={sale.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-white/30" />
                            <span className="text-sm">{formatDate(sale.date)}</span>
                          </div>
                        </td>
                        <td className="font-medium text-white">{sale.productName}</td>
                        <td>{sale.quantity}</td>
                        <td className="font-semibold text-blue-400">{formatCurrency(sale.total)}</td>
                        <td className="font-semibold text-emerald-400">{formatCurrency(sale.profit)}</td>
                        <td className="text-right">
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja cancelar esta venda?')) {
                                onDelete(sale.id);
                              }
                            }}
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
          {/* Quick Sale */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-400" />
              Venda Rápida
            </h3>
            <button onClick={() => setIsDialogOpen(true)} className="w-full btn-primary mb-4">
              <Plus className="w-5 h-5 mr-2" />
              Nova Venda
            </button>
            <p className="text-white/50 text-sm text-center">
              Clique acima para registrar uma nova venda
            </p>
          </div>

          {/* Recent Sales */}
          {recentSales.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Vendas Recentes</h3>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{sale.productName}</p>
                      <p className="text-white/40 text-xs">{formatDate(sale.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400 text-sm">{formatCurrency(sale.total)}</p>
                      <p className="text-white/40 text-xs">{sale.quantity}x</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance */}
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
                    style={{ width: `${Math.min((totalProfit / totalRevenue) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-emerald-400">
                  {totalProfit > 0 ? '✓ Lucratividade positiva' : '⚠ Atenção à lucratividade'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Registrar Nova Venda</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="product" className="text-white/70">Produto *</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="input-modern mt-1">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {products.filter(p => p.stock > 0).map((product) => (
                    <SelectItem 
                      key={product.id} 
                      value={product.id}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {product.name} - {formatCurrency(product.price)} (Estoque: {product.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity" className="text-white/70">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={products.find(p => p.id === selectedProduct)?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-modern mt-1"
              />
            </div>
            {selectedProduct && (
              <div className="p-4 rounded-xl bg-white/5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Preço unitário:</span>
                  <span className="text-white font-medium">
                    {formatCurrency(products.find(p => p.id === selectedProduct)?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Quantidade:</span>
                  <span className="text-white font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency(
                      (products.find(p => p.id === selectedProduct)?.price || 0) * parseInt(quantity || '0')
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Lucro estimado:</span>
                  <span className="text-violet-400 font-medium">
                    {formatCurrency(
                      ((products.find(p => p.id === selectedProduct)?.price || 0) - 
                       (products.find(p => p.id === selectedProduct)?.cost || 0)) * 
                      parseInt(quantity || '0')
                    )}
                  </span>
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 btn-primary"
                disabled={!selectedProduct || (products.find(p => p.id === selectedProduct)?.stock || 0) < parseInt(quantity)}
              >
                Registrar Venda
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedProduct('');
                  setQuantity('1');
                  setIsDialogOpen(false);
                }}
                className="btn-secondary"
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
