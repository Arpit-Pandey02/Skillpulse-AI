import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import type { Skill } from '../../types/skill';
import { Clock, FolderGit2, ArrowRight } from 'lucide-react';

export interface SkillProgressCardProps {
  skill: Skill;
  onPracticeClick?: (skill: Skill) => void;
}

export const SkillProgressCard: React.FC<SkillProgressCardProps> = ({
  skill,
  onPracticeClick,
}) => {
  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'Frontend':
        return 'indigo';
      case 'Backend':
        return 'amber';
      case 'AI & Machine Learning':
        return 'emerald';
      case 'Computer Science Core':
        return 'blue';
      case 'Cloud & DevOps':
        return 'violet';
      default:
        return 'slate';
    }
  };

  return (
    <Card hoverable className="p-5 flex flex-col justify-between h-full">
      <div>
        {/* Top Meta: Category & Level */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={getCategoryBadgeVariant(skill.category)}
            size="sm"
            hasDot
          >
            {skill.category}
          </Badge>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {skill.level}
          </span>
        </div>

        {/* Skill Title & Optional highlight badge */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 text-sm tracking-tight truncate">
              {skill.name}
            </h4>
            {skill.badgeText && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-sm font-semibold shrink-0 ml-2">
                {skill.badgeText}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Last practiced: {skill.lastPracticed}
          </p>
        </div>

        {/* Progress Bar with mastery score */}
        <div className="my-4">
          <ProgressBar
            value={skill.progressPercent}
            color={skill.color}
            size="md"
            label="Mastery Progress"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom stats & action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-700">{skill.hoursSpent}h</strong> / {skill.targetHours}h
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-700">{skill.verifiedProjectsCount}</strong> projects
          </span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-1.5 h-auto"
          onClick={() => onPracticeClick && onPracticeClick(skill)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Practice
        </Button>
      </div>
    </Card>
  );
};
