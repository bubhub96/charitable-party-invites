import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/TestEnv.css';

const EmailTest = () => {
  const { user } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testType, setTestType] = useState('invitation');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [testResult, setTestResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!testEmail) {
      setStatus({ loading: false, message: 'Please enter a test email address', error: true });
      return;
    }
    
    setStatus({ loading: true, message: 'Sending test email...', error: false });
    setTestResult(null);
    
    try {
      // Create sample data for testing
      const sampleData = {
        testEmail,
        testType,
        sampleInvitation: {
          childName: 'Test Child',
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          eventEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          eventLocation: '123 Test Street, Test City',
          charityName: 'Test Charity',
          giftFundTarget: 500
        },
        sampleRsvp: {
          guestName: 'Test Guest',
          email: testEmail,
          attending: 'yes',
          guests: 2,
          message: 'Looking forward to it!'
        },
        sampleDonation: {
          amount: 50,
          donor: {
            name: 'Test Donor',
            email: testEmail
          }
        }
      };
      
      // Call the backend API to send the test email
      const response = await fetch('https://ethical-partys-api.onrender.com/api/test/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(sampleData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ 
          loading: false, 
          message: `Test ${testType} email sent successfully! Check your inbox at ${testEmail}`, 
          error: false 
        });
        setTestResult(data);
      } else {
        throw new Error(data.message || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Email test error:', error);
      setStatus({ 
        loading: false, 
        message: `Failed to send test email: ${error.message}`, 
        error: true 
      });
    }
  };

  if (!user) {
    return (
      <div className="test-env">
        <h1>Email Testing Environment</h1>
        <div className="test-container">
          <p>You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-env">
      <h1>Email Testing Environment</h1>
      
      <div className="test-container">
        <h2>Send Test Email</h2>
        <p>Use this form to send a test email and verify the email functionality.</p>
        
        <form onSubmit={handleSubmit} className="test-form">
          <div className="form-group">
            <label htmlFor="testEmail">Test Email Address:</label>
            <input
              type="email"
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="testType">Email Type:</label>
            <select
              id="testType"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
            >
              <option value="invitation">Invitation Email</option>
              <option value="rsvp">RSVP Confirmation Email</option>
              <option value="donation">Donation Confirmation Email</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="test-button"
            disabled={status.loading}
          >
            {status.loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>
        
        {status.message && (
          <div className={`status-message ${status.error ? 'error' : 'success'}`}>
            {status.message}
          </div>
        )}
        
        {testResult && (
          <div className="test-result">
            <h3>Test Result:</h3>
            <pre>{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div className="test-container">
        <h2>Email Testing Guide</h2>
        <ol>
          <li>Enter your email address in the form above</li>
          <li>Select the type of email you want to test</li>
          <li>Click "Send Test Email"</li>
          <li>Check your inbox for the test email</li>
          <li>If you don't receive the email, check your spam folder</li>
          <li>Verify that the email content and formatting are correct</li>
        </ol>
        
        <h3>Troubleshooting</h3>
        <ul>
          <li>Make sure the backend API is running</li>
          <li>Check that the RESEND_API_KEY environment variable is set correctly</li>
          <li>Verify that the RESEND_FROM_EMAIL is a valid sender email</li>
          <li>Look at the server logs for any error messages</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTest;
