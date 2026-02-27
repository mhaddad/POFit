
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { User, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { ResultData, BlockScores } from '../types';
import { QUESTIONS } from '../constants';
import { calculateProfile, calculateScores } from '../utils/calculations';

interface LeadFormProps {
  answers: Record<number, number>;
}

const LeadForm: React.FC<LeadFormProps> = ({ answers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculateResults = (): ResultData => {
    const scores = calculateScores(answers);

    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name,
      email,
      overallScore: scores.overallScore,
      classification: scores.classification,
      subQuadrant: scores.subQuadrant,
      riskPersonas: scores.riskPersonas,
      designFlags: scores.designFlags,
      blockScores: scores.blockScores,
      ipa: scores.ipa,
      ircc: scores.ircc,
      iise: scores.iise,
      axisX: scores.axisX,
      axisY: scores.axisY
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = calculateResults();

    try {
      // Save local backup
      const resultsKey = `po-fit-results-${result.id}`;
      localStorage.setItem(resultsKey, JSON.stringify(result));

      // Save to Supabase
      const { saveAssessment } = await import('../services/assessmentService');
      await saveAssessment(result);

      // Simulate processing (reduced time since we have real async now)
      setTimeout(() => {
        window.location.hash = `#/result/${result.id}`;
      }, 500);
    } catch (error) {
      console.error('Failed to save assessment', error);
      // Fallback: still redirect if local save worked, maybe show toast?
      // For now, proceed.
      window.location.hash = `#/result/${result.id}`;
    }
  };

  return (

    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-slate-900 font-bold">Quase lá!</h2>
            <span className="text-sm font-semibold text-primary">100% concluído</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Seu perfil foi identificado!</h1>
          <p className="text-slate-500 text-lg">
            Para finalizar e gerar seu relatório detalhado com o diagnóstico de Person-Organization Fit, precisamos apenas que você se identifique abaixo.
          </p>
        </div>

        <div className="max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-slate-800"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-slate-800"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={24} />
                    Revelar meu Resultado
                  </>
                )}
              </button>
              <p className="mt-4 text-xs text-slate-400 font-medium">
                * Seus dados são confidenciais e usados apenas para gerar este relatório.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LeadForm;
