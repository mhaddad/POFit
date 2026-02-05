
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ResultData } from '../types';
import { Eye, Link as LinkIcon, Trash2, Search, FileBarChart, Users, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<ResultData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('po-fit-results-')) {
        const item = localStorage.getItem(key);
        if (item) items.push(JSON.parse(item));
      }
    }
    setAssessments(items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const deleteRecord = (id: string) => {
    if (confirm('Deseja realmente excluir este registro?')) {
      localStorage.removeItem(`po-fit-results-${id}`);
      setAssessments(prev => prev.filter(a => a.id !== id));
    }
  };

  const filtered = assessments.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgFit = filtered.length > 0 ? (filtered.reduce((acc, curr) => acc + curr.overallScore, 0) / filtered.length).toFixed(0) : 0;

  return (
    <Layout isAdmin title="Admin - P-O FIT">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl font-black text-slate-900">Painel Administrativo</h1>
           <p className="text-slate-500">Gerencie e analise o ajuste pessoa-organização da sua base de usuários.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
             <div className="size-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FileBarChart size={28} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Avaliações</p>
                <p className="text-3xl font-black text-slate-900">{filtered.length}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
             <div className="size-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={28} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Média de Fit</p>
                <p className="text-3xl font-black text-emerald-600">{avgFit}%</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
             <div className="size-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Users size={28} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Usuários Ativos</p>
                <p className="text-3xl font-black text-slate-900">{new Set(filtered.map(a => a.email)).size}</p>
             </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
             <h3 className="text-xl font-bold text-slate-800">Avaliações Recentes</h3>
             <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Buscar registros..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Data/Hora</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Nome</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">E-mail</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase text-center">Média</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm text-slate-500">{new Date(a.date).toLocaleString('pt-BR')}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-800">{a.name}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{a.email}</td>
                    <td className="px-8 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full">
                        {Math.round(a.overallScore)}%
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3 text-slate-400">
                        <button 
                          onClick={() => window.location.hash = `#/result/${a.id}`}
                          className="hover:text-primary transition-colors p-1" title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            const url = `${window.location.origin}${window.location.pathname}#/result/${a.id}`;
                            navigator.clipboard.writeText(url);
                            alert('Link copiado para a área de transferência!');
                          }}
                          className="hover:text-blue-500 transition-colors p-1" title="Copiar Link"
                        >
                          <LinkIcon size={18} />
                        </button>
                        <button 
                          onClick={() => deleteRecord(a.id)}
                          className="hover:text-red-500 transition-colors p-1" title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">Nenhum registro encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 text-xs text-slate-400 font-medium">
             Mostrando {filtered.length} de {assessments.length} registros.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
