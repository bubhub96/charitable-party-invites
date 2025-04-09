const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  sendInvitationEmail, 
  sendRsvpConfirmationEmail, 
  sendDonationConfirmationEmail 
} = require('../utils/emailService');

// @route   POST /api/test/email
// @desc    Send a test email
// @access  Private (requires authentication)
router.post('/email', auth, async (req, res) => {
  try {
    const { testEmail, testType, sampleInvitation, sampleRsvp, sampleDonation } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ message: 'Test email address is required' });
    }
    
    let result;
    
    switch (testType) {
      case 'invitation':
        result = await sendInvitationEmail(testEmail, sampleInvitation);
        break;
      case 'rsvp':
        result = await sendRsvpConfirmationEmail(testEmail, sampleRsvp, sampleInvitation);
        break;
      case 'donation':
        result = await sendDonationConfirmationEmail(testEmail, sampleDonation, sampleInvitation);
        break;
      default:
        return res.status(400).json({ message: 'Invalid test type' });
    }
    
    res.json({ 
      success: true, 
      message: `Test ${testType} email sent successfully to ${testEmail}`,
      result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Failed to send test email', 
      error: error.message,
      details: error.originalError || error
    });
  }
});

// @route   GET /api/test/health
// @desc    Check if the email service is properly configured
// @access  Public
router.get('/health', async (req, res) => {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Email service is not properly configured',
        details: `Missing environment variables: ${missingVars.join(', ')}`
      });
    }
    
    res.json({ 
      status: 'ok',
      message: 'Email service is properly configured',
      config: {
        fromEmail: process.env.RESEND_FROM_EMAIL,
        apiKeyConfigured: !!process.env.RESEND_API_KEY
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to check email service health',
      error: error.message
    });
  }
});

module.exports = router;
