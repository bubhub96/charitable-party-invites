const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  childName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventEndTime: {
    type: Date,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  charityName: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  giftFundTarget: {
    type: Number,
    required: true
  },
  currentGiftFund: {
    type: Number,
    default: 0
  },
  rsvps: [{
    guestName: String,
    email: String,
    attending: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Invitation', invitationSchema);
