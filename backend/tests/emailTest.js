require('dotenv').config({ path: __dirname + '/.env.test' });
const { 
  sendInvitationEmail, 
  sendRsvpConfirmationEmail, 
  sendDonationConfirmationEmail 
} = require('../utils/emailService');

// Check if required environment variables are set
const requiredEnvVars = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'FRONTEND_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables in your .env file and try again.');
  process.exit(1);
}

// Test email address - replace with your own for testing
const TEST_EMAIL = process.env.TEST_EMAIL || 'your-test-email@example.com';

// Sample data for testing
const sampleInvitation = {
  _id: '123456789',
  childName: 'Test Child',
  eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
  eventEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours after start
  eventLocation: '123 Test Street, Test City',
  charityName: 'Test Charity',
  giftFundTarget: 500
};

const sampleRsvp = {
  guestName: 'Test Guest',
  email: TEST_EMAIL,
  attending: 'yes',
  guests: 2,
  message: 'Looking forward to it!'
};

const sampleDonation = {
  amount: 50,
  donor: {
    name: 'Test Donor',
    email: TEST_EMAIL
  }
};

// Function to run all email tests
async function runEmailTests() {
  console.log('🧪 Starting email tests...');
  console.log(`📧 Using test email: ${TEST_EMAIL}`);
  
  try {
    // Test 1: Send invitation email
    console.log('\n🔍 Test 1: Sending invitation email...');
    const invitationResult = await sendInvitationEmail(TEST_EMAIL, sampleInvitation);
    console.log('✅ Invitation email sent successfully:', invitationResult);
    
    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Send RSVP confirmation email
    console.log('\n🔍 Test 2: Sending RSVP confirmation email...');
    const rsvpResult = await sendRsvpConfirmationEmail(TEST_EMAIL, sampleRsvp, sampleInvitation);
    console.log('✅ RSVP confirmation email sent successfully:', rsvpResult);
    
    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Send donation confirmation email
    console.log('\n🔍 Test 3: Sending donation confirmation email...');
    const donationResult = await sendDonationConfirmationEmail(TEST_EMAIL, sampleDonation, sampleInvitation);
    console.log('✅ Donation confirmation email sent successfully:', donationResult);
    
    console.log('\n🎉 All email tests completed successfully!');
    console.log('📬 Please check your inbox at', TEST_EMAIL, 'to verify the emails were received.');
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
  }
}

// Run the tests
runEmailTests();
