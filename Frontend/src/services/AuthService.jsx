import axios from 'axios';

// Define the base URL for your backend
const API_BASE_URL = 'http://localhost:8080/public';

// Signup service
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error during sign-up';
  }
};

export const login = async (email, password) => {
  try {
    // Sending email and password in the request body
    const response = await axios.post(
      `${API_BASE_URL}/login`, 
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('Login successful:', response.data);

    // Assuming the token is in response.data.token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      console.log('Token saved to localStorage:', response.data.token); // Debug log
    }

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




