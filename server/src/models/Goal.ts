import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  hoursEstimate: number;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Frontend' },
    dueDate: { type: String, default: 'This Week' },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      default: 'Medium',
      enum: ['High', 'Medium', 'Low'],
    },
    hoursEstimate: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);
