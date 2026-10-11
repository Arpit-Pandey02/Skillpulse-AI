import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  university: string;
  major: string;
  academicYear: string;
  targetRole: string;
  careerStatus: 'decided' | 'comparing' | 'undecided';
  selectedCareerId?: string;
  customCareerRole?: string;
  onboardingCompleted: boolean;
  discoveryResponses?: Record<string, any>;
  savedCareerIds: string[];
  careerFeedback: Record<string, { status: string; notes?: string; updatedAt: Date }>;
  aiInsights?: any;
  modelUsed?: string;
  bio: string;
  streakDays: number;
  totalHoursLearned: number;
  overallMasteryPercent: number;
  completedGoalsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    avatarUrl: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    },
    university: { type: String, default: 'University of Washington' },
    major: { type: String, default: 'Computer Science & Software Engineering' },
    academicYear: { type: String, default: 'Sophomore (Year 2)' },
    targetRole: { type: String, default: 'Undecided / Exploring Careers' },
    careerStatus: {
      type: String,
      enum: ['decided', 'comparing', 'undecided'],
      default: 'undecided',
    },
    selectedCareerId: { type: String },
    customCareerRole: { type: String, trim: true },
    onboardingCompleted: { type: Boolean, default: false },
    discoveryResponses: { type: Schema.Types.Mixed, default: {} },
    savedCareerIds: [{ type: String }],
    careerFeedback: { type: Schema.Types.Mixed, default: {} },
    aiInsights: { type: Schema.Types.Mixed, default: null },
    modelUsed: { type: String, default: null },
    bio: {
      type: String,
      default:
        'Student exploring careers and building verified competencies.',
    },
    streakDays: { type: Number, default: 1 },
    totalHoursLearned: { type: Number, default: 0 },
    overallMasteryPercent: { type: Number, default: 0 },
    completedGoalsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
