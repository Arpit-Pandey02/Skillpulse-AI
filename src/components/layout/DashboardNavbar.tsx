import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Clock,
  ChevronDown,
  LogOut,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type DashboardViewState = 'normal' | 'loading' | 'empty' | 'error';

export interface DashboardNavbarProps {
  onOpenMobileMenu: () => void;
  viewState: DashboardViewState;
  onViewStateChange: (state: DashboardViewState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onOpenMobileMenu,
  viewState,
  onViewStateChange,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const currentStudent = user || {
    name: 'Guest Student',
    email: 'Sign in to save progress',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    academicYear: 'Guest Mode',
    targetRole: 'Career Exploration',
  };

  const notifications = [
    {
      id: 'notif_1',
      title: 'Backend persistence active via Express REST API',
      time: 'Just now',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'AI recommended 2 new Tree problems for DSA',
      time: '4 hours ago',
      read: false,
    },
    {
      id: 'notif_3',
      title: 'Roadmap Milestone unlocked: React Components',
      time: '1 day ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/90 h-16 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search skills, topics, roadmaps..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <div className="hidden sm:flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-400 font-mono">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: State Simulator, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive UI State Tester */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs border border-slate-200/80">
          <span className="text-[10px] font-semibold text-slate-500 px-2 uppercase tracking-wider">
            UI State:
          </span>
          <button
            onClick={() => onViewStateChange('normal')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewState === 'normal'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => onViewStateChange('loading')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewState === 'loading'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Loading
          </button>
          <button
            onClick={() => onViewStateChange('empty')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewState === 'empty'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Empty
          </button>
          <button
            onClick={() => onViewStateChange('error')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              viewState === 'error'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Error
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 mt-1 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <p className="text-xs font-medium text-slate-800">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu with Real Auth Controls */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            aria-label="User account menu"
            aria-expanded={showProfileMenu}
          >
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="hidden sm:block text-left pr-1">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {currentStudent.name}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {currentStudent.academicYear}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 pb-2 border-b border-slate-100 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900">{currentStudent.name}</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {isAuthenticated ? 'Live Account' : 'Guest Mode'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{currentStudent.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {currentStudent.targetRole}
                </span>
              </div>
              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    openAuthModal('login');
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  Sign In / Switch Student
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    openAuthModal('register');
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                  Create New Student Account
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
