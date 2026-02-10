import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Dashboard } from '@/sections/Dashboard';
import { Products } from '@/sections/Products';
import { Sales } from '@/sections/Sales';
import { Debts } from '@/sections/Debts';
import { Charts } from '@/sections/Charts';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Store,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const {
    products,
    sales,
    debts,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    deleteSale,
    addDebt,
    deleteDebt,
    markDebtAsPaid,
    getDashboardStats,
    getRevenueData,
    getLowStockProducts,
    getOverdueDebts,
  } = useStore();

  const stats = getDashboardStats();
  const lowStockProducts = getLowStockProducts();
  const overdueDebts = getOverdueDebts();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'sales', label: 'Vendas', icon: TrendingUp },
    { id: 'debts', label: 'Dívidas', icon: TrendingDown },
    { id: 'charts', label: 'Gráficos', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            lowStockCount={lowStockProducts.length}
            overdueDebtsCount={overdueDebts.length}
          />
        );
      case 'products':
        return (
          <Products
            products={products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        );
      case 'sales':
        return (
          <Sales
            sales={sales}
            products={products}
            onAdd={addSale}
            onDelete={deleteSale}
          />
        );
      case 'debts':
        return (
          <Debts
            debts={debts}
            onAdd={addDebt}
            onDelete={deleteDebt}
            onMarkAsPaid={markDebtAsPaid}
          />
        );
      case 'charts':
        return <Charts getRevenueData={getRevenueData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-72'
        }`}
      >
        <div className="h-full glass-card border-r border-white/10 m-0 rounded-none lg:rounded-r-3xl lg:m-4 lg:h-[calc(100vh-2rem)]">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center glow-purple">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className={`transition-opacity duration-300 ${!sidebarOpen && 'lg:opacity-0 xl:opacity-100'}`}>
                <h1 className="text-xl font-bold text-white">Varejo Pro</h1>
                <p className="text-xs text-white/50">Gestão Inteligente</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full nav-item ${activeTab === item.id ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`transition-opacity duration-300 ${!sidebarOpen && 'lg:hidden xl:inline'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Stats Mini */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 transition-opacity duration-300 ${!sidebarOpen && 'lg:hidden xl:block'}`}>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50">Receita Total</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-white">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 px-6 py-4">
          <div className="glass-card px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-white/50">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white/70">Sistema Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="animate-slide-up">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
