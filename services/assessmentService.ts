
import { supabase } from './supabaseClient';
import { ResultData } from '../types';

export const saveAssessment = async (data: ResultData) => {
    const { error } = await supabase
        .from('assessments')
        .insert([
            {
                id: data.id, // Use the generated ID or let Supabase generate one (if we omit this, but we generate it in frontend)
                created_at: data.date,
                name: data.name,
                email: data.email,
                overall_score: data.overallScore,
                classification: data.classification,
                block_scores: data.blockScores,
                ipa: data.ipa,
                ircc: data.ircc,
                iise: data.iise,
                axis_x: data.axisX,
                axis_y: data.axisY,
                ai_report: data.aiReport
            }
        ]);

    if (error) {
        console.error('Error saving assessment:', error);
        throw error;
    }
};

export const updateAssessmentAIReport = async (id: string, aiReport: string) => {
    const { error } = await supabase
        .from('assessments')
        .update({ ai_report: aiReport })
        .eq('id', id);

    if (error) {
        console.error('Error updating AI report:', error);
        throw error;
    }
};

export const getAssessment = async (id: string) => {
    const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching assessment:', error);
        return null;
    }

    // Map back from DB snake_case to frontend camelCase if needed,
    // but simpler to just return data and handle mapping or just use snake_case in new types.
    // For now, let's assume we map it back to ResultData structure.

    const result: ResultData = {
        id: data.id,
        date: data.created_at,
        name: data.name,
        email: data.email,
        overallScore: data.overall_score,
        classification: data.classification,
        blockScores: data.block_scores,
        ipa: data.ipa,
        ircc: data.ircc,
        iise: data.iise,
        axisX: data.axis_x,
        axisY: data.axis_y,
        aiReport: data.ai_report
    };

    return result;
};

export const getAllAssessments = async () => {
    const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching assessments:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        date: item.created_at,
        name: item.name,
        email: item.email,
        overallScore: item.overall_score,
        classification: item.classification,
        blockScores: item.block_scores,
        ipa: item.ipa,
        ircc: item.ircc,
        iise: item.iise,
        axisX: item.axis_x,
        axisY: item.axis_y,
        aiReport: item.ai_report
    })) as ResultData[];
};

export const deleteAssessment = async (id: string) => {
    const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting assessment:', error);
        throw error;
    }
};
