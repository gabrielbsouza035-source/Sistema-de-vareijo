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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-violet-500/20">
              <Package className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total de Produtos</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500/20">
              <Boxes className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Valor em Estoque</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/20">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Lucro Potencial</p>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(potentialProfit)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-modern pl-12"
          />
        </div>
        <button onClick={handleAddNew} className="btn-primary w-full md:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
            <Package className="w-10 h-10 text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </h3>
          <p className="text-white/50 mb-6">
            {searchTerm 
              ? 'Tente buscar com outros termos' 
              : 'Comece cadastrando seu primeiro produto'}
          </p>
          {!searchTerm && (
            <button onClick={handleAddNew} className="btn-secondary">
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Produto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const margin = ((product.price - product.cost) / product.price * 100);
            const isLowStock = product.stock <= 5;
            
            return (
              <div key={product.id} className="glass-card-hover p-6 rounded-2xl group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    <Package className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este produto?')) {
                          onDelete(product.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white/70 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-white/50 text-sm mb-3 line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-3 h-3 text-white/40" />
                  <span className="text-xs text-white/60">{product.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40 mb-1">Preço</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40 mb-1">Custo</p>
                    <p className="text-lg font-semibold text-white/70">{formatCurrency(product.cost)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Estoque</p>
                    <p className={`font-semibold ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
                      {product.stock} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">Margem</p>
                    <p className={`font-semibold ${margin > 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {margin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {isLowStock && (
                  <div className="mt-4 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-xs text-red-400">Estoque baixo</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-white/70">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do produto"
                className="input-modern mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-white/70">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do produto"
                className="input-modern mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white/70">Preço de Venda *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="R$ 0,00"
                  className="input-modern mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cost" className="text-white/70">Custo *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="R$ 0,00"
                  className="input-modern mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock" className="text-white/70">Estoque *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="input-modern mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-white/70">Categoria *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Categoria"
                  className="input-modern mt-1"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 btn-primary">
                {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
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
