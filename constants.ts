
import { Question } from './types';

export const QUESTIONS: Question[] = [
  // Bloco 1
  { id: 1, text: "Sinto-me confortável em tomar decisões importantes sobre meu trabalho sem precisar da aprovação prévia de um superior.", block: "B1", type: "positive" },
  { id: 2, text: "Prefiro que as diretrizes e prioridades do meu dia venham de uma liderança clara em vez de eu mesmo ter que defini-las.", block: "B1", type: "negative" },
  { id: 3, text: "Acredito que a autoridade deve vir do conhecimento técnico e da contribuição, e não apenas de um cargo hierárquico.", block: "B1", type: "positive" },
  // Bloco 2
  { id: 4, text: "Gosto de atuar em diferentes frentes e assumir novos papéis, mesmo que saiam da minha descrição de cargo original.", block: "B2", type: "positive" },
  { id: 5, text: "Sinto-me mais seguro e produtivo quando tenho um escopo de trabalho fixo e bem delimitado.", block: "B2", type: "negative" },
  { id: 6, text: "Tenho facilidade em aprender novas habilidades rapidamente para resolver problemas que surgem fora da minha área de especialidade.", block: "B2", type: "positive" },
  // Bloco 3
  { id: 7, text: "Trabalhar em equipe e trocar ideias constantemente com meus colegas me dá energia e motivação.", block: "B3", type: "positive" },
  { id: 8, text: "Muitas vezes prefiro resolver tarefas complexas sozinho antes de compartilhá-las com o grupo.", block: "B3", type: "positive" },
  { id: 9, text: "Considero-me uma pessoa empática e busco manter a harmonia e o bem-estar do time acima de interesses individuais.", block: "B3", type: "positive" },
  // Bloco 4
  { id: 10, text: "Consigo manter minha produtividade alta mesmo quando não há ninguém monitorando meus prazos ou entregas.", block: "B4", type: "positive" },
  { id: 11, text: "Tenho facilidade em organizar minha própria agenda e priorizar as tarefas mais importantes do dia.", block: "B4", type: "positive" },
  { id: 12, text: "Frequentemente preciso de lembretes externos ou cobranças para garantir que um projeto seja finalizado no prazo.", block: "B4", type: "negative" },
  // Bloco 5
  { id: 13, text: "Sinto-me confortável em expor meus erros e vulnerabilidades para o time se isso ajudar no aprendizado coletivo.", block: "B5", type: "positive" },
  { id: 14, text: "Acredito que certas informações estratégicas devem ser mantidas apenas com algumas pessoas para evitar confusão.", block: "B5", type: "negative" },
  { id: 15, text: "Sou o primeiro a compartilhar dados e resultados com meus colegas, mesmo que eles ainda não tenham sido solicitados.", block: "B5", type: "positive" },
  // Bloco 6
  { id: 16, text: "Sinto-me estimulado quando preciso criar soluções para problemas que não possuem um manual de instruções.", block: "B6", type: "positive" },
  { id: 17, text: "A falta de processos claros e definidos me gera ansiedade e dificulta minha tomada de decisão.", block: "B6", type: "negative" },
  { id: 18, text: "Consigo agir e decidir mesmo quando não tenho todas as informações ou dados disponíveis no momento.", block: "B6", type: "positive" },
  // Bloco 7
  { id: 19, text: "Assumo total responsabilidade pelos resultados do meu trabalho, sejam eles positivos ou negativos.", block: "B7", type: "positive" },
  { id: 20, text: "Em momentos de crise ou pressão extrema, consigo manter a calma e focar na solução em vez de reagir emocionalmente.", block: "B7", type: "positive" },
  { id: 21, text: "Sinto-me sobrecarregado quando sou o único responsável por uma decisão de alto impacto para a empresa.", block: "B7", type: "negative" },
  // Bloco 8
  { id: 22, text: "Tenho facilidade em mudar minha opinião quando sou apresentado a argumentos lógicos melhores que os meus.", block: "B8", type: "positive" },
  { id: 23, text: "Acho frustrante e demorado ter que esperar pelo consenso do grupo para implementar uma ideia que considero correta.", block: "B8", type: "negative" },
  { id: 24, text: "Valorizo mais a qualidade de uma decisão construída coletivamente do que a velocidade de uma decisão individual.", block: "B8", type: "positive" },
  // Bloco 9
  { id: 25, text: "Frequentemente ajudo meus colegas em suas tarefas sem que eles ou uma liderança precisem me pedir.", block: "B9", type: "positive" },
  { id: 26, text: "Sinto-me confortável em pedir ajuda aos meus pares quando percebo que não darei conta de uma demanda sozinho.", block: "B9", type: "positive" },
  { id: 27, text: "Acredito que cada um deve focar rigorosamente em suas próprias metas para que o sistema funcione bem.", block: "B9", type: "negative" },
  // Bloco 10
  { id: 28, text: "Estou sempre buscando formas de melhorar os processos atuais da empresa, mesmo que eles já estejam funcionando.", block: "B10", type: "positive" },
  { id: 29, text: "Minha motivação no trabalho está fortemente ligada ao quanto eu acredito na missão e no propósito da organização.", block: "B10", type: "positive" },
  { id: 30, text: "Prefiro focar em executar bem as tarefas que me são dadas do que ficar propondo novas frentes de trabalho.", block: "B10", type: "negative" },
  // Bloco 11
  { id: 31, text: "Consigo entrar em um estado de concentração profunda (hiperfoco) e trabalhar por horas sem perceber o tempo passar.", block: "B11", type: "positive" },
  { id: 32, text: "Ambientes com muito barulho, interrupções constantes ou conversas paralelas reduzem drasticamente minha performance.", block: "B11", type: "positive" },
  { id: 33, text: "Tenho facilidade em lidar com múltiplas notificações e solicitações ao mesmo tempo sem perder o fio da meada.", block: "B11", type: "positive" },
  // Bloco 12
  { id: 34, text: "Tenho muita energia para começar novos projetos, mas muitas vezes sinto dificuldade em manter o ritmo para finalizá-los.", block: "B12", type: "positive" },
  { id: 35, text: "Ter rituais fixos, rotinas previsíveis e acordos escritos é essencial para que eu me sinta seguro e produtivo.", block: "B12", type: "positive" },
  { id: 36, text: "Minha produtividade funciona melhor em picos de alta intensidade seguidos por períodos de recuperação, em vez de ser linear.", block: "B12", type: "positive" }
];

