import React from 'react';

const TestEnv = () => {
  const testConnection = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/health`;
      console.log('Testing connection to:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Health check response:', data);
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Environment Variables Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Variables:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'not set'}
          NODE_ENV: {process.env.NODE_ENV}
        </pre>
      </div>
      
      <div>
        <h2>API Connection Test:</h2>
        <button 
          onClick={testConnection}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test API Connection
        </button>
      </div>
    </div>
  );
};

export default TestEnv;
