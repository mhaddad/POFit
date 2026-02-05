
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Lock, User, LogIn } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'poFit@admin') {
      window.location.hash = '#/admin';
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <Layout title="Admin Login">
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Painel de Gestão</h1>
            <p className="text-slate-400 text-sm">Acesse o controle administrativo da plataforma.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
