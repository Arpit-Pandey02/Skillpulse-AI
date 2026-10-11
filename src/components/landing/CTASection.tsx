import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for the Next Semester?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Start Tracking Your Software Engineering Skills Today
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Experience the live interactive student dashboard now. No credit card or account creation needed in Phase 1.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="primary"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg text-sm px-6 py-3"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Launch Live Dashboard Now
              </Button>
            </Link>
            <Link to="/skills">
              <Button
                size="lg"
                variant="secondary"
                className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 text-sm px-6 py-3"
              >
                Explore Skills Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
