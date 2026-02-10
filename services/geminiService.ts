
import { GoogleGenAI } from "@google/genai";
import { ResultData } from "../types";

export const generateAIReport = async (data: ResultData): Promise<string> => {
  console.log("Initializing Gemini with Key length:", process.env.API_KEY?.length || 0);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Você é um consultor de RH sênior especializado em Organizações Teal, Autogestão e Psicometria Organizacional.
    Analise os resultados do Person-Organization Fit para ${data.name}.

    ### CONTEXTO METODOLÓGICO
    A análise baseia-se em uma matriz ortogonal (Eixo X: Estilo de Gestão | Eixo Y: Dinâmica de Trabalho). 
    O sistema identifica o "Lugar de Potência" do respondente em 8 sub-quadrantes baseados na distância das notas em relação ao centro (3.0):
    - Alta Autogestão + Alta Equipe: Facilitador de Governança (Extremo) ou Colaborador de Squad (Equilibrado).
    - Alta Autogestão + Alto Individual: Empreendedor Interno (Extremo) ou Especialista Focado (Equilibrado).
    - Baixa Autogestão + Alta Equipe: Harmonizador de Clima (Extremo) ou Líder Operacional (Equilibrado).
    - Baixa Autogestão + Alto Individual: Guardião da Norma (Extremo) ou Especialista de Processo (Equilibrado).

    ### CRITÉRIOS DIAGNÓSTICOS (Dados de Entrada)
    1. IPA (Prontidão para Autonomia): Pontuação ${data.ipa.toFixed(1)}/5.0. 
       - Blocos: B1 (Gestão e Autoridade), B4 (Execução e Autonomia), B10 (Iniciativa e Propósito).
       - > 4.0: Perfil "Indivíduo Autodirigido" (motivação intrínseca e autonomia com alto ownership).
       - < 3.0: Dependência de estrutura externa (Necessidade de balizamento e marcos de segurança).
    
    2. IRCC (Resiliência e Carga Cognitiva): Pontuação ${data.ircc.toFixed(1)}/5.0.
       - Blocos: B6 (Decisão e Incerteza), B7 (Resiliência e Responsabilidade), B8 (Flexibilidade e Consenso).
       - > 4.0: Estabilidade no caos (Alta tolerância à ambiguidade e decisões coletivas).
       - < 3.0: Vulnerabilidade ao estresse por ambiguidade (Risco de burnout em sistemas fluidos).
    
    3. IISE (Inteligência Social e Ética): Pontuação ${data.iise.toFixed(1)}/5.0.
       - Blocos: B3 (Colaboração e Interação), B5 (Transparência e Informação), B9 (Coordenação Lateral e Apoio).
       - > 4.0: Conector cultural e promotor de confiança radical.
       - < 3.0: Perfil de "Silo" ou retenção estratégica de informação.

    4. ALOCAÇÃO ESTRUTURAL (Matriz Ortogonal de 8 Sub-quadrantes):
       - Eixo X (Gestão): ${data.axisX.toFixed(1)} (Tradicional < 3.0 > Autogestão)
       - Eixo Y (Trabalho): ${data.axisY.toFixed(1)} (Individual < 3.0 > Equipe)
       - Sub-quadrante Identificado: ${data.subQuadrant} (Define o "Lugar de Potência" específico).

    5. SCORES POR BLOCO (1.0 a 5.0):
       ${JSON.stringify(data.blockScores)}
       (Mapeamento: B1:Autoridade, B2:Papéis, B3:Amabilidade, B4:Disciplina, B5:Transparência, B6:Ambiguidade, B7:Estabilidade, B8:Consenso, B9:Coordenação, B10:Iniciativa)

    ### INSTRUÇÕES DE FORMATO (Markdown - Apenas 4 seções):

    ### 1. RESUMO EXECUTIVO E LUGAR DE POTÊNCIA
    Identifique o sub-quadrante específico e descreva o ambiente onde o respondente gera mais valor. 
    - Se Autogestão (Alta X): Cite exemplos como MorningStar (Individual) ou Buurtzorg/Ateliê de Software (Equipe).
    - Se Tradicional (Baixa X): Destaque a necessidade de marcos de segurança, hierarquia clara ou silos estruturados.

    ### 2. DIAGNÓSTICO DOS ÍNDICES CRÍTICOS
    - **Índice de Prontidão para Autonomia (IPA):** Avalie a capacidade de autodireção. Analise o equilíbrio entre Iniciativa (B10) e Disciplina (B4).
    - **Índice de Resiliência e Carga Cognitiva (IRCC):** Avalie a estabilidade emocional (B7) frente à ambiguidade (B6) e a paciência para processos de consenso (B8).
    - **Índice de Inteligência Social e Ética (IISE):** Determine se é um "Conector Cultural" ou se possui tendência a atuar de forma isolada (Silos).

    ### 3. PLANO DE AÇÃO PERSONALIZADO (PERSONAS DE RISCO)
    Analise conflitos entre blocos e recomende intervenções para:
    - Alta Iniciativa (B10) + Baixa Amabilidade (B3): "O Trator Autônomo" (Foco: Escuta ativa e papéis de especialista).
    - Alta Iniciativa (B10) + Baixa Disciplina (B4): "O Criativo Caótico" (Foco: Gestão Visual/Kanban).
    - Alta Abertura (B2) + Baixa Estabilidade (B7): "O Inovador Frágil" (Foco: Ambiente Sandbox).
    - Baixa Transparência (B5): "Retenção de Informação" (Foco: Protocolos de Accountability).

    ### 4. RECOMENDAÇÕES DE DESENVOLVIMENTO
    Sugira 3 práticas pragmáticas (ex: Shadowing de Crise, Mentoria de Autoliderança, Treinamento em CNV ou Redesign de Papel) baseadas nos menores scores dos blocos.

    ### DIRETRIZES DE ESTILO:
    - Profissional, analítico e encorajador.
    - Não utilize a palavra Autoengrenagem. Prefira Autogerido.
    - Seja conciso e objetivo, consolidando as informações.
    - Use terminologia moderna (Autogestão, Autodireção, Auto-organização,Coordenação Compartilhada, Liderança Emergente).
    - Foco em "Lugar de Potência" (onde o indivíduo gera mais valor) em vez de apenas "pontos fracos".
    - Não inclua nenhum texto de introdução antes dos 4 tópicos. Apenas os 4 tópicos.
    - Responda em Português do Brasil.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      temperature: 0.7,
    });
    return response.text || "Não foi possível gerar o relatório no momento.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "Erro ao processar o relatório de IA.";
  }
};
