require('dotenv').config({ path: __dirname + '/.env.test' });
const { 
  sendInvitationEmail, 
  sendRsvpConfirmationEmail, 
  sendDonationConfirmationEmail 
} = require('../utils/emailService');

// Log environment variables (without sensitive values)
console.log('Environment check:');
console.log('- RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);
console.log('- RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('- TEST_EMAIL:', process.env.TEST_EMAIL);

// Function to run all email tests
async function runEmailTests() {
  try {
    const testEmail = process.env.TEST_EMAIL;
    if (!testEmail) {
      console.error('Error: TEST_EMAIL environment variable is not set');
      process.exit(1);
    }

    console.log(`\nSending test emails to: ${testEmail}\n`);

    // Sample data for testing
    const sampleInvitation = {
      childName: 'Test Child',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toLocaleString(),
      eventLocation: '123 Test Street, Test City',
      charityName: 'Test Charity',
      giftFundTarget: 500
    };

    const sampleRsvp = {
      guestName: 'Test Guest',
      email: testEmail,
      attending: 'yes',
      guests: 2,
      message: 'Looking forward to it!'
    };

    const sampleDonation = {
      amount: 50,
      donor: {
        name: 'Test Donor',
        email: testEmail
      }
    };

    // Test 1: Send invitation email
    console.log('Test 1: Sending invitation email...');
    const invitationResult = await sendInvitationEmail(testEmail, sampleInvitation);
    console.log('Invitation email result:', invitationResult);
    console.log('✅ Invitation email test complete\n');

    // Wait 2 seconds between email sends
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Send RSVP confirmation email
    console.log('Test 2: Sending RSVP confirmation email...');
    const rsvpResult = await sendRsvpConfirmationEmail(testEmail, sampleRsvp, sampleInvitation);
    console.log('RSVP confirmation email result:', rsvpResult);
    console.log('✅ RSVP confirmation email test complete\n');

    // Wait 2 seconds between email sends
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Send donation confirmation email
    console.log('Test 3: Sending donation confirmation email...');
    const donationResult = await sendDonationConfirmationEmail(testEmail, sampleDonation, sampleInvitation);
    console.log('Donation confirmation email result:', donationResult);
    console.log('✅ Donation confirmation email test complete\n');

    console.log('All email tests completed successfully!');
    console.log('Please check your inbox at:', testEmail);

  } catch (error) {
    console.error('❌ Error during email testing:', error);
    if (error.response) {
      console.error('API Error details:', error.response.data);
    }
  }
}

// Run the tests
runEmailTests();
