import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, LayoutDashboard, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, openAuthModal } = useAuth();

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Curriculum Roadmap', href: '#roadmap' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                SkillPulse <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                Student Competency Engine
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              Live Dashboard
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-slate-700"
                  leftIcon={<UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  {user.name.split(' ')[0]}
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="text-slate-700"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </Button>
            )}
            <Link to="/dashboard">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 flex items-center gap-2 font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              Live Student Dashboard
            </Link>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                Sign In
              </Button>
            )}
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
