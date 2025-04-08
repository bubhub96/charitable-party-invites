import React from 'react';

const TestEnv = () => {
  console.log('TestEnv component rendered');
  const [testResult, setTestResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Direct API call without using Next.js API routes
  const testDirectApi = async () => {
    try {
      const apiUrl = 'https://ethical-partys-api.onrender.com/api/health';
      console.log('Testing direct API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Direct API response:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Direct API call failed:', error);
      return { success: false, error };
    }
  };

  const testConnection = async () => {
    console.log('testConnection function called');
    try {
      setError(null);
      setTestResult(null);
      setLoading(true);
      
      console.log('Starting connection tests...');
      console.log('Current environment:', {
        NODE_ENV: process.env.NODE_ENV,
        API_URL: 'https://ethical-partys-api.onrender.com',
        location: window.location.href
      });
      
      // Try direct API call
      console.log('Trying direct API call...');
      const apiResult = await testDirectApi();
      
      if (apiResult.success) {
        setTestResult(apiResult.data);
        return;
      }
      
      // If direct API call fails, show error
      setError(apiResult.error?.message || 'Failed to connect to the API server');
    } catch (error) {
      console.error('Test runner error:', error);
      setError(error.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Environment Variables Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Variables:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'not set'}
          NODE_ENV: {process.env.NODE_ENV}
          Window Location: {window.location.href}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>API Connection Test:</h2>
        <button 
          onClick={() => {
            console.log('Test button clicked');
            testConnection();
          }}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '10px'
          }}
        >
          Test API Connection
        </button>
        
        {error && (
          <div style={{ color: 'red', marginTop: '10px', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
            Error: {error}
          </div>
        )}
        
        {testResult && (
          <div style={{ color: 'green', marginTop: '10px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
            Connection successful! Response: {JSON.stringify(testResult, null, 2)}
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Manual Test URLs:</h2>
        <ul>
          <li>
            <a href={`${process.env.REACT_APP_API_URL}/api/health`} target="_blank" rel="noopener noreferrer">
              Health Check URL
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Wrap the component in an error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TestEnv error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export the wrapped component
export default function WrappedTestEnv() {
  return (
    <ErrorBoundary>
      <TestEnv />
    </ErrorBoundary>
  );
}
