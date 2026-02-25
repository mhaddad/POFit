
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import { CompetencyRadar, OrthogonalMatrix } from '../components/Charts';
import { ResultData } from '../types';
import { generateAIReport } from '../services/geminiService';
import {
  Download, Share2, Award, Zap, Brain, Users, Sparkles,
  ArrowUpRight, AlertCircle, FileText, Loader2, Info, CheckCircle2, Target, Copy, Check
} from 'lucide-react';

const Result: React.FC = () => {
  const [data, setData] = useState<ResultData | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const hashParts = window.location.hash.split('/');
      const resultId = hashParts[hashParts.length - 1];

      if (resultId) {
        try {
          const { getAssessment } = await import('../services/assessmentService');
          const dbResult = await getAssessment(resultId);

          if (dbResult) {
            setData(dbResult);
            // Check if AI report already exists in DB
            if (dbResult.aiReport && dbResult.aiReport.length > 0) {
              setAiReport(dbResult.aiReport);
            } else {
              // Only generate if it doesn't exist
              fetchAiReport(dbResult);
            }
          } else {
            console.warn('Assessment not found in DB');
          }
        } catch (error) {
          console.error('Error fetching assessment:', error);
        }
      }
    };
    fetchData();
  }, []);

  const fetchAiReport = async (result: ResultData) => {
    // Prevent double execution
    if (isAiLoading || aiReport) return;

    setIsAiLoading(true);
    try {
      const report = await generateAIReport(result);
      setAiReport(report);

      // Update in Supabase immediately
      const { updateAssessmentAIReport } = await import('../services/assessmentService');
      await updateAssessmentAIReport(result.id, report);
    } catch (error) {
      console.error("Failed to generate or save AI report:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 1. Diagnóstico de Prontidão para Autonomia (IPA)
  const getIPADiagnostic = (score: number, b10: number, b2: number) => {
    if (score < 3.0 && b10 > 3.5) return {
      status: "Autonomia com Suporte Estrutural",
      report: "Vontade de realizar é alta, mas a organização executiva oscila. Proativo e cheio de ideias, porém enfrenta dificuldades em priorizar sem um 'andaime' externo.",
      action: "Fornecer ferramentas visuais de controle (como Kanbans) e metas de curtíssimo prazo."
    };
    if (score < 3.0 && b10 <= 3.5) return {
      status: "Heteronomia de Execução",
      report: "Sente-se inseguro em ambientes de autonomia radical. Prefere que as prioridades e o passo-a-passo venham de uma autoridade externa.",
      action: "Escopo fechado e supervisão presente. Entregará qualidade quando o caminho estiver pavimentado."
    };
    if (score > 4.5 && b2 > 4.5) return {
      status: "Autonomia Estratégica Exponencial",
      report: "Agência máxima. Processa informações em velocidade superior à média. Autonomia intelectual e disruptiva.",
      action: "Garantir espaço de manobra e acesso a problemas complexos. Maior desafio é evitar o tédio."
    };
    if (score >= 4.0) return {
      status: "Autonomia Consolidada",
      report: "Perfil de alta agência. Organiza o próprio fluxo de trabalho sem esperar ordens, com previsibilidade e responsabilidade.",
      action: "Conceder liberdade e confiança no acompanhamento de resultados. Dispensa automicrogestão."
    };
    return {
      status: "Autonomia Funcional",
      report: "Transita bem entre a iniciativa pessoal e o seguimento de orientações estabelecidas. Valoriza o consenso do grupo.",
      action: "Marcos de alinhamento periódicos ou metas bem definidas servem como um ótimo guia."
    };
  };

  // 2. Diagnóstico de Resiliência e Carga Cognitiva (IRCC)
  const getIRCCDiagnostic = (score: number, b7: number, b6: number) => {
    if (score < 3.0 && b7 > 4.0) return {
      status: "Resiliência Estrutural",
      report: "Responsabilidade altíssima, mas tolerância baixa à ambiguidade social. Sofre se as regras do jogo mudam sem aviso.",
      action: "Criar 'Ilhas de Previsibilidade' baseadas em acordos escritos e literais. Evitar subentendidos."
    };
    if (score < 3.0 && b7 <= 4.0) return {
      status: "Vulnerabilidade ao Caos",
      report: "Baixa tolerância a ambientes fluidos ou de alta pressão. Risco de esgotamento ao lidar com mudanças constantes.",
      action: "Requer design de trabalho estável, funções de rotina e proteção contra tensões organizacionais."
    };
    if (score > 4.5 && b6 > 4.5) return {
      status: "Resiliência Sistêmica",
      report: "Processamento de alta voltagem. Entende padrões sistêmicos na complexidade absoluta e não se abala com crises.",
      action: "Ideal para arquitetar mudanças estruturais, mas pode necessitar de paciência com o ritmo do grupo."
    };
    if (score >= 4.0) return {
      status: "Resiliência Avançada",
      report: "Musculatura emocional para o incerto. Acalma o time na crise e itera soluções rapidamente quando um plano falha.",
      action: "Trata o imprevisto como dado e tem resiliência fluida a mudanças de contexto."
    };
    return {
      status: "Resiliência Padrão",
      report: "Resiliência saudável. Suporta pressões mas prefere que as mudanças ocorram com mínima justificativa lógica e transparência.",
      action: "Atua como filtro de bom senso e âncora do time em adaptações moderadas."
    };
  };

  // 3. Diagnóstico de Inteligência Social e Ética (IISE)
  const getIISEDiagnostic = (score: number, b5: number) => {
    if (score < 3.0 && b5 > 4.0) return {
      status: "Colaborador Assíncrono",
      report: "Ética e integridade máximas, mas baixa necessidade de interação social. Colaboração é técnica e factual.",
      action: "Permitir o 'Deep Work' via ferramentas assíncronas (Notion, Slack). Evitar reuniões desnecessárias."
    };
    if (score < 3.0 && b5 <= 4.0) return {
      status: "Colaborador Seletivo",
      report: "Tendência a reter informações como segurança ou poder. Apresenta riscos de formar gargalos de transparência.",
      action: "Foco profundo em alinhamento ético, protocolos de prestação de contas e acordos de transparência."
    };
    if (b5 > 4.8) return {
      status: "Colaborador Ético",
      report: "Vigilância ética extrema. Detecta hipocrisias na governança. Protege o sistema contra perda de integridade.",
      action: "Ideal para painéis de ética e controle de qualidade. Pode ser inflexível com meias-verdades."
    };
    if (score >= 4.0) return {
      status: "Conector Cultural",
      report: "Promotor de confiança radical e transparência. Lubrificante social que reduz atrito entre equipes e círculos.",
      action: "Essencial para espalhar a mentalidade Teal, mediar trocas e integrar novas pessoas na cultura."
    };
    return {
      status: "Colaborador Cooperativo",
      report: "Perfil equilibrado. Interage bem em squads, evita conflitos desnecessários e segue as normas sociais da equipe.",
      action: "Garante a estabilidade no clima e cumpre bem com papéis interdependentes."
    };
  };



  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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

  const ipaDiag = getIPADiagnostic(data.ipa, data.blockScores['B10'], data.blockScores['B2']);
  const irccDiag = getIRCCDiagnostic(data.ircc, data.blockScores['B7'], data.blockScores['B6']);
  const iiseDiag = getIISEDiagnostic(data.iise, data.blockScores['B5']);

  return (
    <Layout>
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
              Resultado da análise de Person-Organization Fit
            </span>
            <h1 className="text-4xl font-black text-slate-900 mt-2 mb-1">{data.name}</h1>
            <p className="text-slate-500 font-medium text-lg">
              <span className="text-primary font-bold">{data.classification}</span>
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 max-w-full md:max-w-md overflow-hidden">
                <span className="text-xs text-slate-500 font-mono truncate select-all">
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </span>
              </div>
              <button
                onClick={handleCopyUrl}
                className="p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-primary"
                title="Copiar Link"
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
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
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-300">Fit Score Autogestão</p>
          </div>
        </div>

        {/* Diagnostic Pillars Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Diagnóstico do perfil</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* IPA Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-amber-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Zap size={20} /></div>
                  <h3 className="font-bold text-slate-800">Índice de Prontidão para Autonomia</h3>
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
                  <h3 className="font-bold text-slate-800">Índice de Resiliência e Carga Cognitiva</h3>
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
                  <h3 className="font-bold text-slate-800">Índice de Inteligência Social e Ética</h3>
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
                Lugar de Potência na Organização
              </h3>

              <OrthogonalMatrix x={data.axisX} y={data.axisY} userName={data.name} />

              <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 shadow-sm">
                <div className="flex flex-col gap-2">
                  {/* Cabeçalho do Diagnóstico */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Diagnóstico de Alocação Estrutural
                    </span>
                    <div className="flex gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${data.axisX >= 3 ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-700'}`}>
                        {data.axisX >= 3 ? "AUTOGESTÃO" : "TRADICIONAL"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${data.axisY >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {data.axisY >= 3 ? "EQUIPE" : "INDIVIDUAL"}
                      </span>
                    </div>
                  </div>

                  {/* Nome do Sub-quadrante (Título) */}
                  <p className="text-md font-bold text-primary">
                    {data.subQuadrant || "Perfil Calculado"}
                  </p>

                  {/* Descrição Detalhada (Lugar de Potência) */}
                  <div className="mt-2 text-xs text-slate-600 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                    <p>O seu Lugar de Potência baseia-se na interseção única das suas características de processamento, organização, iniciativa e comportamento em contexto de incerteza e regras flexíveis. Nossa Inteligência Artificial gerou um diagnóstico aprofundado baseado na sua avaliação, listado abaixo.</p>
                    {data.designFlags && data.designFlags.length > 0 && (
                      <p className="mt-2 font-bold text-slate-500">Sinais de Design Universal: <span className="text-primary font-medium">{data.designFlags.join(', ')}</span></p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                Radar de Competências
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Result;
