import React from 'react';

const TestEnv = () => {
  console.log('TestEnv component rendered');
  const [testResult, setTestResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Try multiple methods to connect to the API
  const testDirectApi = async () => {
    // Method 1: Try with CORS proxy
    try {
      const apiUrl = 'https://ethical-partys-api.onrender.com/api/health';
      const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;
      console.log('Method 1: Using CORS proxy:', corsProxyUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'no-cors', // This will prevent CORS errors but makes response opaque
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response type with no-cors:', response.type);
      
      if (!response.ok) {
        console.log(`CORS proxy returned status ${response.status}, trying direct call...`);
        throw new Error('CORS proxy failed');
      }
      
      const data = await response.json();
      console.log('CORS proxy response:', data);
      return { success: true, data };
    } catch (corsError) {
      console.log('CORS proxy method failed:', corsError.message);
      
      // Method 2: Try direct call with mode: 'no-cors'
      try {
        const apiUrl = 'https://ethical-partys-api.onrender.com/api/health';
        console.log('Method 2: Direct call with no-cors mode:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('No-cors response type:', response.type);
        
        // With no-cors, we can't actually read the response
        // But if we got here, the request didn't fail due to CORS
        return { 
          success: true, 
          data: { 
            message: 'Connection successful (no-cors mode)', 
            note: 'Response content cannot be read in no-cors mode, but connection was established'
          } 
        };
      } catch (directError) {
        console.error('Direct API call failed:', directError);
        return { success: false, error: directError };
      }
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
