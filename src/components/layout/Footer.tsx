import React from 'react';
import { Sparkles, Code2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                SkillPulse <span className="text-indigo-600">AI</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Intelligent skills tracking, verifiable mastery metrics, and adaptive learning roadmap generation for computer science students.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Platform
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-indigo-600 transition-colors">
                  Skills Explorer
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-indigo-600 transition-colors">
                  Learning Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture / Senior Dev Insights */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Engineering Stack
            </h5>
            <ul className="space-y-2 text-slate-500">
              <li>React 19 & TypeScript</li>
              <li>Tailwind CSS Design Tokens</li>
              <li>Recharts Visualizations</li>
              <li>Future Phase: Node.js & MongoDB</li>
            </ul>
          </div>

          {/* Social / About */}
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Student Project
            </h5>
            <p className="text-slate-500 text-xs leading-relaxed">
              Crafted as a production-quality learning platform. Built with modular, senior-developer approved patterns.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">
                <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                Phase 1 • UI Foundation
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} SkillPulse AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Built for college engineering excellence
          </p>
        </div>
      </div>
    </footer>
  );
};
