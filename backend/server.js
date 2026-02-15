const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const movieRoutes = require('./routes/movie.routes');
const theatreRoutes = require('./routes/theatre.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development, configure properly in production
  crossOriginEmbedderPolicy: false
}));

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// Rate limiting - different limits for different routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Stricter limit for auth routes
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Stricter limit for payment routes
  message: 'Too many payment requests, please try again later.',
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/payments', paymentLimiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  
  // Start booking cleanup job after DB connection
  const { startCleanupJob } = require('./utils/bookingCleanup');
  startCleanupJob();
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);

// API root - show available endpoints
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: '🎬 Movie Booking API',
    version: '1.0.0',
    documentation: 'See available endpoints below',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
      movies: {
        theatre: 'GET /api/movies/theatre',
        online: 'GET /api/movies/online',
        byTmdbId: 'GET /api/movies/tmdb/:tmdbId',
        recommendations: 'GET /api/movies/:tmdbId/recommendations',
      },
      theatres: {
        all: 'GET /api/theatres',
        byId: 'GET /api/theatres/:id',
        showtimes: 'GET /api/theatres/:id/showtimes',
      },
      bookings: {
        create: 'POST /api/bookings',
        myBookings: 'GET /api/bookings/my-bookings',
        byId: 'GET /api/bookings/:id',
        cancel: 'PUT /api/bookings/:id/cancel',
      },
      payments: {
        createOrder: 'POST /api/payments/create-order',
        verify: 'POST /api/payments/verify',
      },
      search: {
        all: 'GET /api/search?q=query',
      }
    },
    razorpay: {
      configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      testMode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') || false
    },
    database: {
      connected: mongoose.connection.readyState === 1
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🎬 Welcome to Movie Booking API',
    version: '1.0.0',
    docs: 'Visit /api for available endpoints'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

