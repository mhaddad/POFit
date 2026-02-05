
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { User, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { ResultData, BlockScores, FitClassification } from '../types';
import { QUESTIONS } from '../constants';

interface LeadFormProps {
  answers: Record<number, number>;
}

const LeadForm: React.FC<LeadFormProps> = ({ answers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculateResults = (): ResultData => {
    const blockScores: BlockScores = {};
    for (let i = 1; i <= 10; i++) {
      const blockKey = `B${i}`;
      const qIds = QUESTIONS.filter(q => q.block === blockKey).map(q => q.id);
      const sum = qIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
      blockScores[blockKey] = sum / qIds.length;
    }

    const ipa = (blockScores.B1 + blockScores.B4 + blockScores.B10) / 3;
    const ircc = (blockScores.B6 + blockScores.B7 + blockScores.B8) / 3;
    const iise = (blockScores.B3 + blockScores.B5 + blockScores.B9) / 3;

    // Axis X (Gestão): B1, B2, B4, B5, B6, B7, B8, B10
    const axisX = (blockScores.B1 + blockScores.B2 + blockScores.B4 + blockScores.B5 + blockScores.B6 + blockScores.B7 + blockScores.B8 + blockScores.B10) / 8;
    // Axis Y (Trabalho): B3, B9
    const axisY = (blockScores.B3 + blockScores.B9) / 2;

    // Fix: Explicitly cast Object.values and type reduce parameters to resolve unknown inference error on line 35
    const overallScore = (Object.values(answers) as number[]).reduce((a: number, b: number) => a + b, 0) / 30;

    let classification = "";
    if (axisX >= 3 && axisY >= 3) classification = FitClassification.TEAL_COLLABORATIVE;
    else if (axisX >= 3 && axisY < 3) classification = FitClassification.TEAL_INDEPENDENT;
    else if (axisX < 3 && axisY >= 3) classification = FitClassification.CORPORATE_STRUCTURED;
    else classification = FitClassification.SPECIALIST_ISOLATED;

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      name,
      email,
      overallScore: (overallScore / 5) * 100,
      classification,
      blockScores,
      ipa,
      ircc,
      iise,
      axisX,
      axisY
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = calculateResults();
    
    // In a real app, save to DB here
    const resultsKey = `po-fit-results-${result.id}`;
    localStorage.setItem(resultsKey, JSON.stringify(result));
    
    // Simulate processing
    setTimeout(() => {
      window.location.hash = `#/result/${result.id}`;
    }, 1500);
  };

  return (
    <Layout title="Quase lá!">
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
          <div className="text-center mb-8">
            <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Quase pronto!</h1>
            <p className="text-slate-500 text-sm">
              Identifique-se para gerarmos seu relatório personalizado e dashboard de resultados.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail Profissional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processando...
                </>
              ) : (
                'Ver meu resultado'
              )}
            </button>
          </form>

          <p className="mt-6 text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">
            Seus dados estão seguros e protegidos
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LeadForm;
