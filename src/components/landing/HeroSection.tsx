import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/30 to-violet-200/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 mb-6 shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI-Powered Competency Engine for College Engineers</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Track, Master & Prove Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              Software Engineering Skills
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Stop guessing your job readiness. SkillPulse AI gives computer science students a verifiable skill tracking dashboard, AI-driven practice diagnostics, and personalized curriculum roadmaps.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-sm px-6 py-3 font-semibold shadow-md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Live Student Dashboard
              </Button>
            </Link>
            <Link to="/roadmap" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-sm px-6 py-3 font-semibold"
              >
                View Curriculum Roadmap
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tailored for 2nd & 3rd Year CS
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Zero Setup • Instant Interactive Preview
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Verifiable Mastery Metrics
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto relative">
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl p-4 sm:p-6 transition-all hover:border-indigo-300">
            {/* Fake browser bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  skillpulse.edu/dashboard/preview
                </span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Live Interactive Mock
              </span>
            </div>

            {/* Micro Dashboard Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Student Profile</span>
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <p className="text-sm font-bold text-slate-900">Alex Chen (Sophomore)</p>
                <p className="text-[11px] text-slate-500">Target: Full-Stack AI Engineer</p>
                <div className="mt-3 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded inline-block">
                  🔥 14-Day Study Streak Active
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Top Competency</span>
                  <Layers className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-900">React & Modern Frontend</p>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[82%]" />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">82% Mastery • 48 hrs logged</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">AI Diagnostic</span>
                  <Sparkles className="w-4 h-4 text-violet-600" />
                </div>
                <p className="text-xs font-semibold text-slate-900">Recommended Next Step:</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Practice Binary Search Trees to boost CS Core readiness to 80%.
                </p>
                <Link to="/dashboard" className="inline-block mt-2 text-[11px] font-bold text-indigo-600 hover:underline">
                  Launch full dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
