
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { QUESTIONS } from '../constants';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import LeadForm from './LeadForm';

const Assessment: React.FC = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const questionsPerStep = 10;
  const currentQuestions = QUESTIONS.slice((step - 1) * questionsPerStep, step * questionsPerStep);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return <LeadForm answers={answers} />;
  }

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-slate-900 font-bold">Passo {step} de 3</h2>
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}% concluído</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Avaliação do Person-Organization Fit</h1>
          <p className="text-slate-500">
            Por favor, responda às questões abaixo selecionando o nível que melhor descreve sua opinião em relação ao seu ambiente de trabalho ideal.
          </p>
        </div>

        <div className="space-y-12">
          {currentQuestions.map((q, idx) => (
            <div key={q.id} className="group">
              <p className="text-lg font-semibold text-slate-800 mb-6 group-hover:text-primary transition-colors">
                {q.id}. {q.text}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:w-24 text-center sm:text-right">
                  Discordo Totalmente
                </span>

                <div className="flex items-center gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      className={`
                        size-12 rounded-full border-2 font-bold text-lg transition-all
                        ${answers[q.id] === val
                          ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20'
                          : 'border-slate-200 text-slate-400 hover:border-primary/50 hover:text-primary'}
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:w-24 text-center sm:text-left">
                  Concordo Totalmente
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-end pt-8 border-t border-slate-200">
          <button
            onClick={nextStep}
            disabled={currentQuestions.some(q => !answers[q.id])}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all
              ${currentQuestions.every(q => answers[q.id])
                ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
            `}
          >
            {step === 3 ? 'Ver Resultado' : 'Continuar'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;
