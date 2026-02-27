import { BlockScores, ResultData } from '../types';
import { QUESTIONS } from '../constants';

export interface ProfileResult {
    quadrant: string;
    profile: string;
    personas: string[];
    flags: string[];
}

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

    return { quadrant, profile, personas, flags };
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
        blockScores,
        ipa,
        ircc,
        iise,
        axisX,
        axisY
    };
};
