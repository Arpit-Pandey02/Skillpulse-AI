import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { SkillCategorySummary } from '../../types/skill';
import { Sparkles } from 'lucide-react';

export interface SkillDistributionChartProps {
  categories: SkillCategorySummary[];
}

interface CustomRadarTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomRadarTooltip: React.FC<CustomRadarTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg border border-slate-800">
        <p className="font-semibold text-slate-200">{data.category}</p>
        <p className="text-indigo-300">
          Mastery: <span className="font-bold text-white">{data.averageMastery}%</span>
        </p>
        <p className="text-slate-400 text-[11px]">
          Tracked Modules: {data.skillCount}
        </p>
      </div>
    );
  }
  return null;
};

export const SkillDistributionChart: React.FC<SkillDistributionChartProps> = ({
  categories,
}) => {
  // Format data for radar
  const radarData = categories.map((cat) => ({
    category: cat.category.replace(' & Machine Learning', '').replace(' Core', ''),
    averageMastery: cat.averageMastery,
    fullCategory: cat.category,
    skillCount: cat.skillCount,
  }));

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-1">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          Competency Radar
        </CardTitle>
        <CardDescription>
          Mastery balance across engineering domains
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Radar
                name="Mastery"
                dataKey="averageMastery"
                stroke="#7c3aed"
                fill="#8b5cf6"
                fillOpacity={0.45}
              />
              <Tooltip content={<CustomRadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories breakdown pills */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
          {categories.slice(0, 4).map((c) => (
            <div
              key={c.category}
              className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg"
            >
              <span className="text-slate-600 truncate mr-1 font-medium">
                {c.category.split(' ')[0]}
              </span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {c.averageMastery}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
