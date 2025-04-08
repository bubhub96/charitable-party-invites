import React from 'react';

const TestEnv = () => {
  const [testResult, setTestResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const testFetch = async () => {
    try {
      const url = 'https://ethical-partys-api.onrender.com/api/health';
      console.log('Testing with fetch:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Fetch response:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false, error };
    }
  };

  const testXHR = async () => {
    return new Promise((resolve) => {
      const url = 'https://ethical-partys-api.onrender.com/api/health';
      console.log('Testing with XHR:', url);
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Accept', 'application/json');
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log('XHR response:', data);
          resolve({ success: true, data });
        } else {
          console.error('XHR error:', xhr.statusText);
          resolve({ success: false, error: new Error(xhr.statusText) });
        }
      };
      
      xhr.onerror = (error) => {
        console.error('XHR error:', error);
        resolve({ success: false, error });
      };
      
      xhr.send();
    });
  };

  const testConnection = async () => {
    try {
      setError(null);
      setTestResult(null);
      setLoading(true);
      
      console.log('Starting connection tests...');
      console.log('Current environment:', {
        NODE_ENV: process.env.NODE_ENV,
        API_URL: process.env.REACT_APP_API_URL,
        location: window.location.href
      });
      
      // Try fetch first
      const fetchResult = await testFetch();
      if (fetchResult.success) {
        setTestResult(fetchResult.data);
        setLoading(false);
        return;
      }
      
      // If fetch fails, try XHR
      console.log('Fetch failed, trying XHR...');
      const xhrResult = await testXHR();
      if (xhrResult.success) {
        setTestResult(xhrResult.data);
        setLoading(false);
        return;
      }
      
      // If both fail, show error
      const error = fetchResult.error || xhrResult.error;
      console.error('All connection attempts failed:', error);
      setError(error.message || 'Failed to connect to the server');
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
          onClick={testConnection}
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

export default TestEnv;
