import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { DailyStudyRecord } from '../../types/activity';
import { Clock } from 'lucide-react';

export interface LearningActivityChartProps {
  data: DailyStudyRecord[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItem: DailyStudyRecord = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
        <p className="font-semibold text-slate-200">
          {label} ({dataItem.fullDate})
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-slate-300">Actual Hours:</span>
          <span className="font-bold text-white tabular-nums">
            {dataItem.actualHours} hrs
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span className="text-slate-400">Daily Target:</span>
          <span className="text-slate-300 tabular-nums">{dataItem.targetHours} hrs</span>
        </div>
        <p className="text-[10px] text-indigo-300 pt-1 border-t border-slate-800">
          Focus: {dataItem.activeSkill}
        </p>
      </div>
    );
  }
  return null;
};

export const LearningActivityChart: React.FC<LearningActivityChartProps> = ({ data }) => {
  const totalWeeklyHours = data.reduce((acc, curr) => acc + curr.actualHours, 0);
  const avgDailyHours = (totalWeeklyHours / data.length).toFixed(1);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Weekly Learning Activity
          </CardTitle>
          <CardDescription>
            Daily study hours vs. academic target (Target: 3.0 hrs/day)
          </CardDescription>
        </div>

        {/* Quick stat pill */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Hours</span>
            <span className="text-sm font-bold text-slate-800 tabular-nums">
              {totalWeeklyHours} hrs
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Daily Average</span>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">
              {avgDailyHours} hrs/day
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Chart View */}
        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 12 }}
                domain={[0, 6]}
                unit="h"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={3}
                stroke="#cbd5e1"
                strokeDasharray="3 3"
                label={{
                  value: 'Target (3h)',
                  fill: '#94a3b8',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Bar
                dataKey="actualHours"
                name="Study Hours"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footnote / Legend */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
              Hours Completed
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-0.5 bg-slate-300 border-dashed" />
              Standard Target
            </span>
          </div>
          <span className="text-emerald-600 font-medium hidden sm:inline">
            +14% over baseline goal
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
