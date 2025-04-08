import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      await checkAuth();
    };
    initAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token, user: userData } = await response.json();
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.error('API URL is not configured');
      throw new Error('API configuration error');
    }
    console.log('Attempting registration with:', { name, email });
    console.log('API URL:', process.env.REACT_APP_API_URL);
    
    try {
      console.log(`Making request to ${apiUrl}/api/users/register`);
      const response = await fetch(`${apiUrl}/api/users/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      console.log('Response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!response.ok) {
        console.error('Registration failed with status:', response.status);
        let errorMessage = 'Registration failed';
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Could not parse error response:', e);
          }
        } else {
          const textError = await response.text();
          console.error('Raw error response:', textError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      
      const { token, user: userData } = data;
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
