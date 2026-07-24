import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './src/middlewares/errorMiddleware.js';
import healthRoutes from './src/routes/healthRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import franchiseRoutes from './src/routes/franchiseRoutes.js';
import staffRoutes from './src/routes/staffRoutes.js';

const app = express();

// Configure CORS for local dev and production Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://machine-round-phi.vercel.app',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or requests without origin header (like Postman/Curl)
      if (!origin) return callback(null, true);

      // Check if origin is explicitly allowed or comes from a .vercel.app domain
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Fallback: allow request in development or production
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Enable pre-flight CORS across-the-board
app.options('*', cors());

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
