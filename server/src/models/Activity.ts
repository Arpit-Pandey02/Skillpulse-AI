import mongoose, { Schema, Document } from 'mongoose';

export type ActivityType =
  | 'code_practice'
  | 'project_milestone'
  | 'algorithm_solved'
  | 'reading'
  | 'ai_review';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  skillName: string;
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        'code_practice',
        'project_milestone',
        'algorithm_solved',
        'reading',
        'ai_review',
      ],
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    timestamp: { type: String, default: 'Just now' },
    skillName: { type: String, required: true },
    xpEarned: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
