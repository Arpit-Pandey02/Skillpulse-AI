import React from 'react';
import { Target, CheckSquare, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Target,
      title: 'Target Your Dream Engineering Role',
      description:
        'Select your college semester and desired tech role—such as Full-Stack AI Engineer, Backend Systems Developer, or Cloud Architect.',
    },
    {
      step: '02',
      icon: CheckSquare,
      title: 'Execute Weekly Learning Sprints',
      description:
        'Log code practice, track study hours against 3-hour daily targets, and check off milestone challenges in your weekly queue.',
    },
    {
      step: '03',
      icon: Sparkles,
      title: 'Unlock Verifiable Mastery & AI Advice',
      description:
        'Watch your Competency Radar climb. Receive intelligent recommendations on which algorithms or frameworks need reinforcement.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Systematic Learning Framework
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 sm:text-4xl">
            How SkillPulse AI Accelerates Your Career
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            From basic coursework to internship offers: three structured steps to consistent technical mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-100">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
