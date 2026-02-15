
import React from 'react';
import { Transaction } from '../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onDeleteTransaction }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
        <span>Son İşlemler</span>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-tighter">Canlı Akış</span>
      </h3>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            Henüz işlem bulunmuyor
          </div>
        ) : (
          transactions.map(t => (
            <div key={t.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${t.amount > 0 ? 'bg-blue-400' : 'bg-red-400'}`} />
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-slate-800 leading-none truncate">{t.employeeName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 uppercase truncate">
                    {new Date(t.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • Shift {t.shift}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 ml-2">
                <div className={`text-sm font-black whitespace-nowrap ${t.amount > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {t.amount > 0 ? '+' : ''}{t.amount}sa
                </div>
                <button 
                  onClick={() => onDeleteTransaction(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                  title="Kaydı Sil"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
