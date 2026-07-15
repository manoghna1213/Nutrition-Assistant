const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dietitianRoutes = require('./routes/dietitianRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Error Middleware
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Set security headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allows serving static uploads to frontend
}));

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize data (prevent NoSQL Injection)
app.use(mongoSanitize());

// Custom simple logging middleware
app.use((req, res, next) => {
  console.log(`[Request Log] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Rate limiting (100 requests per 10 minutes)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 10 minutes'
  }
});
app.use('/api/', limiter);

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dietitian', dietitianRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Base API route check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to the Nutrition Assistant REST API. Server is running.' });
});

// Catch-all route for unhandled paths
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler middleware
app.use(errorHandler);

module.exports = app;
