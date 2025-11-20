import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy - required for rate limiting behind Nginx
app.set('trust proxy', 1);

// Middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://businessqoldau.kz', 'https://www.businessqoldau.kz']
  : [process.env.FRONTEND_URL || 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check (before API routes)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api', routes);

// 404 handler (must be after all routes)
app.use((req, res, next) => {
  console.log('⚠️  404 handler called for path:', req.path);
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.path
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});