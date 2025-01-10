import axios from 'axios';

const API_BASE_URL = '/api/users';

export const createUser = async (user) => {
  const response = await axios.post(API_BASE_URL, user);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}`);
  return response.data;
};
