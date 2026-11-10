const express = require('express');
const path = require('path');

const cors = require('./middleware/cors.middleware');
const { createRateLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Secure Connect API is running',
    timestamp: new Date().toISOString()
  });
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;