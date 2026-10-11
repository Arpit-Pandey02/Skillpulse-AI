import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardNavbar } from '../components/layout/DashboardNavbar';
import type { DashboardViewState } from '../components/layout/DashboardNavbar';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { MOCK_ROADMAP_STEPS, MOCK_STUDENT_PROFILE } from '../data/mockData';
import {
  Compass,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { cn } from '../utils/cn';

import { useAuth } from '../context/AuthContext';

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState<DashboardViewState>('normal');

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          viewState={viewState}
          onViewStateChange={setViewState}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Compass className="w-6 h-6 text-indigo-600" />
                  Engineering Curriculum Roadmap
                </h1>
                <Badge variant="indigo" size="sm">
                  Target: {user?.targetRole || MOCK_STUDENT_PROFILE.targetRole}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your personalized collegiate pathway to becoming a production-grade full-stack software engineer.
              </p>
            </div>
          </div>

          {/* AI Advisor Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  AI Pathway Diagnostic Insight
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Based on your current pace, you are on track to complete Phase 2 (Modern Web Engineering) 2 weeks ahead of your semester final exam.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shrink-0 shadow-2xs">
              Overall Track: 48% Complete
            </span>
          </div>

          {/* Roadmap Steps Vertical Timeline */}
          <div className="space-y-4">
            {MOCK_ROADMAP_STEPS.map((step) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in-progress';
              const isUpcoming = step.status === 'upcoming';

              return (
                <Card
                  key={step.id}
                  className={cn(
                    'p-6 transition-all',
                    isInProgress && 'ring-2 ring-indigo-500/20 border-indigo-300 shadow-sm'
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                          Phase 0{step.stepNumber} • {step.phase}
                        </span>
                        {isCompleted && (
                          <Badge variant="emerald" size="sm" hasDot>
                            Completed
                          </Badge>
                        )}
                        {isInProgress && (
                          <Badge variant="indigo" size="sm" hasDot>
                            In Progress (Current Focus)
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="slate" size="sm">
                            Upcoming
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Skills Covered in this Phase */}
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">
                          Key Topics:
                        </span>
                        {step.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress indicator & Duration */}
                    <div className="lg:w-64 shrink-0 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Est. {step.estimatedWeeks} Weeks
                        </span>
                        <span className="font-bold text-slate-800">
                          {step.progressPercent}%
                        </span>
                      </div>
                      <ProgressBar
                        value={step.progressPercent}
                        color={
                          isCompleted
                            ? 'bg-emerald-600'
                            : isInProgress
                            ? 'bg-indigo-600'
                            : 'bg-slate-300'
                        }
                        size="md"
                        showPercent={false}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
