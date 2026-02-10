import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, CheckCircle, TrendingDown, TrendingUp, Calendar, User, AlertCircle, Wallet } from 'lucide-react';
import type { Debt } from '@/types';

interface DebtsProps {
  debts: Debt[];
  onAdd: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
}

export function Debts({ debts, onAdd, onDelete, onMarkAsPaid }: DebtsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    personName: '',
    description: '',
    amount: '',
    type: 'to_receive' as 'to_receive' | 'to_pay',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      personName: formData.personName,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type,
      dueDate: new Date(formData.dueDate),
      status: 'pending',
    });

    setFormData({
      personName: '',
      description: '',
      amount: '',
      type: 'to_receive',
      dueDate: '',
    });
    setIsDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const debtsToReceive = debts.filter(d => d.type === 'to_receive' && d.status === 'pending');
  const debtsToPay = debts.filter(d => d.type === 'to_pay' && d.status === 'pending');
  const totalToReceive = debtsToReceive.reduce((sum, d) => sum + d.amount, 0);
  const totalToPay = debtsToPay.reduce((sum, d) => sum + d.amount, 0);
  const overdueDebts = debts.filter(d => d.status === 'pending' && isOverdue(d.dueDate));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">A Receber</p>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalToReceive)}</p>
              <p className="text-xs text-white/40">{debtsToReceive.length} pendente(s)</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">A Pagar</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalToPay)}</p>
              <p className="text-xs text-white/40">{debtsToPay.length} pendente(s)</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${totalToReceive - totalToPay >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <Wallet className={`w-6 h-6 ${totalToReceive - totalToPay >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <div>
              <p className="text-white/60 text-sm">Saldo</p>
              <p className={`text-2xl font-bold ${totalToReceive - totalToPay >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(totalToReceive - totalToPay)}
              </p>
              <p className="text-xs text-white/40">Posição financeira</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {overdueDebts.length > 0 && (
        <div className="glass-card p-4 rounded-2xl border-l-4 border-red-400 bg-red-500/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-white font-medium">Dívidas Vencidas</p>
              <p className="text-white/60 text-sm">
                Você tem {overdueDebts.length} dívida(s) vencida(s) que precisa de atenção
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-violet-400" />
            Controle de Dívidas
          </h3>
          <button onClick={() => setIsDialogOpen(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Dívida
          </button>
        </div>

        {debts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma dívida registrada</h3>
            <p className="text-white/50 mb-6">Comece registrando sua primeira dívida</p>
            <button onClick={() => setIsDialogOpen(true)} className="btn-secondary">
              <Plus className="w-5 h-5 mr-2" />
              Registrar Dívida
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Pessoa</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...debts]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((debt) => (
                  <tr key={debt.id} className={debt.status === 'paid' ? 'opacity-50' : ''}>
                    <td>
                      <span className={`badge ${
                        debt.type === 'to_receive' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {debt.type === 'to_receive' ? 'A Receber' : 'A Pagar'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/30" />
                        <span className="font-medium text-white">{debt.personName}</span>
                      </div>
                    </td>
                    <td className="text-white/60">{debt.description || '-'}</td>
                    <td className={`font-semibold ${
                      debt.type === 'to_receive' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(debt.amount)}
                    </td>
                    <td>
                      <div className={`flex items-center gap-2 ${
                        isOverdue(debt.dueDate) && debt.status === 'pending' ? 'text-red-400' : 'text-white/60'
                      }`}>
                        <Calendar className="w-4 h-4" />
                        {formatDate(debt.dueDate)}
                        {isOverdue(debt.dueDate) && debt.status === 'pending' && (
                          <span className="text-xs text-red-400">(Vencido)</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        debt.status === 'paid' ? 'badge-info' :
                        isOverdue(debt.dueDate) ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {debt.status === 'paid' ? 'Pago' : isOverdue(debt.dueDate) ? 'Vencido' : 'Pendente'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {debt.status === 'pending' && (
                          <button
                            onClick={() => onMarkAsPaid(debt.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 transition-colors"
                            title="Marcar como pago"
                          >
                            <CheckCircle className="w-4 h-4 text-white/50 hover:text-emerald-400" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir esta dívida?')) {
                              onDelete(debt.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white/50 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Registrar Nova Dívida</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="type" className="text-white/70">Tipo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'to_receive' | 'to_pay') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="input-modern mt-1">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="to_receive" className="text-white hover:bg-white/10 focus:bg-white/10">
                    A Receber
                  </SelectItem>
                  <SelectItem value="to_pay" className="text-white hover:bg-white/10 focus:bg-white/10">
                    A Pagar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="personName" className="text-white/70">Nome da Pessoa *</Label>
              <Input
                id="personName"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                placeholder="Nome da pessoa"
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
                placeholder="Descrição da dívida"
                className="input-modern mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white/70">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="R$ 0,00"
                className="input-modern mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate" className="text-white/70">Data de Vencimento *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-modern mt-1"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 btn-primary">
                Registrar Dívida
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    personName: '',
                    description: '',
                    amount: '',
                    type: 'to_receive',
                    dueDate: '',
                  });
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
