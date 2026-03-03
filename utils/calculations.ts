import { BlockScores, ResultData } from '../types';
import { QUESTIONS } from '../constants';

export interface ProfileResult {
    quadrant: string;
    profile: string;
    personas: string[];
    flags: string[];
    onboardingModel: string;
}

export const getIPADiagnosticStatus = (score: number, b10: number, b2: number) => {
    if (score < 3.0 && b10 > 3.5) return "Autonomia com Suporte Estrutural";
    if (score < 3.0 && b10 <= 3.5) return "Heteronomia de Execução";
    if (score > 4.5 && b2 > 4.5) return "Autonomia Estratégica Exponencial";
    if (score >= 4.0) return "Autonomia Consolidada";
    return "Autonomia Funcional";
};

export const getIRCCDiagnosticStatus = (score: number, b7: number, b6: number) => {
    if (score < 3.0 && b7 > 4.0) return "Resiliência Estrutural";
    if (score < 3.0 && b7 <= 4.0) return "Vulnerabilidade ao Caos";
    if (score > 4.5 && b6 > 4.5) return "Resiliência Sistêmica";
    if (score >= 4.0) return "Resiliência Avançada";
    return "Resiliência Padrão";
};

export const getIISEDiagnosticStatus = (score: number, b5: number) => {
    if (score < 3.0 && b5 > 4.0) return "Colaborador Assíncrono";
    if (score < 3.0 && b5 <= 4.0) return "Colaborador Seletivo";
    if (b5 > 4.8) return "Colaborador Ético";
    if (score >= 4.0) return "Conector Cultural";
    return "Colaborador Cooperativo";
};

export const calculateProfile = (
    axisX: number,
    axisY: number,
    ipa: number,
    ircc: number,
    iise: number,
    b: BlockScores
): ProfileResult => {
    let quadrant = "";
    let profile = "";
    const personas: string[] = [];
    const flags: string[] = [];

    // Quadrants and Profiles
    if (axisX >= 3.0 && axisY >= 3.0) {
        quadrant = "Autogestão Colaborativa";
        if (ipa > 4.5 && b.B2 > 4.5) profile = "Facilitador Sistêmico";
        else if (ipa > 4.0 && ircc > 4.0) profile = "Líder Facilitador";
        else if (b.B10 > 4.0 && b.B4 < 2.5) profile = "Inovador Criativo";
        else profile = "Orquestrador de Times";
    } else if (axisX >= 3.0 && axisY < 3.0) {
        quadrant = "Autogestão Independente";
        if (ipa > 4.5 && b.B2 > 4.5) profile = "Intraempreendedor Estratégico";
        else if (b.B5 > 4.5 && b.B3 < 2.5) profile = "Especialista Analítico";
        else if (ipa > 4.0 && ircc > 3.5) profile = "Executor de Alto Impacto";
        else profile = "Especialista Autônomo";
    } else if (axisX < 3.0 && axisY >= 3.0) {
        quadrant = "Gestão Tradicional Colaborativa";
        if (b.B3 > 4.5 && b.B9 > 4.5) profile = "Coordenador de Operações";
        else if (b.B12 < 2.5 && b.B3 > 4.0) profile = "Coordenador de Suporte";
        else if (iise > 4.0) profile = "Coordenador de Conexões";
        else profile = "Coordenador de Fluxo";
    } else {
        quadrant = "Gestão Tradicional Individualizada";
        if (b.B5 > 4.8 && b.B7 > 4.5) profile = "Especialista da Conformidade";
        else if (b.B8 < 2.0 && b.B12 > 4.0) profile = "Especialista em Processos";
        else if (b.B5 > 4.0 && ircc > 3.5) profile = "Especialista da Integridade";
        else profile = "Especialista de Sustentação";
    }

    // Risk Personas
    if (ipa < 2.8 && ircc < 2.8) personas.push("O Espectador Passivo");
    if (iise < 2.8 && b.B5 < 3.0) personas.push("O Sabotador de Transparência");
    if (iise > 4.0 && ircc < 2.8) personas.push("O Especialista Frágil");
    if (ipa > 4.0 && iise < 3.0 && b.B5 < 3.0) personas.push("O Trator Autoritário");
    if (b.B10 > 4.2 && b.B4 < 2.8 && ircc < 3.0) personas.push("O Idealista Desconectado");
    if (b.B3 > 4.2 && b.B5 < 3.0) personas.push("O Camaleão Social");

    // Design Flags
    if (ipa > 4.5 && b.B2 > 4.5 && b.B10 > 4.5) flags.push("Potência Exponencial");
    if (b.B10 > 4.0 && (b.B4 < 2.5 || b.B12 < 2.5)) flags.push("Suporte Executivo");
    if (b.B5 > 4.5 && (b.B3 < 2.5 || b.B11 < 2.5)) flags.push("Comunicação Assíncrona");

    // Onboarding Model Mapping
    let onboardingModel = "";
    if (["Facilitador Sistêmico", "Líder Facilitador", "Intraempreendedor Estratégico", "Executor de Alto Impacto"].includes(profile)) {
        onboardingModel = "A"; // 1.1, 1.2, 2.1, 2.2
    } else if (["Coordenador de Fluxo", "Coordenador de Suporte", "Especialista de Sustentação", "Especialista em Processos"].includes(profile)) {
        onboardingModel = "B"; // 3.3, 3.4, 4.3, 4.4
    } else if (["Especialista Autônomo", "Especialista Analítico", "Especialista da Integridade"].includes(profile)) {
        onboardingModel = "C"; // 2.3, 2.4, 4.2
    } else if (["Orquestrador de Times", "Coordenador de Operações", "Coordenador de Conexões"].includes(profile)) {
        onboardingModel = "D"; // 1.3, 3.1, 3.2
    } else {
        onboardingModel = "A"; // Default fallback (Inovador Criativo 1.4, Especialista da Conformidade 4.1 not explicit in mapping, assuming default or keeping logic)
        // Adjusting based on standard naming:
        if (profile === "Inovador Criativo") onboardingModel = "A"; // 1.4 usually fits A or C, let's say A
        if (profile === "Especialista da Conformidade") onboardingModel = "B"; // 4.1 usually fits B
    }


    return { quadrant, profile, personas, flags, onboardingModel };
};

