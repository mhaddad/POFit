import { describe, it, expect } from 'vitest';
import { calculateScores } from '../utils/calculations';
import { QUESTIONS } from '../constants';

describe('Scoring Logic', () => {

    it('should generate maximum overall fit score (100%) and highest possible metrics', () => {
        // Produce answers that generate the maximum fit:
        // positive questions = 5
        // negative questions = 1
        const maxAnswers: Record<number, number> = {};
        QUESTIONS.forEach(q => {
            maxAnswers[q.id] = q.type === 'positive' ? 5 : 1;
        });

        const scores = calculateScores(maxAnswers);

        // With perfectly aligned answers, the overall score should be 100
        expect(scores.overallScore).toBe(100);

        // Each block should ideally have a score of 5
        for (const [key, val] of Object.entries(scores.blockScores)) {
            expect(val).toBe(5);
        }

        // IPa, IRCC, IISE should compute to 5
        expect(scores.ipa).toBe(5);
        expect(scores.ircc).toBe(5);
        expect(scores.iise).toBe(5);

        // Axis X and Y should be 5
        expect(scores.axisX).toBe(5);
        expect(scores.axisY).toBe(5);

        // Check quadrant and classification
        expect(scores.classification).toBe("Autogestão Colaborativa");

        // Potência Exponencial flag should be set
        expect(scores.designFlags?.includes("Potência Exponencial")).toBe(true);
    });

    it('should generate minimum overall fit score (20%) and lowest possible metrics', () => {
        // Produce answers that generate the minimum fit:
        // positive questions = 1
        // negative questions = 5
        const minAnswers: Record<number, number> = {};
        QUESTIONS.forEach(q => {
            minAnswers[q.id] = q.type === 'positive' ? 1 : 5;
        });

        const scores = calculateScores(minAnswers);

        // Answer value 1 on all maps to normalized 1, so 1/5 = 20%
        expect(scores.overallScore).toBe(20);

        // Each block should ideally have a score of 1
        for (const [key, val] of Object.entries(scores.blockScores)) {
            expect(val).toBe(1);
        }

        // IPa, IRCC, IISE should compute to 1
        expect(scores.ipa).toBe(1);
        expect(scores.ircc).toBe(1);
        expect(scores.iise).toBe(1);

        // Axis X and Y should be 1
        expect(scores.axisX).toBe(1);
        expect(scores.axisY).toBe(1);

        // Check quadrant and classification
        expect(scores.classification).toBe("Gestão Tradicional Individualizada");

        // Personas check - Should map to some risk personas given low scores
        expect(scores.riskPersonas?.includes("O Espectador Passivo")).toBe(true);
        expect(scores.riskPersonas?.includes("O Sabotador de Transparência")).toBe(true);
    });

});
