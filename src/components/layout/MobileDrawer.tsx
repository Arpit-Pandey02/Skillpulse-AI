import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  Sparkles,
  LayoutDashboard,
  Layers,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Career Discovery', to: '/discovery', icon: Sparkles },
    { label: 'Skills Explorer', to: '/skills', icon: Layers },
    { label: 'Learning Roadmap', to: '/roadmap', icon: Compass },
  ];

  return (
    <div
      className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      <div className="w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              SkillPulse <span className="text-indigo-600">AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="p-4 mx-4 mt-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'Guest Student'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {user?.name || 'Guest Student'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.university || user?.academicYear || 'Explore Skills & Careers'}
            </p>
            <span className="inline-block text-[10px] text-indigo-600 font-medium">
              {user ? `Streak: ${user.streakDays || 0} Days 🔥` : 'Guest Mode'}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Visit Landing Page</span>
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          Phase 1: Premium UI Foundation
        </div>
      </div>
    </div>
  );
};
