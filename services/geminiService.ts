
import { GoogleGenAI } from "@google/genai";
import { ResultData } from "../types";

export const generateAIReport = async (data: ResultData): Promise<string> => {
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

    DADOS DOS BLOCOS (1-5): ${JSON.stringify(data.blockScores)}

    INSTRUÇÕES DE FORMATO:
    Gere um relatório executivo em Markdown com os seguintes pilares obrigatórios:

    # RELATÓRIO DE FIT ORGANIZACIONAL: ${data.name}

    ### 1. ANÁLISE DE PRONTIDÃO (IPA)
    Descreva se o perfil é "Autoengrenagem" ou dependente de estrutura. Cite riscos de procrastinação ou potencial de ownership.

    ### 2. GESTÃO DE INCERTEZA E RESILIÊNCIA (IRCC)
    Avalie o risco de Burnout por ambiguidade ou a capacidade de atuar em projetos "Greenfield". Use o contexto de sistemas de Autogestão/Horizontais.

    ### 3. DINÂMICA SOCIAL E ÉTICA (IISE)
    Identifique se é um "Conector Cultural" ou se possui tendência a "Silos". Recomende treinamentos como CNV se a nota for baixa.

    ### 4. MATRIZ DE ALOCAÇÃO ESTRATÉGICA
    Defina o "lugar ideal" (Facilitador de Squads, Especialista Autônomo, Gestor Tradicional ou Executor de Processo).

    ### 5. PLANO DE AÇÃO PERSONALIZADO
    Proponha intervenções práticas baseadas nos gaps (ex: Shadowing de Crise, GTD, Mentoria de Produtividade, Feedback 360º). Se houver alta autonomia mas baixa amabilidade, sugira o papel de "Especialista em Missão Especial".

    Mantenha um tom executivo, preciso e voltado para a tomada de decisão.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar o relatório no momento.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "Erro ao processar o relatório de IA.";
  }
};
