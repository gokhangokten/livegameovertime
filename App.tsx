
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import PersonnelManager from './components/PersonnelManager';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import { User, Transaction, Employee } from './types';
import { PREDEFINED_USERS, MOCK_EMPLOYEES } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'entry' | 'reports' | 'personnel' | 'admin_panel'>('entry');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>('https://www.merithotels.com/assets/images/merit-park-logo.png');

  // Verileri localStorage'dan yükle
  useEffect(() => {
    // Users initialization
    const savedUsers = localStorage.getItem('ot_users');
    let currentUsersList = PREDEFINED_USERS;
    if (savedUsers) {
      currentUsersList = JSON.parse(savedUsers);
      setUsers(currentUsersList);
    } else {
      setUsers(PREDEFINED_USERS);
      localStorage.setItem('ot_users', JSON.stringify(PREDEFINED_USERS));
    }

    const savedUser = localStorage.getItem('ot_user_id');
    if (savedUser) {
      const found = currentUsersList.find(u => u.id === savedUser);
      if (found) setCurrentUser(found);
    }

    const savedTransactions = localStorage.getItem('ot_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    const savedEmployees = localStorage.getItem('ot_employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      setEmployees(MOCK_EMPLOYEES);
      localStorage.setItem('ot_employees', JSON.stringify(MOCK_EMPLOYEES));
    }

    const savedLogo = localStorage.getItem('ot_company_logo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ot_user_id', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ot_user_id');
    setActiveTab('entry');
  };

  const addTransaction = (transaction: Transaction) => {
    const updated = [transaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem('ot_transactions', JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    if (confirm('Bu mesai kaydını silmek istediğinizden emin misiniz?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('ot_transactions', JSON.stringify(updated));
    }
  };

  const addEmployee = (employee: Employee) => {
    const updated = [...employees, employee];
    setEmployees(updated);
    localStorage.setItem('ot_employees', JSON.stringify(updated));
  };

  const deleteEmployee = (id: string) => {
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
    localStorage.setItem('ot_employees', JSON.stringify(updated));
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('ot_users', JSON.stringify(updatedUsers));
  };

  const handleUpdateLogo = (newLogo: string) => {
    setCompanyLogo(newLogo);
    localStorage.setItem('ot_company_logo', newLogo);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} companyLogo={companyLogo} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        companyLogo={companyLogo}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === 'entry' && (
          <Dashboard 
            currentUser={currentUser} 
            employees={employees}
            onAddTransaction={addTransaction} 
            onDeleteTransaction={deleteTransaction}
            recentTransactions={transactions.slice(0, 10)}
          />
        )}
        {activeTab === 'reports' && (
          <Reports 
            transactions={transactions} 
            employees={employees}
            companyLogo={companyLogo}
            onDeleteTransaction={deleteTransaction}
          />
        )}
        {activeTab === 'personnel' && (
          <PersonnelManager 
            employees={employees}
            onAddEmployee={addEmployee}
            onDeleteEmployee={deleteEmployee}
          />
        )}
        {activeTab === 'admin_panel' && currentUser.role === 'admin' && (
          <AdminPanel 
            users={users}
            onUpdateUsers={handleUpdateUsers}
          />
        )}
      </main>

      <footer className="no-print bg-white border-t py-4 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Personel Fazla Mesai Takip Sistemi. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default App;
