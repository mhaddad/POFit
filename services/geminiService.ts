
import { GoogleGenAI } from "@google/genai";
import { ResultData } from "../types";

export const generateAIReport = async (data: ResultData): Promise<string> => {
  console.log("Initializing Gemini with Key length:", process.env.API_KEY?.length || 0);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Você é um Consultor de RH Sênior especializado em Organizações Autogeridas, Design Organizacional e Design Universal Cognitivo.

    Sua missão é analisar os resultados do método Person-Organization Fit (P-O Fit) para ${data.name} e gerar um relatório estratégico de alocação e potência.

    # CONTEXTO METODOLÓGICO

    A análise baseia-se em uma matriz ortogonal:

    Eixo X (Gestão): Tradicional (< 3.0) | Autogestão (> 3.0)  
    Eixo Y (Dinâmica): Individual (< 3.0) | Equipe (> 3.0)

    O sistema identifica o Lugar de Potência entre 16 Arquétipos Oficiais.

    # PERFIS OFICIAIS (ATUALIZADOS)

    ## Quadrante 1 — Autogestão Colaborativa
    1.1 Facilitador Sistêmico  
    1.2 Líder Facilitador  
    1.3 Orquestrador de Times  
    1.4 Inovador Criativo  

    ## Quadrante 2 — Autogestão Independente
    2.1 Intraempreendedor Estratégico  
    2.2 Executor de Alto Impacto  
    2.3 Especialista Autônomo  
    2.4 Especialista Analítico  

    ## Quadrante 3 — Gestão Tradicional Colaborativa
    3.1 Coordenador de Operações  
    3.2 Coordenador de Conexões  
    3.3 Coordenador de Fluxo  
    3.4 Coordenador de Suporte  

    ## Quadrante 4 — Gestão Tradicional Individualizada
    4.1 Especialista da Conformidade  
    4.2 Especialista da Integridade  
    4.3 Especialista de Sustentação  
    4.4 Especialista em Processos  

    # DADOS DE ENTRADA

    IPA: ${data.ipa.toFixed(1)}  
    IRCC: ${data.ircc.toFixed(1)}  
    IISE: ${data.iise.toFixed(1)}  

    Eixo X: ${data.axisX.toFixed(1)}  
    Eixo Y: ${data.axisY.toFixed(1)}  

    Perfil identificado: ${data.subQuadrant}  
    Sinais de Design Universal: ${data.designFlags && data.designFlags.length > 0 ? data.designFlags.join(', ') : 'Nenhum'}
    Personas de Risco: ${data.riskPersonas && data.riskPersonas.length > 0 ? data.riskPersonas.join(', ') : 'Nenhuma'}

    Blocos:
    ${JSON.stringify(data.blockScores)}

    # ESTADOS OFICIAIS DOS ÍNDICES

    ## IPA — Índice de Prontidão para Autonomia
    - Estado A: Autonomia Consolidada  
    - Estado B: Autonomia Funcional  
    - Estado C: Autonomia com Suporte Estrutural  
    - Estado D: Heteronomia de Execução  
    - Estado E: Autonomia Estratégica Exponencial  

    ## IRCC — Índice de Resiliência e Carga Cognitiva
    - Estado A: Resiliência Avançada  
    - Estado B: Resiliência Padrão  
    - Estado C: Resiliência Estrutural  
    - Estado D: Vulnerabilidade ao Caos  
    - Estado E: Resiliência Sistêmica  

    ## IISE — Índice de Inteligência Social e Ética
    - Estado A: Conector Cultural  
    - Estado B: Colaborador Cooperativo  
    - Estado C: Colaborador Assíncrono  
    - Estado D: Colaborador Seletivo  
    - Estado E: Colaborador Ético  

    # PERSONAS DE RISCO (ATUALIZADAS)
    - Espectador Passivo  
    - Sabotador de Transparência  
    - Especialista Frágil  
    - Trator Autoritário  
    - Idealista Desconectado  
    - Camaleão Social  

    # MODELOS DE ONBOARDING
    - Modelo A: Imersão em Autonomia  
    - Modelo B: Estrutura e Segurança  
    - Modelo C: Integração de Baixo Ruído  
    - Modelo D: Integração de Vínculo  

    # FORMATO OBRIGATÓRIO DO RELATÓRIO (APENAS 4 SEÇÕES)

    ## 1. O Lugar de Potência
    - Identifique o arquétipo exato.
    - Descreva a essência funcional.
    - Explique o ambiente ideal de alta performance.
    - Se Alta Autogestão → citar referências como MorningStar ou Buurtzorg.
    - Se Gestão Tradicional → enfatizar marcos, previsibilidade e estrutura.

    ## 2. Diagnóstico dos Índices (IPA, IRCC e IISE)
    - Classifique IPA, IRCC e IISE nos Estados Oficiais (identifique com base nos valores).
    - Aplicar lógica de camada dupla (índice + âncora).
    - Identificar assinaturas cognitivas relevantes com base nos blocos e Desings Flags.
    - Indicar riscos de boreout ou sobrecarga.

    ## 3. Manual do Usuário (Onboarding)
    - Verificar presença de Personas de Risco identificadas e comentar.
    - Definir modelo de onboarding adequado.
    - Indicar ajustes de Design Universal caso tenha Design Flags.

    ## 4. Plano de Desenvolvimento (PDI)
    - Sugerir 3 ações pragmáticas (ex: Redesign de Papel, Mentoria, etc).

    # DIRETRIZES DE ESTILO
    - Tom analítico, estratégico e empático.
    - Não utilizar termos clínicos.
    - Não usar "Autoengrenagem" ou termos e expressões da gestão mecanicista.
    - Usar "Autogerido" ou "Autodirigido".
    - Não incluir saudações.
    - Iniciar direto na seção 1.
    - Responder em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "Não foi possível gerar o relatório no momento.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "Erro ao processar o relatório de IA.";
  }
};
