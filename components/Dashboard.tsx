
import React, { useState } from 'react';
import { User, Transaction, Employee } from '../types';
import RecentTransactions from './RecentTransactions';

interface DashboardProps {
  currentUser: User;
  employees: Employee[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  recentTransactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, employees, onAddTransaction, onDeleteTransaction, recentTransactions }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedShift, setSelectedShift] = useState('1');
  const [customDate, setCustomDate] = useState(''); // Boş ise "Bugün"
  const [customHours, setCustomHours] = useState('');
  const [isDeduction, setIsDeduction] = useState(false);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEntry = () => {
    if (!selectedEmployeeId) {
      alert('Lütfen önce bir personel seçin.');
      return;
    }

    const hours = parseFloat(customHours);
    if (isNaN(hours) || hours === 0) {
      alert('Lütfen geçerli bir saat miktarı giriniz veya hızlı seçeneklerden seçiniz.');
      return;
    }

    const employee = employees.find(e => e.id === selectedEmployeeId);
    if (!employee) return;

    const amount = isDeduction ? -Math.abs(hours) : Math.abs(hours);

    // Tarih belirleme mantığı
    let finalTimestamp = new Date();
    if (customDate) {
      const selected = new Date(customDate);
      const now = new Date();
      // Tarihi seçilen tarih yap, saati güncel saatten al (sıralama için)
      selected.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
      finalTimestamp = selected;
    }

    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      timestamp: finalTimestamp.toISOString(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      amount: amount,
      shift: selectedShift,
      performedById: currentUser.id,
      performedByName: currentUser.fullName,
      note: note
    };

    onAddTransaction(newTransaction);
    
    // Formu temizle
    setCustomHours('');
    setNote('');
    setCustomDate('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleQuickSelect = (h: number) => {
    setCustomHours(h.toString());
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Yeni İşlem Girişi
            </h2>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center animate-bounce">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                İşlem başarıyla kaydedildi!
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Personel Seçin</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 transition-all font-medium"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">-- Personel Seçiniz --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vardiya</label>
                    <select 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 transition-all font-bold"
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value)}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(s => (
                        <option key={s} value={s.toString()}>V {s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 text-xs">Tarih (Opsiyonel)</label>
                    <input 
                      type="date"
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-xs"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                <button 
                  onClick={() => setIsDeduction(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isDeduction ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Fazla Mesai (+)
                </button>
                <button 
                  onClick={() => setIsDeduction(true)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isDeduction ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Erken Ayrılma (-)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hızlı Saat Seçimi</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[2, 4, 6, 8].map(h => (
                    <button
                      key={h}
                      onClick={() => handleQuickSelect(h)}
                      className={`py-4 px-2 rounded-2xl border-2 font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                        customHours === h.toString() 
                          ? (isDeduction ? 'border-red-500 bg-red-100 text-red-700' : 'border-blue-500 bg-blue-100 text-blue-700')
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{h}sa</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Manuel Saat / İşlem Notu</label>
                  <div className="flex space-x-2">
                    <input 
                      type="number"
                      step="0.5"
                      placeholder="0.0"
                      className="w-24 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center"
                      value={customHours}
                      onChange={(e) => setCustomHours(e.target.value)}
                    />
                    <input 
                      type="text"
                      placeholder="İşlem ile ilgili kısa not..."
                      className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleEntry}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${isDeduction ? 'bg-red-600 hover:bg-red-700' : 'bg-[#001444] hover:bg-[#000a22]'}`}
                  >
                    Kaydı İşle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#001444] to-[#003366] rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 opacity-90 border-b border-white/10 pb-2">Oturum & Tarih</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70 uppercase tracking-widest">Giriş Yapan</span>
                <span className="font-bold text-sm">{currentUser.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70 uppercase tracking-widest">Sistem Tarihi</span>
                <span className="font-bold text-sm">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>

          <RecentTransactions transactions={recentTransactions} onDeleteTransaction={onDeleteTransaction} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
