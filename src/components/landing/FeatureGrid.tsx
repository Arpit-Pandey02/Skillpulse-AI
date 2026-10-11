import React from 'react';
import {
  Layers,
  Sparkles,
  BarChart3,
  Compass,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { Card } from '../ui/Card';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: 'Multidisciplinary Skill Taxonomy',
      description:
        'Track competencies across Frontend, Backend APIs, Core Algorithms, Cloud & DevOps, and Applied AI in one unified hierarchy.',
    },
    {
      icon: Sparkles,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      title: 'AI Diagnostic Guidance',
      description:
        'Identify specific skill bottlenecks before technical interviews. Get dynamic suggestions for high-yield algorithmic practice.',
    },
    {
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      title: 'Deep Learning Analytics',
      description:
        'Visualize your daily study cadence, target vs actual study hours, and competency balance with high-performance charts.',
    },
    {
      icon: Compass,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      title: 'Step-by-Step Roadmaps',
      description:
        'Clear, structured milestone tracks bridging freshman CS fundamentals all the way to production full-stack AI engineering.',
    },
    {
      icon: CheckCircle2,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      title: 'Sprint Goal Accountability',
      description:
        'Break broad aspirations into weekly digestible learning sprints with interactive checklists and real-time status toggles.',
    },
    {
      icon: Cpu,
      color: 'text-pink-600 bg-pink-50 border-pink-100',
      title: 'Future-Ready Architecture',
      description:
        'Engineered with modern TypeScript contracts ready for seamless integration with Node.js, MongoDB, and LLM APIs in future phases.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 sm:text-4xl">
            Everything You Need to Track Engineering Growth
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Built by engineers for engineering students. No vague progress bars—only verifiable, project-backed metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                hoverable
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${feature.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
