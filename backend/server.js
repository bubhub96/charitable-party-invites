const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(cors());
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
