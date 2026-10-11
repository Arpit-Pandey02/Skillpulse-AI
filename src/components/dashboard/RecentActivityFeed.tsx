import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { RecentActivity } from '../../types/activity';
import {
  Code,
  Binary,
  CheckCircle,
  BookOpen,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'code_practice':
        return <Code className="w-4 h-4 text-indigo-600" />;
      case 'algorithm_solved':
        return <Binary className="w-4 h-4 text-blue-600" />;
      case 'project_milestone':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'ai_review':
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'code_practice':
        return 'bg-indigo-50 border-indigo-100';
      case 'algorithm_solved':
        return 'bg-blue-50 border-blue-100';
      case 'project_milestone':
        return 'bg-emerald-50 border-emerald-100';
      case 'reading':
        return 'bg-amber-50 border-amber-100';
      case 'ai_review':
        return 'bg-violet-50 border-violet-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          Recent Learning Stream
        </CardTitle>
        <CardDescription>
          Chronological record of completed practice sessions & algorithmic achievements
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {activities.map((activity) => (
            <div key={activity.id} className="relative group">
              {/* Dot / Icon */}
              <div
                className={cn(
                  'absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform',
                  getIconBg(activity.type)
                )}
              >
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity Info */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-xs transition-all">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h5 className="text-xs font-semibold text-slate-800 tracking-tight">
                    {activity.title}
                  </h5>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
                    +{activity.xpEarned} XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/60 text-[10px] text-slate-400">
                  <span className="font-medium text-slate-600">{activity.skillName}</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
