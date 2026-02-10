export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  profit: number;
  date: Date;
}

export interface Debt {
  id: string;
  personName: string;
  description: string;
  amount: number;
  type: 'to_receive' | 'to_pay';
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
}

export interface RevenueData {
  period: string;
  current: number;
  previous: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  pendingDebts: number;
  debtsToReceive: number;
  debtsToPay: number;
}
