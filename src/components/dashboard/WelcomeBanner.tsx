import React from 'react';
import { Sparkles, Flame, PlusCircle, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import type { StudentProfile } from '../../types/student';

export interface WelcomeBannerProps {
  student: StudentProfile;
  onOpenLogModal: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  student,
  onOpenLogModal,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-8 shadow-sm">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Academic badge and streak indicator */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-indigo-100 border border-white/15">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              {student.university} • {student.academicYear}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {student.streakDays} Day Study Streak!
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {student.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            You're targeting <strong className="text-white underline decoration-indigo-400 underline-offset-2">{student.targetRole}</strong>. 
            Your skill mastery is pacing ahead of 78% of peer sophomore developers.
          </p>

          {/* AI Diagnostic Prompt Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-400/30 text-xs text-indigo-200">
            <Sparkles className="w-4 h-4 text-violet-300 shrink-0" />
            <span>
              <strong>AI Recommendation:</strong> Solve 2 medium Binary Search Tree problems to lock in your CS Core milestone.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={onOpenLogModal}
            size="md"
            className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-md font-semibold border-0"
            leftIcon={<PlusCircle className="w-4 h-4 text-indigo-600" />}
          >
            Log Practice Session
          </Button>
        </div>
      </div>
    </div>
  );
};
