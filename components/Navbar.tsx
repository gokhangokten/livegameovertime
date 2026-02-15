
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  activeTab: 'entry' | 'reports' | 'personnel' | 'admin_panel';
  onTabChange: (tab: 'entry' | 'reports' | 'personnel' | 'admin_panel') => void;
  companyLogo: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, activeTab, onTabChange, companyLogo }) => {
  return (
    <nav className="no-print bg-white border-b sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => onTabChange('entry')}>
              <img 
                src={companyLogo} 
                alt="Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://cdn.worldvectorlogo.com/logos/merit-hotels.svg";
                }}
              />
              <div className="hidden lg:flex flex-col border-l border-slate-200 pl-3">
                <span className="font-black text-lg leading-none text-[#001444] tracking-tighter">MESAI</span>
                <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest leading-none">TAKİP SİSTEMİ</span>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <button 
                onClick={() => onTabChange('entry')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === 'entry' ? 'bg-[#001444] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Kayıt
              </button>
              <button 
                onClick={() => onTabChange('reports')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === 'reports' ? 'bg-[#001444] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Raporlar
              </button>
              <button 
                onClick={() => onTabChange('personnel')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === 'personnel' ? 'bg-[#001444] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Personel
              </button>
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => onTabChange('admin_panel')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                    activeTab === 'admin_panel' ? 'bg-[#c5a059] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Yönetim
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block border-r border-slate-100 pr-4">
              <div className="text-sm font-bold text-slate-900">{currentUser.fullName}</div>
              <div className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest">
                {currentUser.role === 'admin' ? 'Sistem Yöneticisi' : 'Pitboss'}
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="group bg-slate-50 p-2.5 rounded-full hover:bg-red-50 transition-all border border-slate-100"
              title="Güvenli Çıkış"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
