import { BlockScores } from '../types';

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
