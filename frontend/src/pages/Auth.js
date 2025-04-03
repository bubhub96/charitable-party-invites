import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from '../components/AuthForms';
import '../styles/Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the page they tried to visit before being redirected to login
  const from = location.state?.from?.pathname || '/';

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const onAuthSuccess = () => {
    // Navigate them back to the page they tried to visit
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-switcher">
          <button 
            className={`switch-button ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`switch-button ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="auth-form-container">
          {isLogin ? (
            <>
              <LoginForm onSuccess={onAuthSuccess} />
              <p className="form-footer">
                Don't have an account?{' '}
                <button className="text-button" onClick={toggleForm}>
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={onAuthSuccess} />
              <p className="form-footer">
                Already have an account?{' '}
                <button className="text-button" onClick={toggleForm}>
                  Login here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
