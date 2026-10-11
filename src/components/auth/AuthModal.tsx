import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, User, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('University of Washington');
  const [major, setMajor] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('Sophomore (Year 2)');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } else {
      const res = await register({
        name,
        email,
        password,
        university,
        major,
        academicYear,
      });
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleUseDemo = async () => {
    setEmail('alex.chen@university.edu');
    setPassword('student123');
    setIsSubmitting(true);
    setErrorMsg('');
    const res = await login('alex.chen@university.edu', 'student123');
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Demo login failed');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isLogin ? 'Sign In to SkillPulse AI' : 'Create Student Account'}
      description={
        isLogin
          ? 'Access your authenticated skills dashboard and persistent goals.'
          : 'Start tracking competencies with dedicated MongoDB user data isolation.'
      }
      maxWidth="md"
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g., Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g., alex.chen@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Major</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2">
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          {isLogin && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleUseDemo}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              className="w-full text-xs"
            >
              1-Click Demo Login (Alex Chen)
            </Button>
          )}
        </div>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          {isLogin ? (
            <p>
              New student?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  openAuthModal('register');
                }}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  openAuthModal('login');
                }}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};
