const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI || 'mongodb://localhost/charitable-invites');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/charitable-invites', {
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
