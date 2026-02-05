
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
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Descubra seu <span className="text-primary">Person-Organization Fit</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Avalie sua compatibilidade com estruturas de autogestão em comparação com modelos hierárquicos tradicionais para encontrar o ambiente de trabalho ideal para o seu perfil profissional.
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

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Autogestão vs. Tradicional</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Nossa avaliação analisa suas preferências através de dimensões organizacionais fundamentais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Autonomia</h3>
              <p className="text-slate-600 leading-relaxed">
                Preferência por auto-direcionamento versus supervisão e diretrizes claras de superiores.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Comunicação</h3>
              <p className="text-slate-600 leading-relaxed">
                Transparência em rede aberta versus fluxos de informação top-down controlados.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Tomada de Decisão</h3>
              <p className="text-slate-600 leading-relaxed">
                Decisões baseadas em consentimento entre pares versus aprovação gerencial vertical.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Pronto para encontrar seu fit?</h2>
          <p className="text-slate-400 text-lg mb-10">
            Junte-se a milhares de profissionais que já alinharam suas carreiras com seus valores organizacionais.
          </p>
          <button 
            onClick={startAssessment}
            className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-light transition-colors"
          >
            Começar Agora Gratuitamente
          </button>
        </div>
        {/* Background blobs for aesthetics */}
        <div className="absolute top-0 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </section>
    </Layout>
  );
};

export default Home;
