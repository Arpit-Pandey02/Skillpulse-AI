import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navItems = [
    {
      label: 'Overview',
      to: '/dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      label: 'Career Discovery',
      to: '/discovery',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      label: 'Skills Explorer',
      to: '/skills',
      icon: Layers,
      badge: '12',
    },
    {
      label: 'Learning Roadmap',
      to: '/roadmap',
      icon: Compass,
      badge: 'Active',
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-white border-r border-slate-200/90 h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2.5 overflow-hidden transition-all',
            isCollapsed && 'justify-center w-full'
          )}
          title="SkillPulse Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                SkillPulse <span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                Student Edition
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          {!isCollapsed ? (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                  isCollapsed && 'justify-center px-0'
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                        isActive
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Floating tooltip on collapsed view */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Quick Back to Landing link */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors group',
              isCollapsed && 'justify-center px-0'
            )}
            title={isCollapsed ? 'Landing Page' : undefined}
          >
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
            {!isCollapsed && <span>View Landing Page</span>}
          </Link>
        </div>
      </div>

      {/* AI Readiness Card (Only shown when expanded) */}
      {!isCollapsed && (
        <div className="p-3 m-3 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 rounded-2xl border border-indigo-100/80 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-indigo-800 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Skills Diagnostic</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
            {user?.targetRole ? (
              <>
                Targeting <strong className="text-indigo-700">{user.targetRole}</strong>. Deliberate practice is tracked across your competencies.
              </>
            ) : (
              'Discover career pathways, track deliberate practice hours, and get AI guidance.'
            )}
          </p>
          <div className="flex items-center justify-between text-[10px] text-indigo-700 font-medium">
            <span>{user ? `Streak: ${user.streakDays || 0} Days 🔥` : 'Career Discovery Active'}</span>
          </div>
        </div>
      )}

      {/* Student Profile Footer & Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Guest Student'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.name || 'Guest Student'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.academicYear || user?.major || (isAuthenticated ? 'Student' : 'Explore Mode')}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Guest Student'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
            />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={cn(
            'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors',
            isCollapsed && 'hidden'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Floating expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto mb-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
};
