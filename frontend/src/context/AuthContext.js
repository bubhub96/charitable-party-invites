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

      // Use direct API call to the backend
      const apiUrl = 'https://ethical-partys-api.onrender.com/api/users/me';
      console.log('Checking auth with direct API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Auth check response status:', response.status);
      
      if (response.ok) {
        // Get the response text first for debugging
        const responseText = await response.text();
        console.log('Auth check raw response:', responseText);
        
        try {
          const userData = JSON.parse(responseText);
          console.log('Auth check user data:', userData);
          setUser(userData);
        } catch (parseError) {
          console.error('Failed to parse auth check response:', parseError);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log('Auth check failed with status:', response.status);
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
    console.log('Attempting login with:', { email });
    
    try {
      // Use direct API call to the backend
      const apiUrl = 'https://ethical-partys-api.onrender.com/api/users/login';
      console.log('Making direct API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      console.log('Login successful');
      
      // Store the real token from the backend
      localStorage.setItem('token', data.token);
      
      // Set the user data
      const userData = {
        email: data.user.email,
        id: data.user.id,
        name: data.user.name
      };
      
      setUser(userData);
      
      // Return the user data
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  };

  const register = async (name, email, password) => {
    console.log('Attempting registration with:', { name, email });
    
    try {
      // Use direct API call to the backend
      const apiUrl = 'https://ethical-partys-api.onrender.com/api/users/register';
      console.log('Making direct API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('Registration successful');
      
      // Store the real token from the backend
      localStorage.setItem('token', data.token);
      
      // Set the user data
      const userData = {
        name: data.user.name,
        email: data.user.email,
        id: data.user.id
      };
      
      setUser(userData);
      
      // Return the user data
      return userData;
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      });
      throw new Error(error.message || 'Network error occurred');
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
