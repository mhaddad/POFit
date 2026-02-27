
export interface Question {
  id: number;
  text: string;
  block: string; // B1 to B12
  type: 'positive' | 'negative';
}

export interface AssessmentState {
  answers: Record<number, number>;
  step: number;
  userInfo?: {
    name: string;
    email: string;
  };
}

export interface BlockScores {
  [key: string]: number;
}

export interface ResultData {
  id: string;
  date: string;
  name: string;
  email: string;
  overallScore: number;
  classification: string;
  blockScores: BlockScores;
  ipa: number;
  ircc: number;
  iise: number;
  axisX: number; // Management
  axisY: number; // Work Dynamics
  aiReport?: string;
  subQuadrant?: string;
  riskPersonas?: string[];
  designFlags?: string[];
}
