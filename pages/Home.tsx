
import React from 'react';
import Layout from '../components/Layout';
import { ShieldCheck, Users, Zap, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const startAssessment = () => {
    window.location.hash = '#/assessment';
  };

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-20">
            Descubra seu <br /><span className="text-primary">Person-Organization Fit</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-20 max-w-3xl mx-auto leading-relaxed">
            Analise como seu perfil psicológico e cognitivo se alinha a modelos de autogestão ou estruturas tradicionais. Identifique o contexto de gestão que impulsiona sua performance e permite sua máxima potência profissional.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startAssessment}
              className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark hover:-translate-y-1 transition-all"
            >
              Iniciar Avaliação
            </button>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
              LEVA MENOS DE 10 MINUTOS
            </p>
          </div>
        </div>
      </section>


    </Layout>
  );
};

export default Home;
