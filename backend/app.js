import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './src/middlewares/errorMiddleware.js';
import healthRoutes from './src/routes/healthRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import franchiseRoutes from './src/routes/franchiseRoutes.js';
import staffRoutes from './src/routes/staffRoutes.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/staff', staffRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
