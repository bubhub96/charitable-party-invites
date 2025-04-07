const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation middleware
const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Register a new user
router.post('/register', validateRegistration, async (req, res) => {
  console.log('Starting registration process...');
  console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    console.log('Checking if user exists...');
    let user;
    try {
      user = await User.findOne({ email });
      console.log('User search completed:', user ? 'User found' : 'User not found');
    } catch (findError) {
      console.error('Error searching for user:', findError);
      console.error('MongoDB connection string:', process.env.MONGODB_URI ? 'Set' : 'Not set');
      return res.status(500).json({ message: 'Database error', error: findError.message });
    }
    if (user) {
      console.log('Registration failed: User already exists');
    return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    try {
      await user.save();
      console.log('User saved successfully:', user._id);
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      console.error('Save error details:', saveError.message);
      return res.status(500).json({ message: 'Error creating user', error: saveError.message });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id.toString(),
        name: user.name
      }
    };
    console.log('Registration - User ID:', user._id.toString());

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send back both token and user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({ token, user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id.toString(),
        name: user.name
      }
    };
    console.log('Registration - User ID:', user._id.toString());

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send back both token and user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({ token, user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in /me route:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
