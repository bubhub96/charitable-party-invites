const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
// Debug middleware to log requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

// CORS configuration
app.use((req, res, next) => {
  // Allow specific origins
  const allowedOrigins = ['https://www.ethicalpartys.com', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
    return;
  }
  
  next();
});

// Remove the cors middleware since we're handling it manually
// app.use(cors());
app.use(express.json());

// Database connection
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost/charitable-invites';
console.log('MongoDB URI present:', !!process.env.MONGODB_URI);
console.log('Attempting to connect to MongoDB...');

// Add global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Could not connect to MongoDB:', err);
  console.error('Error details:', err.message);
  console.error('Stack trace:', err.stack);
});

// Routes
const invitationRoutes = require('./routes/invitations');
const donationRoutes = require('./routes/donations');
const userRoutes = require('./routes/users');

app.use('/api/invitations', invitationRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
