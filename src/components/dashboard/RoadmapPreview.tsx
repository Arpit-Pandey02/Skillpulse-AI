import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import type { RoadmapStep } from '../../types/activity';
import { Compass, CheckCircle2, ArrowRight, Lock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface RoadmapPreviewProps {
  steps: RoadmapStep[];
}

export const RoadmapPreview: React.FC<RoadmapPreviewProps> = ({ steps }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            Curriculum Roadmap Track
          </CardTitle>
          <CardDescription>
            Step-by-step competency journey towards your Target Role
          </CardDescription>
        </div>
        <Link to="/roadmap">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-indigo-600 hover:text-indigo-700"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Full View
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in-progress';
            const isUpcoming = step.status === 'upcoming';

            return (
              <div
                key={step.id}
                className={cn(
                  'p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 relative overflow-hidden',
                  isCompleted && 'bg-slate-50/80 border-slate-200',
                  isInProgress && 'bg-indigo-50/40 border-indigo-200 ring-1 ring-indigo-300 shadow-xs',
                  isUpcoming && 'bg-white border-slate-200/80 opacity-75'
                )}
              >
                {/* Top Step Number & Status */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Phase 0{step.stepNumber}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    )}
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full border border-indigo-200">
                        <PlayCircle className="w-3 h-3 text-indigo-600 animate-pulse" />
                        In Progress
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" />
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {step.description}
                  </p>
                </div>

                {/* Progress & Skills */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {step.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] font-medium bg-white border border-slate-200/90 text-slate-600 px-1.5 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {step.skills.length > 2 && (
                      <span className="text-[9px] text-slate-400 py-0.5">
                        +{step.skills.length - 2}
                      </span>
                    )}
                  </div>

                  <ProgressBar
                    value={step.progressPercent}
                    size="sm"
                    color={isInProgress ? 'bg-indigo-600' : isCompleted ? 'bg-emerald-600' : 'bg-slate-300'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
