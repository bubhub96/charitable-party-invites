import React from 'react';

const TestEnv = () => {
  const [testResult, setTestResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const testConnection = async () => {
    try {
      setError(null);
      setTestResult(null);
      
      const url = `${process.env.REACT_APP_API_URL}/api/health`;
      console.log('Testing connection to:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      console.log('Health check response:', data);
      setTestResult(data);
    } catch (error) {
      console.error('Connection test failed:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setError(error.message || 'Unknown error occurred');
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
          onClick={testConnection}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
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

export default TestEnv;
