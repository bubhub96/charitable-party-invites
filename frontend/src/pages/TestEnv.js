import React from 'react';

const TestEnv = () => {
  return (
    <div>
      <h1>Environment Variables Test</h1>
      <pre>
        REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'not set'}
      </pre>
    </div>
  );
};

export default TestEnv;
