
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
  const blockNames: Record<string, string> = {
    B1: "Autoridade",
    B2: "Papéis",
    B3: "Amabilidade",
    B4: "Disciplina",
    B5: "Transparência",
    B6: "Ambiguidade",
    B7: "Estabilidade",
    B8: "Consenso",
    B9: "Coordenação",
    B10: "Iniciativa"
  };

  const data = Object.keys(scores).map(key => ({
    subject: key,
    name: blockNames[key] || key,
    code: key,
    score: scores[key],
    A: scores[key],
    fullMark: 5,
  }));

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
            />
            <Radar
              name="Pontuação"
              dataKey="A"
              stroke="#008080"
              fill="#008080"
              fillOpacity={0.5}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Competência</th>
              <th className="px-4 py-3 text-right">Nota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.code} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-700">{item.code}</td>
                <td className="px-4 py-3 text-slate-600">{item.name}</td>
                <td className="px-4 py-3 text-right font-bold text-primary">{item.score.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
