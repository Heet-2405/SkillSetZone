import axios from 'axios';

const API_BASE_URL = '/api/skills';

export const createSkill = async (userId, formData) => {
  const response = await axios.post(`${API_BASE_URL}/${userId}/create`, formData);
  return response.data;
};

export const getAllSkillsByUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}/all`);
  return response.data;
};

export const getSkillById = async (skillId) => {
  const response = await axios.get(`${API_BASE_URL}/${skillId}`);
  return response.data;
};

export const updateSkill = async (userId, skillId, formData) => {
  const response = await axios.put(`${API_BASE_URL}/${userId}/update/${skillId}`, formData);
  return response.data;
};

export const deleteSkill = async (userId, skillId) => {
  await axios.delete(`${API_BASE_URL}/${userId}/delete/${skillId}`);
};
