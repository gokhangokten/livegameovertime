
import React, { useState } from 'react';
import { User } from '../types';

interface AdminPanelProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onUpdateUsers }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'pitboss'>('pitboss');
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !fullName || !password) return;

    if (users.find(u => u.username === username)) {
      alert('Bu kullanıcı adı zaten alınmış.');
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      username,
      fullName,
      role,
      password
    };

    onUpdateUsers([...users, newUser]);
    setUsername('');
    setFullName('');
    setPassword('');
    setRole('pitboss');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const handleResetPassword = (id: string) => {
    if (!newPassword) {
      alert('Lütfen yeni bir şifre giriniz.');
      return;
    }
    const updated = users.map(u => u.id === id ? { ...u, password: newPassword } : u);
    onUpdateUsers(updated);
    setNewPassword('');
    setEditingUserId(null);
    alert('Şifre başarıyla güncellendi.');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Yeni Kullanıcı Ekleme */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Yeni Kullanıcı Hesabı Oluştur
        </h2>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Kullanıcı başarıyla oluşturuldu!
          </div>
        )}

        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kullanıcı Adı</label>
            <input 
              type="text"
              required
              placeholder="Kullanıcı Adı"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ad Soyad</label>
            <input 
              type="text"
              required
              placeholder="Ad Soyad"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Şifre</label>
            <input 
              type="password"
              required
              placeholder="••••••"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Yetki</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'pitboss')}
            >
              <option value="pitboss">Pitboss</option>
              <option value="admin">Yönetici (Admin)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              Kullanıcıyı Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Mevcut Kullanıcı Listesi ve Şifre Sıfırlama */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Kullanıcı Yönetimi & Şifre İşlemleri</h3>
          <span className="text-xs font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
            Toplam: {users.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b">
                <th className="px-6 py-4">Kullanıcı Bilgisi</th>
                <th className="px-6 py-4">Yetki</th>
                <th className="px-6 py-4">İşlemler / Şifre Sıfırla</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{u.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">@{u.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'admin' ? 'YÖNETİCİ' : 'PITBOSS'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {editingUserId === u.id ? (
                        <div className="flex items-center space-x-2 animate-in slide-in-from-right-2">
                          <input 
                            type="text"
                            placeholder="Yeni Şifre"
                            className="text-xs p-2 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button 
                            onClick={() => handleResetPassword(u.id)}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                            title="Onayla"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => { setEditingUserId(null); setNewPassword(''); }}
                            className="bg-slate-200 text-slate-600 p-2 rounded-lg hover:bg-slate-300 transition-colors"
                            title="İptal"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => setEditingUserId(u.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span>Şifre Sıfırla</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                            title="Hesabı Sil"
                            disabled={users.length <= 1 && u.role === 'admin'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
