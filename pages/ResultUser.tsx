import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ResultData } from '../types';
import { POWER_PLACES } from '../constants';
import { Loader2, Copy, Check, Info, Target, Users, Zap, Compass, CheckCircle2 } from 'lucide-react';

const ResultUser: React.FC = () => {
    const [data, setData] = useState<ResultData | null>(null);
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
                    } else {
                        console.warn('Assessment not found');
                    }
                } catch (error) {
                    console.error('Error fetching assessment:', error);
                }
            }
        };
        fetchData();
    }, []);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const getThermometerLabel = (score: number) => {
        if (score >= 4.0) return "Alto";
        if (score >= 3.0) return "Equilibrado";
        return "Precisa de Suporte";
    };

    const getThermometerColor = (score: number, baseClass: string) => {
        if (score >= 4.0) return `bg-${baseClass}-500`;
        if (score >= 3.0) return `bg-${baseClass}-400`;
        return `bg-${baseClass}-300`;
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

    // Textos didáticos por faixa (sem IA) baseados no score médio
    const getHelpToShineText = () => {
        if (data.overallScore > 80) return "Ambientes que te dão liberdade para testar ideias, autonomia para resolver problemas do seu jeito e uma equipe que valoriza soluções fora da caixa.";
        if (data.overallScore > 60) return "Espaços com uma mistura saudável de estrutura clara e momentos para você liderar. Você brilha quando as expectativas são alinhadas e você pode organizar seu ritmo.";
        return "Estruturas onde as regras são claras, a comunicação é direta e você pode se aprofundar nas suas tarefas sem surpresas constantes.";
    };

    const getTendToDrainText = () => {
        if (data.overallScore > 80) return "Microgerenciamento, excesso de processos burocráticos sem propósito claro e resistências muito fortes a mudanças rápidas.";
        if (data.overallScore > 60) return "Ambientes caóticos sem nenhuma direção estabelecida, ou inversamente, lugares engessados demais que não permitem nenhuma adaptação na rotina.";
        return "Mudanças bruscas de prioridade de última hora, comunicações muito abstratas sem passos práticos e ambientes que exigem tomada de decisão sobre o incerto constantemente.";
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
                {/* Profile Hero */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-primary/5 select-none pointer-events-none">
                        <Compass size={180} />
                    </div>

                    <div className="flex-grow text-center md:text-left relative z-10">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                            Conheça seu perfil
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">{data.name}</h1>
                        <p className="text-slate-500 font-medium text-lg mb-4">
                            <span className="text-primary font-bold">{data.subQuadrant || "Perfil Calculado"}</span>
                        </p>

                        <div className="mt-3 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 w-full sm:max-w-xs overflow-hidden">
                                <span className="text-xs text-slate-500 font-mono truncate select-all">
                                    {typeof window !== 'undefined' ? window.location.href : ''}
                                </span>
                            </div>
                            <button
                                onClick={handleCopyUrl}
                                className="p-2 py-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all text-slate-600 font-medium w-full sm:w-auto"
                            >
                                {isCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                <span className="text-xs">{isCopied ? "Copiado!" : "Copiar"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 1. Seu Lugar de Potência */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Target size={24} className="text-primary" />
                        Seu Lugar de Potência
                    </h2>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
                        <p>{data.subQuadrant && POWER_PLACES[data.subQuadrant] ? POWER_PLACES[data.subQuadrant] : "Seu perfil combina características únicas de foco, organização e colaboração. Continue lendo para entender os detalhes do que faz você brilhar na sua rotina."}</p>
                    </div>
                </div>

                {/* 2. 3 Termômetros (Simplificados) */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
                        <Zap size={24} className="text-primary" />
                        Como você opera no dia a dia
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Termômetro 1: Autonomia */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                                <Zap size={32} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">Autonomia no dia a dia</h3>
                            <p className="text-xs text-slate-500 mb-4 h-10">Sua capacidade de direcionar o próprio trabalho e tomar decisões focado no objetivo.</p>

                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                                <div className={`h-full ${getThermometerColor(data.ipa, 'amber')} transition-all duration-1000`} style={{ width: `${(data.ipa / 5) * 100}%` }}></div>
                            </div>
                            <span className={`text-sm font-bold ${data.ipa >= 4.0 ? 'text-amber-600' : data.ipa >= 3.0 ? 'text-amber-500' : 'text-amber-400'}`}>
                                {getThermometerLabel(data.ipa)}
                            </span>
                        </div>

                        {/* Termômetro 2: Resiliência/Mudanças */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                <Compass size={32} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">Conforto com mudanças</h3>
                            <p className="text-xs text-slate-500 mb-4 h-10">Como você absorve e processa novidades, adaptações e ritmos dinâmicos de projeto.</p>

                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                                <div className={`h-full ${getThermometerColor(data.ircc, 'blue')} transition-all duration-1000`} style={{ width: `${(data.ircc / 5) * 100}%` }}></div>
                            </div>
                            <span className={`text-sm font-bold ${data.ircc >= 4.0 ? 'text-blue-600' : data.ircc >= 3.0 ? 'text-blue-500' : 'text-blue-400'}`}>
                                {getThermometerLabel(data.ircc)}
                            </span>
                        </div>

                        {/* Termômetro 3: Colaboração */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                <Users size={32} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">Colaboração e transparência</h3>
                            <p className="text-xs text-slate-500 mb-4 h-10">Sua preferência por trabalhar em grupo, criar conexões e comunicar processos.</p>

                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                                <div className={`h-full ${getThermometerColor(data.iise, 'purple')} transition-all duration-1000`} style={{ width: `${(data.iise / 5) * 100}%` }}></div>
                            </div>
                            <span className={`text-sm font-bold ${data.iise >= 4.0 ? 'text-purple-600' : data.iise >= 3.0 ? 'text-purple-500' : 'text-purple-400'}`}>
                                {getThermometerLabel(data.iise)}
                            </span>
                        </div>

                    </div>
                </div >

                {/* 3. O que te ajuda a brilhar / O que tende a te drenar */}
                < div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                    <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 shadow-sm">
                        <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            O que ajuda você a brilhar
                        </h3>
                        <p className="text-sm text-green-900/80 leading-relaxed">
                            {getHelpToShineText()}
                        </p>
                    </div>

                    <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 shadow-sm">
                        <h3 className="font-bold text-rose-800 mb-3 flex items-center gap-2">
                            <Info size={18} />
                            O que tende a drenar sua energia
                        </h3>
                        <p className="text-sm text-rose-900/80 leading-relaxed">
                            {getTendToDrainText()}
                        </p>
                    </div>
                </div >

                {/* 4. Seu manual de uso (versão leve) */}
                < div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm" >
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Users size={24} className="text-primary" />
                        Seu Manual de Uso
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl">
                            <h4 className="font-bold text-slate-800 text-sm mb-2">Comunicação</h4>
                            <p className="text-xs text-slate-600">
                                {data.iise >= 3.5 ? "Proativo nas trocas. Gosta de alinhar expectativas ativamente e funciona bem discutindo ideias com outras pessoas." : "Mais restrito e focado na tarefa. Prefere comunicar por texto ou em momentos previamente agendados e com pauta clara."}
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl">
                            <h4 className="font-bold text-slate-800 text-sm mb-2">Autonomia</h4>
                            <p className="text-xs text-slate-600">
                                {data.ipa >= 3.5 ? "Familiarizado em ter espaço para tomar decisões. Lida bem com metas, moldando os próximos passos por conta própria." : "Para otimizar o seu tempo e dedicação, uma rotina mais estável com apoio de gestão de entregas é o melhor caminho."}
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl">
                            <h4 className="font-bold text-slate-800 text-sm mb-2">Ambiente de Trabalho</h4>
                            <p className="text-xs text-slate-600">
                                {data.ircc >= 3.5 ? "Confortável em cenários que se desdobram aos poucos. Suporta pressão e mudança de contexto sem perder a eficiência." : "Funciona muito bem com previsibilidade de demandas. A continuidade nas tarefas aumenta sua clareza sobre onde o valor é gerado."}
                            </p>
                        </div>
                    </div>
                </div >

                {/* 5. 3 próximos passos (checklist) */}
                < div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 shadow-sm" >
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Target size={24} className="text-primary" />
                        Próximos Passos
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="mt-0.5 text-primary"><CheckCircle2 size={18} /></div>
                            <p className="text-sm text-slate-700"><strong>Reflita sobre o perfil:</strong> Observe nos próximos dias se você se reconhece nestas fortalezas levantadas durante os seus projetos. </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-0.5 text-primary"><CheckCircle2 size={18} /></div>
                            <p className="text-sm text-slate-700"><strong>Compartilhe o manual:</strong> Mostrar essas dicas para sua equipe ou liderança ajuda a desenhar processos ideais para o seu fluxo de trabalho.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-0.5 text-primary"><CheckCircle2 size={18} /></div>
                            <p className="text-sm text-slate-700"><strong>Agende alinhamentos:</strong> Estruture conversas regulares (1:1) com quem trabalha com você para revisar se a carga cognitiva e o ambiente estão saudáveis.</p>
                        </li>
                    </ul>
                </div >

                {/* Rodapé fixo */}
                < div className="text-center py-6 border-t border-slate-100" >
                    <p className="text-xs text-slate-400 font-medium">
                        <Info size={12} className="inline mr-1" />
                        Este resultado é para alocação e design do trabalho — não é diagnóstico clínico.
                        Baseado na tecnologia de assinatura cognitiva.
                    </p>
                </div >

            </div >
        </Layout >
    );
};

export default ResultUser;
