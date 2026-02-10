
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
  const getIPADiagnostic = (score: number) => {
    if (score >= 4.0) return {
      status: "Indivíduo Autodirigido",
      report: "Motivado intrinsecamente, autônomo com alta disciplina interna e senso de ownership. Define 'o que' e o 'como' fazer com maestria.",
      action: "Conceder liberdade total de agenda e definição de métodos. Compartilhar regras e restrições. Evitar reuniões de status desnecessárias."
    };
    if (score < 3.0) return {
      status: "Dependência de Estrutura",
      report: "Necessita de balizamento externo para evitar procrastinação. Sente-se perdido sem uma liderança direta.",
      action: "Recomendado 'Job Crafting Assistido' e treinamento em metodologias de produtividade (ex: GTD)."
    };
    return {
      status: "Autonomia em Desenvolvimento",
      report: "Opera bem com independência moderada, mas valoriza marcos de validação periódicos.",
      action: "Manter alinhamentos focados em resultados, incentivando a tomada de decisão gradual."
    };
  };

  // 2. Diagnóstico de Resiliência e Carga Cognitiva (IRCC)
  const getIRCCDiagnostic = (score: number) => {
    if (score >= 4.0) return {
      status: "Estabilidade no Caos",
      report: "Alta resiliência emocional e tolerância à ambiguidade. Atua como porto seguro em cenários de incerteza.",
      action: "Ideal para projetos 'Greenfield' ou áreas em construção. Atuar como facilitador em crises."
    };
    if (score < 3.0) return {
      status: "Vulnerabilidade à Ambiguidade",
      report: "Risco de estresse elevado e burnout em sistemas sem hierarquia. A incerteza gera insegurança paralisante.",
      action: "Criar 'ilhas de previsibilidade' com processos escritos e acordos de trabalho claros."
    };
    return {
      status: "Resiliência Adaptativa",
      report: "Suporta mudanças de rumo, desde que existam marcos de segurança estrutural.",
      action: "Fornecer documentação clara enquanto incentiva a participação em decisões coletivas."
    };
  };

  // 3. Diagnóstico de Inteligência Social e Ética (IISE)
  const getIISEDiagnostic = (score: number) => {
    if (score >= 4.0) return {
      status: "Conector Cultural",
      report: "Promotor de confiança e transparência radical. Coordena pares naturalmente através da empatia.",
      action: "Ideal para papéis de mediação, onboarding de novos membros e guardião da cultura."
    };
    if (score < 3.0) return {
      status: "Perfil de 'Silo'",
      report: "Tendência à retenção de informação ou dificuldade em lidar com a exposição de erros em público.",
      action: "Treinamento em Comunicação Não-Violenta (CNV) e dinâmicas de feedback focado em segurança psicológica."
    };
    return {
      status: "Colaborador Cooperativo",
      report: "Bom nível de colaboração, atuando bem em squads quando os papéis estão definidos.",
      action: "Incentivar a coordenação lateral direta sem a necessidade de mediadores."
    };
  };

  const getSubQuadrantDescription = (axisX: number, axisY: number) => {
    const isAutogestao = axisX >= 3.0;
    const isEquipe = axisY >= 3.0;

    // Limiares para sub-quadrantes 'A' (Extremos)
    const isExtremeX = axisX > 4.2 || axisX < 1.8;
    const isExtremeY = axisY > 4.2 || axisY < 1.8;

    if (isAutogestao && isEquipe) {
      return (isExtremeX || isExtremeY)
        ? "Lugar de Potência: Mestre em mediação e design de sistemas sociais autogeridos. Ideal para fundar ou liderar a evolução da governança."
        : "Lugar de Potência: Focado em sincronia grupal e execução síncrona em times ágeis ou squads interdependentes.";
    }

    if (isAutogestao && !isEquipe) {
      return (isExtremeX || isExtremeY)
        ? "Lugar de Potência: Altíssima agência solo e inovação. Ideal para gerir seus próprios contratos de entrega e novos negócios."
        : "Lugar de Potência: Profundidade técnica e autonomia com preferência por interfaces assíncronas e baixa necessidade de reuniões.";
    }

    if (!isAutogestao && isEquipe) {
      return (isExtremeX || isExtremeY)
        ? "Lugar de Potência: Coesão social e empatia profunda. Floresce com suporte de liderança estruturante e foco no bem-estar do grupo."
        : "Lugar de Potência: Excelente em organizar fluxos de trabalho e pessoas dentro de metas e hierarquias claras.";
    }

    // Tradicional + Individual
    return (isExtremeX || isExtremeY)
      ? "Lugar de Potência: Manutenção da ordem e fidelidade absoluta a protocolos rígidos, hierarquias e segurança institucional."
      : "Lugar de Potência: Precisão técnica e confiabilidade em escopos bem delimitados e departamentos estruturados.";
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

  const ipaDiag = getIPADiagnostic(data.ipa);
  const irccDiag = getIRCCDiagnostic(data.ircc);
  const iiseDiag = getIISEDiagnostic(data.iise);

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
                    {(() => {
                      const isExtreme = data.axisX > 4.2 || data.axisX < 1.8 || data.axisY > 4.2 || data.axisY < 1.8;
                      if (data.axisX >= 3 && data.axisY >= 3) return isExtreme ? "O Facilitador de Governança" : "O Colaborador de Equipe";
                      if (data.axisX >= 3 && data.axisY < 3) return isExtreme ? "O Empreendedor Interno" : "O Especialista Focado";
                      if (data.axisX < 3 && data.axisY >= 3) return isExtreme ? "O Harmonizador de Clima" : "O Líder Operacional";
                      return isExtreme ? "O Guardião da Norma" : "O Especialista de Processo";
                    })()}
                  </p>

                  {/* Descrição Detalhada (Lugar de Potência) */}
                  <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                    {(() => {
                      const isExtreme = data.axisX > 4.2 || data.axisX < 1.8 || data.axisY > 4.2 || data.axisY < 1.8;

                      // Alta Autogestão + Equipe
                      if (data.axisX >= 3 && data.axisY >= 3) {
                        return isExtreme
                          ? "Mestre em mediação e design de sistemas sociais. Ideal para fundar ou liderar a evolução da governança e cultura de autogestão."
                          : "Focado em sincronia grupal e execução síncrona em times ágeis ou squads interdependentes.";
                      }

                      // Alta Autogestão + Individual
                      if (data.axisX >= 3 && data.axisY < 3) {
                        return isExtreme
                          ? "Altíssima agência solo e inovação. Ideal para gerir seus próprios contratos de entrega e projetos disruptivos."
                          : "Profundidade técnica e autonomia com preferência por interfaces assíncronas e baixa necessidade de reuniões sociais.";
                      }

                      // Tradicional + Equipe
                      if (data.axisX < 3 && data.axisY >= 3) {
                        return isExtreme
                          ? "Coesão social e empatia profunda. Floresce com suporte de liderança estruturante e foco total no bem-estar do grupo."
                          : "Excelente em organizar fluxos de trabalho e pessoas dentro de metas hierárquicas e departamentos claros.";
                      }

                      // Tradicional + Individual
                      return isExtreme
                        ? "Manutenção da ordem e fidelidade absoluta a protocolos rígidos, hierarquias e máxima segurança institucional."
                        : "Precisão técnica e confiabilidade em escopos bem delimitados, processos repetitivos e departamentos estruturados.";
                    })()}
                  </p>
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