export const POWER_PLACES: Record<string, string> = {
  "Facilitador Sistêmico": "Seu lugar de potência está na arquitetura e evolução dos sistemas organizacionais, onde pode conectar estratégia, cultura e governança em uma visão integrada. Gera valor máximo quando possui autonomia para redesenhar processos, mediar tensões estruturais e aprimorar as regras do jogo coletivo.",
  "Líder Facilitador": "Seu lugar de potência está na condução de times autogeridos com clareza e protagonismo, transformando autonomia em coordenação eficaz. Brilha quando pode facilitar decisões críticas, impulsionar mudanças e manter estabilidade emocional em meio à evolução cultural.",
  "Orquestrador de Times": "Seu lugar de potência está na sincronia das relações e na fluidez das dinâmicas de equipe, atuando como elo de coesão entre diferentes perfis. Gera valor quando pode alinhar pessoas, sustentar rituais e garantir que todos avancem na mesma direção.",
  "Inovador Criativo": "Seu lugar de potência está na geração acelerada de ideias e soluções sob pressão, especialmente em contextos de inovação e experimentação. Brilha em sprints, lançamentos e momentos de ruptura, desde que conte com suportes que organizem sua energia criativa.",
  "Intraempreendedor Estratégico": "Seu lugar de potência está na fronteira entre estratégia e tecnologia, onde pode explorar novas possibilidades com autonomia radical. Gera valor exponencial quando assume projetos complexos, aprende rapidamente e integra múltiplos conhecimentos em soluções inéditas.",
  "Executor de Alto Impacto": "Seu lugar de potência está na realização concreta de projetos relevantes, com foco em metas claras e resultados mensuráveis. Brilha quando possui responsabilidade direta sobre entregas críticas e liberdade para decidir o melhor caminho para alcançá-las.",
  "Especialista Autônomo": "Seu lugar de potência está no domínio técnico profundo e na execução independente de alta qualidade. Gera valor quando pode trabalhar com concentração, autonomia e respeito à sua expertise, sem interferências desnecessárias.",
  "Especialista Analítico": "Seu lugar de potência está em ambientes que exigem precisão, lógica e análise detalhada de informações complexas. Brilha quando pode atuar com foco absoluto, comunicação objetiva e critérios claros de qualidade e integridade.",
  "Coordenador de Operações": "Seu lugar de potência está na mediação das dinâmicas humanas e na manutenção da saúde relacional do sistema. Gera valor quando pode antecipar conflitos, fortalecer vínculos e criar rituais que sustentem a segurança psicológica do grupo.",
  "Coordenador de Conexões": "Seu lugar de potência está no fortalecimento do engajamento coletivo e na promoção do pertencimento. Brilha quando pode apoiar colegas, integrar novos membros e manter viva a cultura organizacional.",
  "Coordenador de Fluxo": "Seu lugar de potência está na organização prática do cotidiano e na transformação de objetivos amplos em planos executáveis. Gera valor máximo quando há clareza de prioridades, processos definidos e responsabilidade por manter o ritmo das entregas.",
  "Coordenador de Suporte": "Seu lugar de potência está no apoio estruturado às operações e às pessoas, especialmente em ambientes com rotinas claras. Brilha quando conta com direcionamento objetivo e pode executar tarefas com previsibilidade e organização.",
  "Especialista da Conformidade": "Seu lugar de potência está na proteção da integridade técnica e normativa da organização. Gera valor exponencial quando pode estruturar controles, revisar políticas e garantir que regras e acordos sejam cumpridos com rigor.",
  "Especialista da Integridade": "Seu lugar de potência está na manutenção da qualidade e da confiabilidade dos processos internos. Brilha quando pode atuar com método, responsabilidade e atenção minuciosa aos detalhes operacionais.",
  "Especialista de Sustentação": "Seu lugar de potência está na execução estável e contínua de atividades essenciais ao funcionamento do sistema. Gera valor quando atua em rotinas previsíveis, com expectativas claras e baixa alternância de contexto.",
  "Especialista em Processos": "Seu lugar de potência está em tarefas sequenciais que exigem encadeamento lógico preciso e repetição qualificada. Brilha quando pode focar profundamente em uma atividade por vez, com silêncio, clareza e critérios objetivos de conclusão."
};
