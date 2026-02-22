import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Package, Tag, DollarSign, Boxes } from 'lucide-react';
import type { Product } from '@/types';

interface ProductsProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

export function Products({ products, onAdd, onUpdate, onDelete }: ProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    category: '',
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      category: formData.category,
    };

    if (editingProduct) {
      onUpdate(editingProduct.id, productData);
    } else {
      onAdd(productData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      cost: '',
      stock: '',
      category: '',
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      category: product.category,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);
  const potentialProfit = totalValue - totalCost;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4 md:p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 rounded-xl bg-violet-500/20 shrink-0">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-xs md:text-sm truncate">Total de Produtos</p>
              <p className="text-xl md:text-2xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 rounded-xl bg-blue-500/20 shrink-0">
              <Boxes className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-xs md:text-sm truncate">Valor em Estoque</p>
              <p className="text-xl md:text-2xl font-bold text-white truncate">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-2xl sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 rounded-xl bg-emerald-500/20 shrink-0">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-xs md:text-sm truncate">Lucro Potencial</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-400 truncate">{formatCurrency(potentialProfit)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar - Corrigido alinhamento e quebra do botão */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-modern pl-12 w-full"
          />
        </div>
        <button 
          onClick={handleAddNew} 
          className="btn-primary w-full sm:w-auto px-6 h-11 flex items-center justify-center whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2 shrink-0" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card p-8 md:p-12 rounded-2xl text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <Package className="w-8 h-8 md:w-10 md:h-10 text-white/30" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </h3>
          <p className="text-white/50 text-sm mb-6">
            {searchTerm ? 'Tente buscar com outros termos' : 'Comece cadastrando seu primeiro produto'}
          </p>
          {!searchTerm && (
            <button onClick={handleAddNew} className="btn-secondary w-full sm:w-auto flex items-center justify-center mx-auto whitespace-nowrap">
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Produto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const margin = product.price > 0 ? ((product.price - product.cost) / product.price * 100) : 0;
            const isLowStock = product.stock <= 5;
            
            return (
              <div key={product.id} className="glass-card-hover p-5 md:p-6 rounded-2xl group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    <Package className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <Edit className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este produto?')) {
                          onDelete(product.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors border border-white/10"
                    >
                      <Trash2 className="w-4 h-4 text-white/70 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1 truncate">{product.name}</h3>
                {product.description && (
                  <p className="text-white/50 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-3 h-3 text-white/40" />
                  <span className="text-xs text-white/60 truncate">{product.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Preço</p>
                    <p className="text-base md:text-lg font-semibold text-white truncate">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Custo</p>
                    <p className="text-base md:text-lg font-semibold text-white/70 truncate">{formatCurrency(product.cost)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Estoque</p>
                    <p className={`font-semibold text-sm ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
                      {product.stock} un.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Margem</p>
                    <p className={`font-semibold text-sm ${margin > 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {margin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {isLowStock && (
                  <div className="mt-4 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-xs text-red-400 font-medium">Estoque crítico</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog - Corrigido alinhamento dos botões inferiores */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70 text-sm">Nome do Produto *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Camiseta Cotton" className="input-modern" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70 text-sm">Descrição</Label>
              <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Opcional" className="input-modern" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white/70 text-sm">Preço de Venda *</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0,00" className="input-modern" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost" className="text-white/70 text-sm">Custo *</Label>
                <Input id="cost" type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} placeholder="0,00" className="input-modern" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-white/70 text-sm">Qtd. em Estoque *</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="0" className="input-modern" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white/70 text-sm">Categoria *</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ex: Vestuário" className="input-modern" required />
              </div>
            </div>

            {/* Footer Buttons - Corrigido whitespace e alinhamento */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                className="btn-primary w-full order-none sm:order-2 flex items-center justify-center whitespace-nowrap h-11"
              >
                {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { resetForm(); setIsDialogOpen(false); }}
                className="btn-secondary w-full flex items-center justify-center whitespace-nowrap h-11"
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