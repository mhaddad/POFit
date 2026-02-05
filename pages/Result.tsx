
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import { CompetencyRadar, OrthogonalMatrix } from '../components/Charts';
import { ResultData } from '../types';
import { generateAIReport } from '../services/geminiService';
import {
  Download, Share2, Award, Zap, Brain, Users, Sparkles,
  ArrowUpRight, AlertCircle, FileText, Loader2, Info, CheckCircle2, Target
} from 'lucide-react';

const Result: React.FC = () => {
  const [data, setData] = useState<ResultData | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const hashParts = window.location.hash.split('/');
    const resultId = hashParts[hashParts.length - 1];

    if (resultId) {
      const stored = localStorage.getItem(`po-fit-results-${resultId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        if (!parsed.aiReport) {
          fetchAiReport(parsed);
        } else {
          setAiReport(parsed.aiReport);
        }
      }
    }
  }, []);

  const fetchAiReport = async (result: ResultData) => {
    setIsAiLoading(true);
    const report = await generateAIReport(result);
    setAiReport(report);
    setIsAiLoading(false);

    const updated = { ...result, aiReport: report };
    localStorage.setItem(`po-fit-results-${result.id}`, JSON.stringify(updated));
  };

  const getIPADiagnostic = (score: number) => {
    if (score >= 4.0) return {
      status: "Perfil 'Autoengrenagem'",
      report: "Indivíduo com alta disciplina interna e senso de ownership. Define o 'como' fazer além do 'o que'.",
      action: "Conceder liberdade total de agenda. Evitar microgestão e reuniões de status desnecessárias."
    };
    if (score < 3.0) return {
      status: "Dependência de Estrutura",
      report: "Risco de procrastinação na ausência de cobrança direta. Necessita de metas externas claras.",
      action: "Recomendado mentor de apoio e treinamento em metodologias de produtividade (ex: GTD)."
    };
    return {
      status: "Equilíbrio em Autonomia",
      report: "Transita bem entre autonomia e supervisão conforme o contexto do projeto.",
      action: "Manter alinhamentos periódicos focados em resultados, não no micro-processo."
    };
  };

  const getIRCCDiagnostic = (score: number) => {
    if (score >= 4.0) return {
      status: "Estabilidade no Caos",
      report: "Alta resiliência emocional. Lida bem com a falta de manuais e decisões lentas por consenso.",
      action: "Alocar em projetos Greenfield ou áreas em construção. Ótimo facilitador em crises."
    };
    if (score < 3.0) return {
      status: "Vulnerabilidade à Ambiguidade",
      report: "Risco de burnout em sistemas de autogestão/horizontais. A falta de hierarquia é percebida como insegurança.",
      action: "Criar 'ilhas de previsibilidade' com processos escritos e acordos de trabalho bem definidos."
    };
    return {
      status: "Resiliência Adaptativa",
      report: "Suporta níveis moderados de incerteza, mas prefere algum nível de balizamento estrutural.",
      action: "Fornecer documentação clara enquanto incentiva a participação em decisões coletivas."
    };
  };

  const getIISEDiagnostic = (score: number) => {
    if (score >= 4.0) return {
      status: "Conector Cultural",
      report: "Facilita a aprendizagem organizacional sendo transparente com erros. Coordena pares naturalmente.",
      action: "Ideal para papéis de mediação, onboarding e guardião da cultura (Feedback 360º)."
    };
    if (score < 3.0) return {
      status: "Perfil de 'Silo'",
      report: "Tendência a retenção de informação ou dificuldade em trabalho síncrono com o time.",
      action: "Treinamento em Comunicação Não-Violenta (CNV) e reforço em transparência radical."
    };
    return {
      status: "Colaborador Social",
      report: "Bom nível de transparência e cooperação, atuando bem em squads multidisciplinares.",
      action: "Incentivar a exposição de aprendizados e melhorias de processo em grupo."
    };
  };

  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </Layout>
    );
  }

  const ipaDiag = getIPADiagnostic(data.ipa);
  const irccDiag = getIRCCDiagnostic(data.ircc);
  const iiseDiag = getIISEDiagnostic(data.iise);

  return (
    <Layout title="Dashboard de Resultados">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Profile Hero */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="size-40 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
              <img src={`https://picsum.photos/seed/${data.id}/200`} alt="Avatar" className="size-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
              <Award size={24} />
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
              Análise de Fit Pessoa-Organização
            </span>
            <h1 className="text-4xl font-black text-slate-900 mt-2 mb-1">{data.name}</h1>
            <p className="text-slate-500 font-medium text-lg">
              Perfil: <span className="text-primary font-bold">{data.classification}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1">
                <Target size={14} /> X: {data.axisX.toFixed(1)} (Gestão)
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1">
                <Users size={14} /> Y: {data.axisY.toFixed(1)} (Trabalho)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl min-w-[220px] text-white">
            <div className="relative size-32">
              <svg className="size-full transform -rotate-90">
                <circle className="radial-progress-bg" cx="64" cy="64" r="58" strokeWidth="8" style={{ stroke: '#334155' }} />
                <circle
                  className="radial-progress-val"
                  cx="64" cy="64" r="58" strokeWidth="8"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * data.overallScore) / 100}
                  style={{ stroke: '#008080' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{Math.round(data.overallScore)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fit Score Autogestão</span>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-300">Prontidão Organizacional</p>
          </div>
        </div>

        {/* Diagnostic Pillars Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Pilares Diagnósticos</h2>
            <div className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
              Análise por blocos (B1-B10)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* IPA Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-amber-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Zap size={20} /></div>
                  <h3 className="font-bold text-slate-800">IPA</h3>
                </div>
                <span className="text-2xl font-black text-amber-600">{data.ipa.toFixed(1)}</span>
              </div>
              <div className="p-6 flex-grow space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                  <p className="text-sm font-bold text-slate-700">{ipaDiag.status}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Relatório</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{ipaDiag.report}</p>
                </div>
                <div className="pt-4 mt-auto border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ações Recomendadas</h4>
                  <div className="p-3 bg-slate-50 rounded-xl flex gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium">{ipaDiag.action}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* IRCC Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Brain size={20} /></div>
                  <h3 className="font-bold text-slate-800">IRCC</h3>
                </div>
                <span className="text-2xl font-black text-blue-600">{data.ircc.toFixed(1)}</span>
              </div>
              <div className="p-6 flex-grow space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                  <p className="text-sm font-bold text-slate-700">{irccDiag.status}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Relatório</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{irccDiag.report}</p>
                </div>
                <div className="pt-4 mt-auto border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ações Recomendadas</h4>
                  <div className="p-3 bg-slate-50 rounded-xl flex gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium">{irccDiag.action}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* IISE Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Users size={20} /></div>
                  <h3 className="font-bold text-slate-800">IISE</h3>
                </div>
                <span className="text-2xl font-black text-purple-600">{data.iise.toFixed(1)}</span>
              </div>
              <div className="p-6 flex-grow space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                  <p className="text-sm font-bold text-slate-700">{iiseDiag.status}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Relatório</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{iiseDiag.report}</p>
                </div>
                <div className="pt-4 mt-auto border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ações Recomendadas</h4>
                  <div className="p-3 bg-slate-50 rounded-xl flex gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium">{iiseDiag.action}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts and AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Matriz Ortogonal de Alocação
              </h3>
              <OrthogonalMatrix x={data.axisX} y={data.axisY} userName={data.name} />
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Lugar Ideal na Organização</h4>
                <p className="text-sm font-bold text-primary">{data.classification}</p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {data.axisX >= 3 && data.axisY >= 3 ? "O Facilitador de Squads: Desenvolver habilidades de facilitação e governança dinâmica." :
                    data.axisX >= 3 && data.axisY < 3 ? "O Especialista Autônomo: Focar em contratos de responsabilidade clara e autonomia técnica." :
                      data.axisX < 3 && data.axisY >= 3 ? "O Gestor de Equipes Tradicional: Necessita 'desaprender' controle em ambientes de autogestão." :
                        "O Executor de Processo: Alocar em tarefas técnicas repetitivas com manuais rígidos."}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                Radar de Competências (B1-B10)
              </h3>
              <CompetencyRadar scores={data.blockScores} />
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 text-primary/5 select-none pointer-events-none">
              <Sparkles size={120} />
            </div>

            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
              <Sparkles size={16} /> Relatório Gerado por IA
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">Síntese do Perfil e<br />Plano de Ação</h2>

            {isAiLoading ? (
              <div className="flex-grow flex flex-col items-center justify-center gap-4 py-12">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-slate-400 font-medium text-center max-w-[200px]">Nossa IA está fundamentando seu diagnóstico...</p>
              </div>
            ) : (
              <div className="flex-grow">
                <article className="prose prose-slate max-w-none 
                  prose-h3:text-primary prose-h3:font-extrabold prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-8
                  prose-p:leading-relaxed prose-p:text-slate-600 prose-p:text-sm
                  prose-strong:text-slate-800 prose-strong:font-bold
                  prose-ul:text-sm prose-li:text-slate-600">
                  {aiReport ? (
                    <ReactMarkdown>
                      {aiReport.replace(/```markdown/g, '').replace(/```/g, '')}
                    </ReactMarkdown>
                  ) : (
                    <div className="p-8 bg-slate-50 rounded-2xl flex items-center gap-4 text-slate-500 italic text-sm">
                      <AlertCircle size={20} />
                      O relatório avançado não pôde ser gerado no momento.
                    </div>
                  )}
                </article>
              </div>
            )}

            <div className="mt-12 flex flex-wrap justify-end gap-3 pt-8 border-t border-slate-100">
              <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all">
                <Download size={16} /> PDF
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                <Share2 size={16} /> Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Result;
