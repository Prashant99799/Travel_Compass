import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/client.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { optionalAuthMiddleware } from './middleware/auth.js';

// Routes
import searchRoutes from './routes/search.js';
import tipsRoutes from './routes/tips.js';
import destinationsRoutes from './routes/destinations.js';
import authRoutes from './routes/auth.js';
import plansRoutes from './routes/plans.js';
import userRoutes from './routes/user.js';
import postsRoutes from './routes/posts.js';
import votesRoutes from './routes/votes.js';
import bookmarksRoutes from './routes/bookmarks.js';
import seasonsRoutes from './routes/seasons.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Optional auth - attaches user to request if token present
app.use(optionalAuthMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/seasons', seasonsRoutes);

// API Routes - v1 (for newer endpoints)
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/votes', votesRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🧭 Travel Compass API Server             ║
║   Port: ${PORT}                               ║
║   Env: ${process.env.NODE_ENV || 'development'}                      ║
║   Auth: JWT (Simple)                       ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
