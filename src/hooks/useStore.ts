import { useState, useEffect, useCallback } from 'react';
import type { Product, Sale, Debt, RevenueData, DashboardStats } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useStore() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
      return value;
    }) : [];
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('debts');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'dueDate' || key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  // Product operations
  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduct = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  // Sale operations
  const addSale = useCallback((sale: Omit<Sale, 'id' | 'date' | 'profit'>) => {
    const product = products.find(p => p.id === sale.productId);
    if (!product) return null;

    const profit = (sale.unitPrice - product.cost) * sale.quantity;
    const newSale: Sale = {
      ...sale,
      id: generateId(),
      date: new Date(),
      profit,
    };

    setSales(prev => [...prev, newSale]);
    
    // Update stock
    setProducts(prev => prev.map(p => 
      p.id === sale.productId 
        ? { ...p, stock: p.stock - sale.quantity, updatedAt: new Date() }
        : p
    ));

    return newSale;
  }, [products]);

  const deleteSale = useCallback((id: string) => {
    const sale = sales.find(s => s.id === id);
    if (sale) {
      setProducts(prev => prev.map(p => 
        p.id === sale.productId 
          ? { ...p, stock: p.stock + sale.quantity, updatedAt: new Date() }
          : p
      ));
    }
    setSales(prev => prev.filter(s => s.id !== id));
  }, [sales]);

  // Debt operations
  const addDebt = useCallback((debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: generateId(),
      createdAt: new Date(),
    };
    setDebts(prev => [...prev, newDebt]);
    return newDebt;
  }, []);

  const updateDebt = useCallback((id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(d => 
      d.id === id ? { ...d, ...updates } : d
    ));
  }, []);

  const deleteDebt = useCallback((id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  }, []);

  const markDebtAsPaid = useCallback((id: string) => {
    setDebts(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'paid' } : d
    ));
  }, []);

  // Statistics
  const getDashboardStats = useCallback((): DashboardStats => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    const pendingDebts = debts.filter(d => d.status === 'pending').length;
    const debtsToReceive = debts
      .filter(d => d.type === 'to_receive' && d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);
    const debtsToPay = debts
      .filter(d => d.type === 'to_pay' && d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);

    return {
      totalProducts,
      totalStock,
      totalSales,
      totalRevenue,
      totalProfit,
      pendingDebts,
      debtsToReceive,
      debtsToPay,
    };
  }, [products, sales, debts]);

  // Revenue data for charts
  const getRevenueData = useCallback((period: 'week' | 'month' | 'year'): RevenueData[] => {
    const now = new Date();
    const data: RevenueData[] = [];

    if (period === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        
        const currentDaySales = sales.filter(s => {
          const saleDate = new Date(s.date);
          return saleDate.toDateString() === date.toDateString();
        });

        const previousWeekDate = new Date(date);
        previousWeekDate.setDate(previousWeekDate.getDate() - 7);
        const previousDaySales = sales.filter(s => {
          const saleDate = new Date(s.date);
          return saleDate.toDateString() === previousWeekDate.toDateString();
        });

        data.push({
          period: dayName,
          current: currentDaySales.reduce((sum, s) => sum + s.total, 0),
          previous: previousDaySales.reduce((sum, s) => sum + s.total, 0),
        });
      }
    } else if (period === 'month') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));

        const currentWeekSales = sales.filter(s => {
          const saleDate = new Date(s.date);
          return saleDate >= weekStart && saleDate <= weekEnd;
        });

        const previousWeekStart = new Date(weekStart);
        previousWeekStart.setDate(previousWeekStart.getDate() - 28);
        const previousWeekEnd = new Date(weekEnd);
        previousWeekEnd.setDate(previousWeekEnd.getDate() - 28);

        const previousWeekSales = sales.filter(s => {
          const saleDate = new Date(s.date);
          return saleDate >= previousWeekStart && saleDate <= previousWeekEnd;
        });

        data.push({
          period: `Semana ${4 - i}`,
          current: currentWeekSales.reduce((sum, s) => sum + s.total, 0),
          previous: previousWeekSales.reduce((sum, s) => sum + s.total, 0),
        });
      }
    } else if (period === 'year') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now);
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });

        const currentMonthSales = sales.filter(s => {
          const saleDate = new Date(s.date);
          return saleDate.getMonth() === monthDate.getMonth() && 
                 saleDate.getFullYear() === monthDate.getFullYear();
        });

        const previousYearDate = new Date(monthDate);
        previousYearDate.setFullYear(previousYearDate.getFullYear() - 1);

        const previousMonthSales = sales.filter(s => {
          const saleDate = new Date(s.date);
          return saleDate.getMonth() === previousYearDate.getMonth() && 
                 saleDate.getFullYear() === previousYearDate.getFullYear();
        });

        data.push({
          period: monthName,
          current: currentMonthSales.reduce((sum, s) => sum + s.total, 0),
          previous: previousMonthSales.reduce((sum, s) => sum + s.total, 0),
        });
      }
    }

    return data;
  }, [sales]);

  // Low stock alerts
  const getLowStockProducts = useCallback((threshold: number = 5) => {
    return products.filter(p => p.stock <= threshold);
  }, [products]);

  // Overdue debts
  const getOverdueDebts = useCallback(() => {
    const now = new Date();
    return debts.filter(d => 
      d.status === 'pending' && new Date(d.dueDate) < now
    );
  }, [debts]);

  return {
    products,
    sales,
    debts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    addSale,
    deleteSale,
    addDebt,
    updateDebt,
    deleteDebt,
    markDebtAsPaid,
    getDashboardStats,
    getRevenueData,
    getLowStockProducts,
    getOverdueDebts,
  };
}
