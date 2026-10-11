import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Clock,
  Flame,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../ui/Card';
import type { MetricStat } from '../../types/student';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  stat: MetricStat;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-violet-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getIconBackground = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return 'bg-indigo-50 border-indigo-100';
      case 'Clock':
        return 'bg-violet-50 border-violet-100';
      case 'Flame':
        return 'bg-amber-50 border-amber-100';
      case 'Sparkles':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <Card hoverable className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 tracking-tight">
            {stat.title}
          </p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            {stat.value}
          </p>
        </div>
        <div
          className={cn(
            'w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0',
            getIconBackground(stat.icon)
          )}
        >
          {getIcon(stat.icon)}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            'inline-flex items-center font-semibold text-[11px] gap-0.5',
            stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
          )}
        >
          {stat.trend === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {stat.changePercent > 0 ? `+${stat.changePercent}%` : `${stat.changePercent}%`}
        </span>
        <span className="text-slate-400 text-[11px] font-normal truncate">
          {stat.changePeriod}
        </span>
      </div>
    </Card>
  );
};
