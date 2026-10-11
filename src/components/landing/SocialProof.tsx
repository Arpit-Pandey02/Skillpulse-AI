import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '../ui/Card';

export const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: 'Maya Patel',
      role: 'Junior, Computer Engineering',
      university: 'UC Berkeley',
      quote:
        'Tracking my skills with structured metrics instead of arbitrary checklists gave me confidence during technical interviews. The competency radar is brilliant.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80',
    },
    {
      name: 'David Kim',
      role: 'Sophomore, Software Engineering',
      university: 'Georgia Tech',
      quote:
        'The weekly sprint checklist and daily study hour tracking kept me disciplined. Having AI point out gaps in my DSA knowledge saved me weeks of unfocused prep.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Senior, Computer Science',
      university: 'University of Illinois',
      quote:
        'Finally a developer platform designed specifically for college students transitioning into production web engineering. Clean, fast, and remarkably motivating.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128&q=80',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Student Endorsements
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 sm:text-4xl">
            Empowering Next-Generation Software Engineers
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            See how aspiring developers stay accountable, master algorithms, and prepare for internships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-50"
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {t.role} • {t.university}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
