import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { createGlobalStyle } from 'styled-components';
import { theme } from './styles/theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${theme.typography.fontFamily};
    background: ${theme.colors.background.main};
    color: ${theme.colors.text.primary};
    line-height: 1.5;
  }

  button {
    font-family: ${theme.typography.fontFamily};
  }
`;

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const TestEnv = React.lazy(() => import('./pages/TestEnv'));
const EmailTest = React.lazy(() => import('./pages/EmailTest'));
const Auth = React.lazy(() => import('./pages/Auth'));
const CreateInvitation = React.lazy(() => import('./pages/CreateInvitation'));
const ViewInvitation = React.lazy(() => import('./pages/ViewInvitation'));

function App() {
  console.log('API URL:', process.env.REACT_APP_API_URL); // Verify environment variable
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <div className="app">
            <GlobalStyle />
            <Navbar />
            <main>
              <Suspense fallback={<LoadingSpinner size="large" />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/test-env" element={<TestEnv />} />
                  <Route path="/email-test" element={<EmailTest />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/register" element={<Auth />} />
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute>
                        <CreateInvitation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invitation/:id"
                    element={
                      <ProtectedRoute>
                        <ViewInvitation />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
