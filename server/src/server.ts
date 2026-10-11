import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import { skillRouter } from './routes/skillRoutes.js';
import { goalRouter } from './routes/goalRoutes.js';
import { activityRouter } from './routes/activityRoutes.js';
import { careerRouter } from './routes/careerRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databaseConnected: isDbConnected(),
  });
});

// Mount modular API routers
app.use('/api/auth', authRouter);
app.use('/api/skills', skillRouter);
app.use('/api/goals', goalRouter);
app.use('/api/activities', activityRouter);
app.use('/api/careers', careerRouter);

// Global 404 handler for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
});

// Start Express server and connect to MongoDB
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[SkillPulse API] Server running on http://localhost:${PORT}`);
    console.log(`[SkillPulse API] Accepting requests from: ${CLIENT_URL}`);
  });
};

startServer().catch((err) => {
  console.error('[SkillPulse API Fatal Error]', err);
});
