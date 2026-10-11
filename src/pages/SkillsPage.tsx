import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardNavbar } from '../components/layout/DashboardNavbar';
import type { DashboardViewState } from '../components/layout/DashboardNavbar';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { SkillProgressCard } from '../components/dashboard/SkillProgressCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import type { Skill, SkillCategory } from '../types/skill';
import { Layers, Plus, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { skillService } from '../services/skillService';

export const SkillsPage: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState<DashboardViewState>('normal');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'progress' | 'hours' | 'name'>('progress');

  const [skills, setSkills] = useState<Skill[]>([]);

  // Add Skill Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Frontend');
  const [newTargetHours, setNewTargetHours] = useState('40');
  const [newTags, setNewTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Practice Modal State
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [selectedSkillForPractice, setSelectedSkillForPractice] = useState<Skill | null>(null);
  const [sessionHours, setSessionHours] = useState('1.5');
  const [sessionNotes, setSessionNotes] = useState('');
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [isSavingPractice, setIsSavingPractice] = useState(false);

  // Fetch skills from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      const data = await skillService.getSkills();
      if (isMounted) {
        setSkills(Array.isArray(data) ? data : []);
      }
    };

    fetchSkills();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenPractice = (skill: Skill) => {
    setSelectedSkillForPractice(skill);
    setIsPracticeModalOpen(true);
    setPracticeSuccess(false);
  };

  const handleSavePractice = async (e: React.FormEvent) => {
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

    const res = await skillService.logPractice(
      selectedSkillForPractice.id,
      hours,
      sessionNotes.trim() || undefined
    );

    if (res.success && res.skill) {
      setSkills((prev) =>
        prev.map((s) => (s.id === res.skill!.id ? res.skill! : s))
      );
    }

    setIsSavingPractice(false);
    setPracticeSuccess(true);
    setTimeout(() => {
      setIsPracticeModalOpen(false);
      setPracticeSuccess(false);
      setSessionNotes('');
    }, 1200);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsSubmitting(true);
    const newSkillData: Partial<Skill> = {
      name: newSkillName.trim(),
      category: newCategory,
      level: 'Beginner',
      progressPercent: 0,
      hoursSpent: 0,
      targetHours: parseInt(newTargetHours) || 40,
      tags: newTags ? newTags.split(',').map((t) => t.trim()) : ['Foundations'],
      color: '#6366F1',
    };

    const res = await skillService.createSkill(newSkillData);
    if (res.success && res.data) {
      setSkills([res.data, ...skills]);
    } else {
      const fallbackSkill: Skill = {
        id: `skill_${Date.now()}`,
        name: newSkillName.trim(),
        category: newCategory,
        level: 'Beginner',
        progressPercent: 0,
        hoursSpent: 0,
        targetHours: parseInt(newTargetHours) || 40,
        lastPracticed: 'Just added',
        verifiedProjectsCount: 0,
        tags: newTags ? newTags.split(',').map((t) => t.trim()) : ['Foundations'],
        color: '#6366F1',
      };
      setSkills([fallbackSkill, ...skills]);
    }

    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setNewSkillName('');
    setNewTags('');
  };

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Computer Science Core',
    'AI & Machine Learning',
    'Cloud & DevOps',
  ];

  const filteredSkills = skills
    .filter((skill) => {
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return b.progressPercent - a.progressPercent;
      if (sortBy === 'hours') return b.hoursSpent - a.hoursSpent;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          viewState={viewState}
          onViewStateChange={setViewState}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-indigo-600" />
                Skills Explorer & Competency Library
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Explore all tracked competencies, filter by specialization, and add custom study targets.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Skill
            </Button>
          </div>

          {/* Filters & Sorting Bar */}
          <Card className="p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="progress">Highest Mastery</option>
                  <option value="hours">Most Hours Spent</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Skills Grid */}
          {skills.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">No skills tracked yet</h3>
              <p className="text-xs text-slate-500 mb-4">
                Start tracking your competencies by adding your first curriculum topic or framework.
              </p>
              <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add First Skill
              </Button>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              No skills match "{searchQuery}" under "{selectedCategory}".
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
        </main>
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track a New Skill Competency"
        description="Add a curriculum topic or framework to your personal tracking board."
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., GraphQL API Design"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Computer Science Core">Computer Science Core (DSA)</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Database">Database</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Study Hours
            </label>
            <input
              type="number"
              min="10"
              max="200"
              value={newTargetHours}
              onChange={(e) => setNewTargetHours(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtopics / Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Schema, Resolvers, Apollo Client"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Log Practice Session Modal */}
      <Modal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        title="Log Study & Practice Session"
        description="Record your deliberate practice hours to increment skill mastery."
      >
        {practiceSuccess ? (
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
          <form onSubmit={handleSavePractice} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selected Skill
              </label>
              <div className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium">
                {selectedSkillForPractice?.name} ({selectedSkillForPractice?.category})
              </div>
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
                onClick={() => setIsPracticeModalOpen(false)}
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
