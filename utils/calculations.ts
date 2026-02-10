export const calculateSubQuadrant = (axisX: number, axisY: number): string => {
    const isAutogestao = axisX >= 3.0;
    const isEquipe = axisY >= 3.0;

    // Define se o perfil é "Extremo" (A) ou "Equilibrado" (B)
    // Limiares: < 1.8 ou > 4.2
    const isExtreme = axisX > 4.2 || axisX < 1.8 || axisY > 4.2 || axisY < 1.8;

    if (isAutogestao && isEquipe) {
        return isExtreme ? "Facilitador de Governança" : "Colaborador de Equipe";
    }

    if (isAutogestao && !isEquipe) {
        return isExtreme ? "Empreendedor Interno" : "Especialista Focado";
    }

    if (!isAutogestao && isEquipe) {
        return isExtreme ? "Harmonizador de Clima" : "Líder Operacional";
    }

    // Caso: Tradicional + Individual
    return isExtreme ? "Guardião da Norma" : "Especialista de Processo";
};
