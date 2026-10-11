import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardNavbar } from '../components/layout/DashboardNavbar';
import type { DashboardViewState } from '../components/layout/DashboardNavbar';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatCard } from '../components/dashboard/StatCard';
import { LearningActivityChart } from '../components/dashboard/LearningActivityChart';
import { SkillDistributionChart } from '../components/dashboard/SkillDistributionChart';
import { SkillProgressCard } from '../components/dashboard/SkillProgressCard';
import { WeeklyGoalsCard } from '../components/dashboard/WeeklyGoalsCard';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { RoadmapPreview } from '../components/dashboard/RoadmapPreview';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/ui/StateFeedback';
import {
  MOCK_CATEGORY_SUMMARIES,
  MOCK_DAILY_STUDY_RECORDS,
  MOCK_ROADMAP_STEPS,
} from '../data/mockData';
import type { Skill } from '../types/skill';
import type { RecentActivity } from '../types/activity';
import type { MetricStat } from '../types/student';
import { useAuth } from '../context/AuthContext';
import { skillService } from '../services/skillService';
import { activityService } from '../services/activityService';
import { Layers, CheckCircle, Sparkles } from 'lucide-react';
import type { StudentProfile } from '../types/student';

const GUEST_STUDENT_PROFILE: StudentProfile = {
  id: 'guest',
  name: 'Student',
  handle: '@guest_student',
  email: 'student@university.edu',
  university: 'SkillPulse University',
  major: 'Career Discovery',
  academicYear: 'Undergraduate',
  bio: 'Exploring career paths and skills competencies.',
  targetRole: 'Career Exploration',
  streakDays: 0,
  totalHoursLearned: 0,
  overallMasteryPercent: 0,
  completedGoalsCount: 0,
  joinedDate: 'Joined recently',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Sidebar and mobile menu states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Global search & UI view state simulator
  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState<DashboardViewState>('normal');

  // Selected skill category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Skills and activities state (synced with real backend API)
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  // Practice session logging modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedSkillForPractice, setSelectedSkillForPractice] = useState<Skill | null>(null);
  const [sessionHours, setSessionHours] = useState('1.5');
  const [sessionNotes, setSessionNotes] = useState('');
  const [logSuccessMessage, setLogSuccessMessage] = useState(false);
  const [isSavingPractice, setIsSavingPractice] = useState(false);

  // Fetch user-specific skills and activities from backend
  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        const [loadedSkills, loadedActivities] = await Promise.all([
          skillService.getSkills(),
          activityService.getActivities(),
        ]);
        if (isMounted) {
          setSkills(Array.isArray(loadedSkills) ? loadedSkills : []);
          setActivities(Array.isArray(loadedActivities) ? loadedActivities : []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle Practice button click
  const handleOpenPractice = (skill?: Skill) => {
    setSelectedSkillForPractice(skill || skills[0] || null);
    setIsLogModalOpen(true);
    setLogSuccessMessage(false);
  };

  // Submit practice session and persist to backend
  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillForPractice) return;

    const hours = parseFloat(sessionHours) || 1;
    setIsSavingPractice(true);

    // Optimistic UI update
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === selectedSkillForPractice.id) {
          const newHours = s.hoursSpent + hours;
          const newPercent = Math.min(Math.round((newHours / s.targetHours) * 100), 100);
          return {
            ...s,
            hoursSpent: newHours,
            progressPercent: newPercent,
            lastPracticed: 'Just now',
          };
        }
        return s;
      })
    );

    // Persist to backend
    const res = await skillService.logPractice(
      selectedSkillForPractice.id,
      hours,
      sessionNotes.trim() || undefined
    );

    if (res.success) {
      if (res.skill) {
        setSkills((prev) =>
          prev.map((s) => (s.id === res.skill!.id ? res.skill! : s))
        );
      }
      if (res.activity) {
        setActivities((prev) => [res.activity!, ...prev]);
      }
    }

    setIsSavingPractice(false);
    setLogSuccessMessage(true);
    setTimeout(() => {
      setIsLogModalOpen(false);
      setLogSuccessMessage(false);
      setSessionNotes('');
    }, 1200);
  };

  // Dynamically compute key metrics from persisted skills & user profile
  const totalPracticeHours = skills.reduce((sum, s) => sum + s.hoursSpent, 0);
  const avgMastery = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.progressPercent, 0) / skills.length)
    : 0;

  const keyMetrics: MetricStat[] = [
    {
      id: 'metric_skills',
      title: 'Tracked Skills',
      value: skills.length,
      changePercent: 16.5,
      changePeriod: 'active competencies',
      trend: 'up',
      icon: 'Layers',
    },
    {
      id: 'metric_weekly_hours',
      title: 'Total Study Hours',
      value: `${totalPracticeHours.toFixed(1)} hrs`,
      changePercent: 12.0,
      changePeriod: 'verified deliberate practice',
      trend: 'up',
      icon: 'Clock',
    },
    {
      id: 'metric_streak',
      title: 'Active Daily Streak',
      value: `${user?.streakDays || 0} Days`,
      changePercent: 100,
      changePeriod: 'streak count',
      trend: 'up',
      icon: 'Flame',
    },
    {
      id: 'metric_mastery',
      title: 'Overall Readiness',
      value: `${avgMastery}%`,
      changePercent: 4.8,
      changePeriod: 'across curriculum',
      trend: 'up',
      icon: 'Sparkles',
    },
  ];

  // Filter skills based on Category pill and Search query
  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Computer Science Core',
    'AI & Machine Learning',
    'Cloud & DevOps',
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Collapsible Desktop Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Responsive Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <DashboardNavbar
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          viewState={viewState}
          onViewStateChange={setViewState}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* 1. SKELETON LOADING STATE SIMULATION */}
          {viewState === 'loading' && <DashboardSkeleton />}

          {/* 2. ERROR STATE SIMULATION */}
          {viewState === 'error' && (
            <ErrorState
              title="Unable to sync student skill records"
              message="The skills engine encountered a simulated connection timeout. Click below to reload normal data."
              onRetry={() => setViewState('normal')}
            />
          )}

          {/* 3. EMPTY STATE SIMULATION */}
          {viewState === 'empty' && (
            <EmptyState
              title="No skills or activities tracked yet"
              description="Welcome to your new skill profile! Start by picking your university focus area and logging your first coding practice."
              actionText="Load Sample Curriculum"
              onAction={() => setViewState('normal')}
            />
          )}

          {/* 4. NORMAL COMPLETE DASHBOARD VIEW */}
          {viewState === 'normal' && (
            <>
              {/* Student Welcome Banner */}
              <WelcomeBanner
                student={user || GUEST_STUDENT_PROFILE}
                onOpenLogModal={() => handleOpenPractice()}
              />

              {/* Adaptive Career Discovery Banner */}
              {user?.careerStatus !== 'decided' && (
                <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-violet-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/30 text-violet-200 border border-violet-400/30">
                        {user?.careerStatus === 'comparing' ? 'Comparison Mode Active' : 'Career Discovery Mode'}
                      </span>
                      <span className="text-xs text-violet-200">
                        Explore verified paths across all domains
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {user?.careerStatus === 'comparing'
                        ? 'Compare and finalize your career choice'
                        : 'Not sure which career to pursue? AI Discovery is ready'}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Complete our skippable 5-step questionnaire or browse salary, growth, and project evidence across healthcare, business, technology, policy, and engineering.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/onboarding">
                      <Button variant="secondary" size="sm" className="bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold">
                        {user?.careerStatus === 'comparing' ? 'Adjust Choices' : 'Launch Questionnaire'}
                      </Button>
                    </Link>
                    <Link to="/discovery">
                      <Button variant="primary" size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold border-0">
                        Open Discovery Hub <Sparkles className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Four Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {keyMetrics.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {/* Main Visualizations: Learning Activity Bar Chart + Skill Radar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LearningActivityChart data={MOCK_DAILY_STUDY_RECORDS} />
                </div>
                <div>
                  <SkillDistributionChart categories={MOCK_CATEGORY_SUMMARIES} />
                </div>
              </div>

              {/* Active Skills Section with Category Filters */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-600" />
                      Active Skill Competencies
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mastery metrics based on verified project checkpoints & problem sets
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Grid */}
                {skills.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700 text-sm mb-1">No skills tracked yet</p>
                    <p className="mb-3">Start by logging deliberate practice hours or tracking a competency in your profile.</p>
                    <Link to="/skills">
                      <Button size="sm" variant="primary">
                        Add First Skill
                      </Button>
                    </Link>
                  </div>
                ) : filteredSkills.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                    No skills matched "{searchQuery}" under the "{selectedCategory}" category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSkills.map((skill) => (
                      <SkillProgressCard
                        key={skill.id}
                        skill={skill}
                        onPracticeClick={handleOpenPractice}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Two Column Grid: Interactive Goals Checklist & Recent Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyGoalsCard />
                <RecentActivityFeed activities={activities} />
              </div>

              {/* Full-width Learning Roadmap Track Preview */}
              <RoadmapPreview steps={MOCK_ROADMAP_STEPS} />
            </>
          )}
        </main>
      </div>

      {/* Log Practice Session Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Study & Practice Session"
        description="Record your deliberate practice hours to increment skill mastery."
      >
        {logSuccessMessage ? (
          <div className="py-6 text-center space-y-2 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Practice Logged!</h4>
            <p className="text-xs text-slate-500">
              Your skill hours and mastery percentage have updated immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitSession} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Skill
              </label>
              <select
                value={selectedSkillForPractice?.id}
                onChange={(e) => {
                  const target = skills.find((s) => s.id === e.target.value);
                  if (target) setSelectedSkillForPractice(target);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Session Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={sessionHours}
                onChange={(e) => setSessionHours(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What did you build or practice? (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Implemented invertBinaryTree with recursive DFS in TypeScript"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsLogModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSavingPractice}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {isSavingPractice ? 'Saving...' : 'Save Practice Session'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
