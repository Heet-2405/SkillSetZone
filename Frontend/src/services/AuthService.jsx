import axios from 'axios';

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

// Login service
export const login = async (email, password) => {
  const loginPayload = { email, password };
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginPayload);

    if (response.status === 200) {
      console.log('Login successful', response.data);
      return response.data; // Return user data
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(error.response?.data || 'Login failed');
  }
};
