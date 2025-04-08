/**
 * API utility functions for making requests to the backend
 */

const API_URL = 'https://ethical-partys-api.onrender.com';

/**
 * Makes a request to the backend API
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/users')
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - The response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`[API] Making request to: ${url}`);
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Request failed:', error);
    throw error;
  }
};

/**
 * Health check function to test API connectivity
 * @returns {Promise<Object>} - Health check response
 */
export const checkHealth = async () => {
  try {
    return await apiRequest('/api/health');
  } catch (error) {
    console.error('[API] Health check failed:', error);
    throw error;
  }
};
