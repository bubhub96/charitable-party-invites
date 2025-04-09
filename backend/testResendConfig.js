require('dotenv').config({ path: './test.env' });
const { Resend } = require('resend');

async function testResendConfig() {
  console.log('Testing Resend configuration...');
  console.log('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
  
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Using the only allowed email for this test API key
    const testEmail = 'christopherboshields1@gmail.com';
    
    console.log(`Sending test email to: ${testEmail}`);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: testEmail,
      subject: 'Resend Configuration Test',
      html: `
        <h1>Resend Configuration Test</h1>
        <p>This is a test email to verify your Resend configuration.</p>
        <p>If you're seeing this, your configuration is working correctly!</p>
        <hr>
        <p>Environment variables:</p>
        <ul>
          <li>RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || 'Not configured'}</li>
          <li>FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not configured'}</li>
        </ul>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    });
    
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Test email sent successfully!');
      console.log('Email ID:', data.id);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testResendConfig();
