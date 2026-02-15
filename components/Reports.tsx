
import React, { useState, useMemo } from 'react';
import { Transaction, Employee, User } from '../types';
import { PREDEFINED_USERS } from '../constants';

interface ReportsProps {
  transactions: Transaction[];
  employees: Employee[];
  companyLogo: string;
  onDeleteTransaction: (id: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ transactions, employees, companyLogo, onDeleteTransaction }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.timestamp);
      const matchesFrom = dateFrom ? tDate >= new Date(dateFrom) : true;
      const matchesTo = dateTo ? tDate <= new Date(dateTo + 'T23:59:59') : true;
      const matchesEmp = filterEmployee ? t.employeeId === filterEmployee : true;
      const matchesUser = filterUser ? t.performedById === filterUser : true;
      return matchesFrom && matchesTo && matchesEmp && matchesUser;
    });
  }, [transactions, dateFrom, dateTo, filterEmployee, filterUser]);

  const totalsByEmployee = useMemo(() => {
    const map: Record<string, { name: string, total: number, count: number }> = {};
    filteredTransactions.forEach(t => {
      if (!map[t.employeeId]) map[t.employeeId] = { name: t.employeeName, total: 0, count: 0 };
      map[t.employeeId].total += t.amount;
      map[t.employeeId].count += 1;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredTransactions]);

  const handlePrint = () => {
    window.print();
  };

  const handleShowReport = () => {
    setIsReportGenerated(true);
  };

  const exportToExcel = () => {
    const headers = ['Tarih', 'Saat', 'Vardiya', 'Personel', 'İşlem Türü', 'Miktar (sa)', 'İşleyen', 'Not'];
    const rows = filteredTransactions.map(t => [
      new Date(t.timestamp).toLocaleDateString('tr-TR'),
      new Date(t.timestamp).toLocaleTimeString('tr-TR'),
      t.shift,
      t.employeeName,
      t.amount > 0 ? 'Fazla Mesai' : 'Erken Ayrılma',
      t.amount.toString().replace('.', ','),
      t.performedByName,
      t.note || '-'
    ]);

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += headers.join(";") + "\r\n";
    rows.forEach(row => {
      csvContent += row.join(";") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `Mesai_Raporu_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedEmployeeData = useMemo(() => {
    if (!selectedEmployeeId) return null;
    const employee = employees.find(e => e.id === selectedEmployeeId);
    const history = transactions
      .filter(t => t.employeeId === selectedEmployeeId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const totalBalance = history.reduce((sum, t) => sum + t.amount, 0);
    
    return { employee, history, totalBalance };
  }, [selectedEmployeeId, transactions, employees]);

  return (
    <div className="space-y-8 relative">
      <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Rapor Filtreleri
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Başlangıç Tarihi</label>
            <input 
              type="date" 
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setIsReportGenerated(false); }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bitiş Tarihi</label>
            <input 
              type="date" 
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setIsReportGenerated(false); }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Personele Göre</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={filterEmployee}
              onChange={(e) => { setFilterEmployee(e.target.value); setIsReportGenerated(false); }}
            >
              <option value="">Tüm Personel</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kullanıcıya Göre</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={filterUser}
              onChange={(e) => { setFilterUser(e.target.value); setIsReportGenerated(false); }}
            >
              <option value="">Tüm Kullanıcılar</option>
              {PREDEFINED_USERS.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-end border-t pt-6">
          <button 
            onClick={handleShowReport}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Raporu Göster</span>
          </button>
          
          {isReportGenerated && (
            <>
              <button 
                onClick={exportToExcel}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Excel'e Aktar</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Yazıcıda Yazdır</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!isReportGenerated ? (
        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">Lütfen filtreleri seçip "Raporu Göster" butonuna basınız.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print-card">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Toplam Kayıt</div>
              <div className="text-3xl font-black text-slate-900">{filteredTransactions.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print-card">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Mesai Saati</div>
              <div className={`text-3xl font-black ${filteredTransactions.reduce((acc, t) => acc + t.amount, 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {filteredTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(1)}sa
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print-card">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Etkilenen Personel</div>
              <div className="text-3xl font-black text-slate-900">{totalsByEmployee.length}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print-card animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-8 border-b text-center flex flex-col items-center">
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">Personel Fazla Mesai Özet Raporu</h1>
              <div className="text-sm text-slate-500 mt-2 italic">
                {dateFrom || 'Başlangıç'} / {dateTo || 'Bitiş'} Tarihleri Arası
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Personel</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Miktar</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">İşleyen</th>
                    <th className="no-print px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Kriterlere uygun kayıt bulunamadı.</td>
                    </tr>
                  ) : (
                    filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <div className="font-bold text-slate-900">{new Date(t.timestamp).toLocaleDateString('tr-TR')}</div>
                          <div className="text-slate-400">{new Date(t.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-black text-slate-600">V{t.shift}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => setSelectedEmployeeId(t.employeeId)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
                          >
                            {t.employeeName}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-black ${t.amount > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {t.amount > 0 ? '+' : ''}{t.amount.toFixed(1)}sa
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {t.performedByName}
                        </td>
                        <td className="no-print px-6 py-4 text-right">
                          <button 
                            onClick={() => onDeleteTransaction(t.id)}
                            className="text-slate-300 hover:text-red-500 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Kümülatif Toplam Bakiye (Net Sonuç)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {totalsByEmployee.map(([id, data]) => (
                  <button 
                    key={id} 
                    onClick={() => setSelectedEmployeeId(id)}
                    className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all text-left group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{data.name}</div>
                      <div className="text-[10px] text-slate-400">{data.count} İşlem Kaydı</div>
                    </div>
                    <div className={`text-sm font-black ${data.total >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {data.total.toFixed(1)}sa
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden print:flex justify-between mt-20 p-8 pt-12 border-t">
              <div className="text-center w-64">
                <div className="border-t border-slate-400 pt-2 text-xs font-bold uppercase tracking-widest">Sistem Yöneticisi</div>
              </div>
              <div className="text-center w-64">
                <div className="border-t border-slate-400 pt-2 text-xs font-bold uppercase tracking-widest">İnsan Kaynakları</div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedEmployeeId && selectedEmployeeData && (
        <div className="no-print fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#001444] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedEmployeeData.employee?.firstName} {selectedEmployeeData.employee?.lastName}</h3>
                <p className="text-xs text-blue-200 uppercase tracking-widest mt-1">Detaylı Mesai Kartı</p>
              </div>
              <button onClick={() => setSelectedEmployeeId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarih / Vardiya</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Miktar</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yazar</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedEmployeeData.history.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-xs font-medium">
                        <div className="text-slate-900">{new Date(t.timestamp).toLocaleDateString('tr-TR')}</div>
                        <div className="text-blue-500 font-black">Shift {t.shift}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black">
                        <span className={t.amount > 0 ? 'text-blue-600' : 'text-red-600'}>{t.amount > 0 ? '+' : ''}{t.amount.toFixed(1)}sa</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">{t.performedByName}</td>
                      <td className="px-6 py-4 text-[10px] text-slate-400 italic max-w-[120px] truncate">{t.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-[#f8fafc] p-8 border-t flex justify-between items-center">
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Net Toplam Mesai Bakiyesi:</div>
              <div className={`text-3xl font-black ${selectedEmployeeData.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {selectedEmployeeData.totalBalance.toFixed(1)}sa
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
