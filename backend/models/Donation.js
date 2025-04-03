const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  invitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invitation',
    required: true
  },
  donor: {
    name: String,
    email: String
  },
  amount: {
    type: Number,
    required: true
  },
  charityAmount: {
    type: Number,
    required: true
  },
  giftFundAmount: {
    type: Number,
    required: true
  },
  stripePaymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate charity and gift fund amounts
donationSchema.pre('save', function(next) {
  if (this.isModified('amount')) {
    this.giftFundAmount = this.amount * 0.1; // 10% for gift
    this.charityAmount = this.amount * 0.9; // 90% for charity
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
