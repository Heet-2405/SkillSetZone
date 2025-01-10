import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

export const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}`, userData);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};
