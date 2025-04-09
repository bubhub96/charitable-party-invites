import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/TestEnv.css';

const EmailTest = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [testEmail, setTestEmail] = useState('');
  const [testType, setTestType] = useState('invitation');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [testResult, setTestResult] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Check if authentication is complete (not loading)
    if (!loading) {
      setAuthChecked(true);
      
      // If user is not authenticated, redirect to login
      if (!user && authChecked) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login');
      }
    }
  }, [user, loading, navigate, authChecked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setStatus({ loading: true, message: 'Sending test email...', error: false });
    setTestResult(null);
    
    try {
      // Simulate a successful email send for demonstration purposes
      // In a real implementation, this would call the backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set success status
      setStatus({ 
        loading: false, 
        message: `Test ${testType} email simulation successful! In a production environment, this would send a real email.`, 
        error: false 
      });
      
      // Set simulated result
      setTestResult({
        id: `test-${Date.now()}`,
        status: 'success',
        emailType: testType,
        timestamp: new Date().toISOString()
      });
    
    } catch (error) {
      console.error('Email test error:', error);
      setStatus({ 
        loading: false, 
        message: `Failed to send test email: ${error.message}`, 
        error: true 
      });
    }
  };

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="test-env">
        <h1>Email Testing Environment</h1>
        <div className="test-container">
          <p>Loading authentication status...</p>
        </div>
      </div>
    );
  }
  
  // This should never render because we redirect in the useEffect
  // But keeping it as a fallback
  if (!user) {
    return (
      <div className="test-env">
        <h1>Email Testing Environment</h1>
        <div className="test-container">
          <p>You must be logged in to access this page.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="test-button"
            style={{ marginTop: '1rem' }}
          >
            Go to Login
          </button>
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
        <div className="info-box">
          <p><strong>Note:</strong> This is a simulation of the email functionality.</p>
          <p>In a production environment, this would send actual emails using the Resend API.</p>
          <p>The backend is already configured to send emails using the following templates:</p>
          <ul>
            <li>Invitation emails</li>
            <li>RSVP confirmation emails</li>
            <li>Donation confirmation emails</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="test-form">
          <div className="form-group">
            <label htmlFor="testType">Email Template:</label>
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
