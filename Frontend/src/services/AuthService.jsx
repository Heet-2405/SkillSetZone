// AuthService.jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/public';

// Signup service (now using FormData)
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Required for file upload
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error during sign-up';
  }
};


// Login service
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    if (response.status === 200) {
      // Encode and store credentials
      const encodedCredentials = btoa(`${email}:${password}`);
      localStorage.setItem('auth', encodedCredentials);

      console.log('Login successful', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(error.response?.data || 'Login failed');
  }
};

// Logout service
export const logout = () => {
  localStorage.removeItem('auth'); // Remove credentials from storage
};
