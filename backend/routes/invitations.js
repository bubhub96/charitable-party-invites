const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Invitation = require('../models/Invitation');
const { 
  sendInvitationEmail, 
  sendRsvpConfirmationEmail, 
  sendDonationConfirmationEmail 
} = require('../utils/emailService');

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded.user;
    console.log('Auth middleware - req.user:', req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create new invitation
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating invitation with user:', req.user);
    console.log('Request body:', req.body);

    // Validate required fields
    const { childName, eventDate, eventEndTime, eventLocation, charityName, giftFundTarget } = req.body;
    
    if (!childName || !eventDate || !eventEndTime || !eventLocation || !charityName || !giftFundTarget) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: {
          childName: !childName ? 'Child name is required' : null,
          eventDate: !eventDate ? 'Event date is required' : null,
          eventEndTime: !eventEndTime ? 'Event end time is required' : null,
          eventLocation: !eventLocation ? 'Event location is required' : null,
          charityName: !charityName ? 'Charity name is required' : null,
          giftFundTarget: !giftFundTarget ? 'Gift fund target is required' : null
        }
      });
    }

    const invitationData = {
      childName,
      eventDate: new Date(eventDate),
      eventEndTime: new Date(eventEndTime),
      eventLocation,
      charityName,
      giftFundTarget: Number(giftFundTarget),
      createdBy: req.user.id
    };

    console.log('Processed invitation data:', invitationData);
    const invitation = new Invitation(invitationData);
    await invitation.save();
    
    // Send invitation emails if emails are provided
    if (req.body.inviteeEmails && Array.isArray(req.body.inviteeEmails)) {
      for (const email of req.body.inviteeEmails) {
        try {
          await sendInvitationEmail(email, invitation);
        } catch (emailError) {
          console.error(`Failed to send invitation email to ${email}:`, emailError);
        }
      }
    }
    
    console.log('Invitation created successfully:', invitation);
    res.status(201).json(invitation);
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all invitations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const invitations = await Invitation.find({ createdBy: req.params.userId });
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific invitation
router.get('/:id', async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id)
      .populate('donations');
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle RSVP
router.post('/:id/rsvp', async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    
    const rsvpData = {
      guestName: req.body.guestName,
      email: req.body.email,
      attending: req.body.attending
    };

    invitation.rsvps.push(rsvpData);
    await invitation.save();

    // Send RSVP confirmation email
    if (rsvpData.email) {
      try {
        await sendRsvpConfirmationEmail(rsvpData.email, rsvpData, invitation);
      } catch (emailError) {
        console.error('Failed to send RSVP confirmation email:', emailError);
      }
    }

    res.json(invitation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