export const calculateScores = (answers: Record<number, number>): Omit<ResultData, 'id' | 'date' | 'name' | 'email'> => {
    const blockScores: BlockScores = {};
    for (let i = 1; i <= 12; i++) {
        const blockKey = `B${i}`;
        const blockQuestions = QUESTIONS.filter(q => q.block === blockKey);

        let sum = 0;
        blockQuestions.forEach(q => {
            const answer = answers[q.id] || 0;
            const score = q.type === 'negative' ? (6 - answer) : answer;
            sum += score;
        });

        blockScores[blockKey] = sum / blockQuestions.length;
    }

    const ipa = (blockScores.B1 + blockScores.B4 + blockScores.B10) / 3;
    const ircc = (blockScores.B6 + blockScores.B7 + blockScores.B8) / 3;
    const iise = (blockScores.B3 + blockScores.B5 + blockScores.B9) / 3;

    const axisX = ipa;
    const axisY = (blockScores.B3 + blockScores.B9) / 2;

    const totalNormalizedScore = QUESTIONS.reduce((acc, q) => {
        const answer = answers[q.id] || 0;
        const score = q.type === 'negative' ? (6 - answer) : answer;
        return acc + score;
    }, 0);
    const overallScore = totalNormalizedScore / 36;

    const profileRes = calculateProfile(axisX, axisY, ipa, ircc, iise, blockScores);

    return {
        overallScore: (overallScore / 5) * 100,
        classification: profileRes.quadrant,
        subQuadrant: profileRes.profile,
        riskPersonas: profileRes.personas,
        designFlags: profileRes.flags,
        onboardingModel: profileRes.onboardingModel,
        ipaStatus: getIPADiagnosticStatus(ipa, blockScores.B10, blockScores.B2),
        irccStatus: getIRCCDiagnosticStatus(ircc, blockScores.B7, blockScores.B6),
        iiseStatus: getIISEDiagnosticStatus(iise, blockScores.B5),
        blockScores,
        ipa,
        ircc,
        iise,
        axisX,
        axisY
    };
};
