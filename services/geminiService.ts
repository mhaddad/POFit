
import { GoogleGenAI } from "@google/genai";
import { ResultData } from "../types";

export const generateAIReport = async (data: ResultData): Promise<string> => {
  console.log("Initializing Gemini with Key length:", process.env.API_KEY?.length || 0);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Você é um consultor de RH sênior especializado em Organizações de Autogestão e Psicometria Organizacional.
    Analise os resultados do Person-Organization Fit para o candidato ${data.name}.
    
    CRITÉRIOS DIAGNÓSTICOS (Use estes dados para fundamentar sua análise):
    1. IPA (Prontidão para Autonomia): Pontuação ${data.ipa.toFixed(1)}/5.0. 
       - Blocos: B1 (Gestão), B4 (Execução), B10 (Iniciativa).
       - > 4.0: Perfil "Autoengrenagem".
       - < 3.0: Dependência de estrutura externa.
    
    2. IRCC (Resiliência e Carga Cognitiva): Pontuação ${data.ircc.toFixed(1)}/5.0.
       - Blocos: B6 (Incerteza), B7 (Resiliência), B8 (Flexibilidade).
       - > 4.0: Estabilidade emocional no caos.
       - < 3.0: Vulnerabilidade ao estresse por ambiguidade.
    
    3. IISE (Inteligência Social e Ética): Pontuação ${data.iise.toFixed(1)}/5.0.
       - Blocos: B3 (Colaboração), B5 (Transparência), B9 (Coordenação Lateral).
       - > 4.0: Conector cultural e promotor de confiança.
       - < 3.0: Perfil de "Silo" ou retenção de informação.

    4. ALOCAÇÃO ESTRUTURAL (Ortogonal):
       - Eixo X (Gestão): ${data.axisX.toFixed(1)}
       - Eixo Y (Trabalho): ${data.axisY.toFixed(1)}
       - Classificação Atual: ${data.classification}

    5. SCORES POR BLOCO (1.0 a 5.0):
   ${JSON.stringify(data.blockScores)}
   (Mapeamento: B1:Autoridade, B2:Papéis, B3:Amabilidade, B4:Disciplina, B5:Transparência, B6:Ambiguidade, B7:Estabilidade, B8:Consenso, B9:Coordenação, B10:Iniciativa)

    INSTRUÇÕES DE FORMATO:
    Gere um relatório executivo em Markdown com os seguintes pilares obrigatórios:

    ESTRUTURA DO RELATÓRIO (MARKDOWN):

    ### 1. RESUMO EXECUTIVO
    Defina o quadrante do respondente. Explique o "lugar ideal" dele na organização:
    - Alta Autogestão + Alta Equipe: Perfil Colaborativo Teal (Ex: Squads/Buurtzorg).
    - Alta Autogestão + Alto Individual: Perfil Independente Teal (Ex: MorningStar).
    - Baixa Autogestão: Perfis Tradicionais (Corporativo Estruturado ou Especialista Isolado).

    ### 2. DIAGNÓSTICO DOS ÍNDICES CRÍTICOS
    - **Índice de Prontidão para Autonomia (IPA):** Analise se o perfil é um "Indivíduo Autodirigido" ou se depende de estrutura externa. Use os dados de B1, B4 e B10 para citar riscos de procrastinação ou potencial de ownership.
    - **Índice de Resiliência e Carga Cognitiva (IRCC):** Avalie a capacidade de decidir sob incerteza (B6) e o risco de burnout por ambiguidade (B7 e B8). Mencione a adequação para projetos "Greenfield".
    - **Índice de Inteligência Social e Ética (IISE):** Identifique se o perfil é um "Conector Cultural" (B5 e B9) ou se possui tendência a atuar em "Silos" (B3).

    ### 3. PLANO DE AÇÃO PERSONALIZADO (ANÁLISE DE CONFLITOS)
    Cruze as características para propor intervenções baseadas em "Personas de Risco". Analise e recomende ações se identificar:
    - Alta Iniciativa (B10) + Baixa Amabilidade (B3): "O Trator Autônomo" (Ação: Especialista em Missão Especial).
    - Alta Iniciativa (B10) + Baixa Disciplina (B4): "O Criativo Caótico" (Ação: Gestão Visual/Kanban).
    - Alta Abertura (B2) + Baixa Estabilidade (B7): "O Inovador Frágil" (Ação: Ambiente Sandbox).
    - Baixa Transparência (B5): (Ação: Protocolos de Transparência Radical).

    ### 4. RECOMENDAÇÕES DE DESENVOLVIMENTO (GAPS DE ÍNDICE)
    Sugira práticas como Shadowing de Crise, Treinamento em CNV, Mentoria de Autoliderança ou Redesign de Papel conforme as pontuações mais baixas em IPA, IRCC ou IISE.

    DIRETRIZES DE TOM DE VOZ:
    - Profissional, analítico e encorajador.
    - Seja conciso e objetivo, consolidando as informações.
    - Use terminologia moderna (Teal, Autodireção, Coordenação Lateral).
    - Foco em "Lugar de Potência" (onde o indivíduo gera mais valor) em vez de apenas "pontos fracos".
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
