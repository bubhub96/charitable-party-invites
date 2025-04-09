require('dotenv').config();
const { Resend } = require('resend');

// This is a temporary API key just for testing
// It will be deleted after this test
const TEMP_API_KEY = 're_RWRPJTzX_KPg7fcfxVJybPePBm59YZGvE';

// The verified email address for this test API key
const VERIFIED_EMAIL = 'christopherboshields1@gmail.com';

// Function to test email sending
async function testEmail() {
  try {
    // Create a Resend client with the temporary API key
    const resend = new Resend(TEMP_API_KEY);
    
    // With a test API key, we can only send to the verified email
    const testEmail = VERIFIED_EMAIL;
    
    console.log(`Sending test email to: ${testEmail}`);
    console.log('Note: With a test API key, we can only send to the verified email address.');
    
    // Send a simple test email
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: testEmail,
      subject: 'Charitable Party Invites - Email Test',
      html: `
        <h1>Email Test Successful! 🎉</h1>
        <p>This is a test email from the Charitable Party Invites application.</p>
        <p>If you're seeing this, it means the email functionality is working correctly!</p>
        <hr>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    });
    
    if (error) {
      console.error('❌ Error sending email:', error);
    } else {
      console.log('✅ Test email sent successfully!');
      console.log('Email ID:', data.id);
      console.log('Please check your inbox at:', testEmail);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testEmail();
