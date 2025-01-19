import axios from 'axios';

// Define the base URL for your backend
const API_BASE_URL = 'http://localhost:8080/public';

// Helper function to encode base64
const toBase64 = (str) => {
  if (typeof window !== 'undefined') {
    return btoa(str); // Browser environment
  } else {
    return Buffer.from(str).toString('base64'); // Node.js environment
  }
};

// Signup service
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error during sign-up';
  }
};

// Login service
export const login = async (email, password) => {
  try {
    const authHeader = 'Basic ' + toBase64(`${email}:${password}`);

    const response = await axios.post(
      `${API_BASE_URL}/login`, // Backend login URL
      {}, // Empty body for Basic Auth
      {
        headers: {
          Authorization: authHeader, // Set the Authorization header
          'Content-Type': 'application/json', // Ensure proper content-type
        },
      }
    );

    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error message:', error.message);
    console.error('Full error object:', error);

    if (error.response) {
      console.error('Response error:', error.response);
      if (error.response.status === 401) {
        alert('Invalid credentials. Please try again.');
      } else {
        alert('An error occurred while logging in.');
      }
    } else if (error.request) {
      alert('No response received from the server.');
    } else {
      alert('Error while setting up the request.');
    }
    throw error;
  }
};
