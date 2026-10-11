import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import type { WeeklyGoal } from '../../types/activity';
import { CheckCircle2, Circle, Target, Plus, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { goalService } from '../../services/goalService';

export interface WeeklyGoalsCardProps {
  initialGoals?: WeeklyGoal[];
  onGoalUpdated?: () => void;
}

export const WeeklyGoalsCard: React.FC<WeeklyGoalsCardProps> = ({
  initialGoals,
  onGoalUpdated,
}) => {
  const [goals, setGoals] = useState<WeeklyGoal[]>(initialGoals || []);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch persisted goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true);
      const data = await goalService.getGoals();
      setGoals(data);
      setIsLoading(false);
    };

    fetchGoals();
  }, []);

  const toggleGoal = async (id: string) => {
    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );

    // Persist to backend API
    await goalService.toggleGoal(id);
    if (onGoalUpdated) onGoalUpdated();
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await goalService.createGoal({
      title: newTitle.trim(),
      category: newCategory,
      dueDate: 'This Week',
      priority: 'Medium',
      hoursEstimate: 2,
    });

    if (res.success && res.data) {
      setGoals([res.data, ...goals]);
    } else {
      // Fallback local addition if offline
      const fallbackGoal: WeeklyGoal = {
        id: `goal_${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        dueDate: 'This Week',
        completed: false,
        priority: 'Medium',
        hoursEstimate: 2,
      };
      setGoals([fallbackGoal, ...goals]);
    }

    setNewTitle('');
    setIsAdding(false);
    if (onGoalUpdated) onGoalUpdated();
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedCount / (goals.length || 1)) * 100);

  const filteredGoals = goals.filter((g) => {
    if (filter === 'pending') return !g.completed;
    if (filter === 'completed') return g.completed;
    return true;
  });

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Weekly Goals Checklist
          </CardTitle>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {completedCount}/{goals.length} Completed ({progressPercent}%)
          </span>
        </div>
        <CardDescription>
          Keep your weekly study sprint on pace. Changes persist across browser refreshes.
        </CardDescription>

        {/* Filters and Add Goal Toggle */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all',
                filter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all',
                filter === 'pending'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all',
                filter === 'completed'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              Done
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdding ? 'Cancel' : 'New Goal'}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quick Add Form */}
        {isAdding && (
          <form
            onSubmit={handleAddGoal}
            className="mb-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 animate-in fade-in duration-150"
          >
            <input
              type="text"
              placeholder="What do you plan to achieve this week?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="text-xs p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Computer Science Core">CS Core (DSA)</option>
                <option value="AI & Machine Learning">AI & ML</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
              </select>
              <Button size="sm" variant="primary" type="submit">
                Save Goal
              </Button>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {isLoading && goals.length === 0 ? (
            <div className="py-6 flex justify-center text-indigo-600">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : filteredGoals.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No goals found in this view.
            </p>
          ) : (
            filteredGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 group',
                  goal.completed
                    ? 'bg-slate-50/70 border-slate-200/70 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                )}
                role="checkbox"
                aria-checked={goal.completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleGoal(goal.id);
                  }
                }}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0"
                  aria-label={goal.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-xs font-medium leading-snug',
                      goal.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-800'
                    )}
                  >
                    {goal.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">
                      Due: {goal.dueDate}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {goal.category}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-semibold px-1 rounded',
                        goal.priority === 'High'
                          ? 'bg-rose-50 text-rose-600'
                          : goal.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-50 text-slate-500'
                      )}
                    >
                      {goal.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
