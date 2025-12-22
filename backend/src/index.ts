import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/client.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

// Routes
import searchRoutes from './routes/search.js';
import tipsRoutes from './routes/tips.js';
import destinationsRoutes from './routes/destinations.js';
import authRoutes from './routes/auth.js';
import plansRoutes from './routes/plans.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════╗
║   🧭 Compass API Server Running    ║
║   Port: ${PORT}                       ║
║   Env: ${process.env.NODE_ENV || 'development'}         ║
╚════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
