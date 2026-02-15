
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'pitboss';
  password?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  employeeId: string;
  employeeName: string;
  amount: number; // Pozitif fazla mesai, negatif kesinti (erken ayrılma)
  shift: string; // 1-10 arası vardiya bilgisi
  performedById: string;
  performedByName: string;
  note?: string;
}

export interface OvertimeReport {
  employeeId: string;
  employeeName: string;
  totalHours: number;
  transactions: Transaction[];
}
