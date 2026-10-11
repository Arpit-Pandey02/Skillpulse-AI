import mongoose, { Schema, Document } from 'mongoose';

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'AI & Machine Learning'
  | 'Computer Science Core'
  | 'Cloud & DevOps'
  | 'Database';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  progressPercent: number;
  hoursSpent: number;
  targetHours: number;
  lastPracticed: string;
  verifiedProjectsCount: number;
  tags: string[];
  color: string;
  badgeText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Frontend',
        'Backend',
        'AI & Machine Learning',
        'Computer Science Core',
        'Cloud & DevOps',
        'Database',
      ],
    },
    level: {
      type: String,
      default: 'Intermediate',
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    hoursSpent: { type: Number, default: 0, min: 0 },
    targetHours: { type: Number, default: 40, min: 1 },
    lastPracticed: { type: String, default: 'Recently' },
    verifiedProjectsCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    color: { type: String, default: '#6366F1' },
    badgeText: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
