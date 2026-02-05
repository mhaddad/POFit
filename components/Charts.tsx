
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceArea
} from 'recharts';
import { BlockScores } from '../types';

interface CompetencyRadarProps {
  scores: BlockScores;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ scores }) => {
  const data = Object.keys(scores).map(key => ({
    subject: key,
    A: scores[key],
    fullMark: 5,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <Radar
            name="Pontuação"
            dataKey="A"
            stroke="#008080"
            fill="#008080"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface OrthogonalMatrixProps {
  x: number;
  y: number;
  userName: string;
}

export const OrthogonalMatrix: React.FC<OrthogonalMatrixProps> = ({ x, y, userName }) => {
  const data = [{ x, y, name: userName }];

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Gestão" 
            domain={[1, 5]} 
            ticks={[1, 3, 5]} 
            label={{ value: 'Gestão (Tradicional → Autogestão)', position: 'bottom', offset: 0, fontSize: 10 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Trabalho" 
            domain={[1, 5]} 
            ticks={[1, 3, 5]}
            label={{ value: 'Trabalho (Individual → Equipe)', angle: -90, position: 'left', offset: -10, fontSize: 10 }}
          />
          <ZAxis type="number" range={[100, 100]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Você" data={data} fill="#008080" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
