
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  companyLogo: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, users, companyLogo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError('Kullanıcı adı veya şifre hatalı');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-200">
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-40 object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://cdn.worldvectorlogo.com/logos/merit-hotels.svg";
              }}
            />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personel Mesai Takip</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">Giriş Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-center animate-pulse">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Kullanıcı Adı</label>
            <input
              type="text"
              required
              autoFocus
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#c5a059] focus:border-[#c5a059] transition-all outline-none bg-slate-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Şifre</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#c5a059] focus:border-[#c5a059] transition-all outline-none bg-slate-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#001444] hover:bg-[#000a22] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-[#001444]/20 active:scale-[0.98] mt-4"
          >
            Sisteme Giriş Yap
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
            SİSTEM GÜVENLİK YAZILIMI
          </p>
          <p className="text-[9px] text-slate-300 mt-1 uppercase">Merit Park Hotel & Casino</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
