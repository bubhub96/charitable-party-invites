const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');
const Invitation = require('../models/Invitation');

// Create donation and process payment
router.post('/', async (req, res) => {
  try {
    const { amount, invitationId, donor, paymentMethodId } = req.body;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });

    // Create donation record
    const donation = new Donation({
      invitation: invitationId,
      donor,
      amount,
      stripePaymentId: paymentIntent.id,
      status: 'completed'
    });

    await donation.save();

    // Update invitation's gift fund
    await Invitation.findByIdAndUpdate(
      invitationId,
      { $inc: { currentGiftFund: donation.giftFundAmount } }
    );

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get donations for an invitation
router.get('/invitation/:invitationId', async (req, res) => {
  try {
    const donations = await Donation.find({ invitation: req.params.invitationId });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
