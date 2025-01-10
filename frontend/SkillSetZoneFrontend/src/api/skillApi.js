import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/skills';  // Update with your backend URL if different

export const createSkill = async (userId, skillData) => {
  const formData = new FormData();
  formData.append('title', skillData.title);
  formData.append('description', skillData.description);
  if (skillData.file) {
    formData.append('file', skillData.file);
  }

  const response = await axios.post(`${API_BASE_URL}/${userId}/create`, formData);
  return response.data;
};

export const updateSkill = async (userId, skillId, skillData) => {
  const formData = new FormData();
  formData.append('title', skillData.title);
  formData.append('description', skillData.description);
  formData.append('likes', skillData.likes || 0);
  if (skillData.file) {
    formData.append('file', skillData.file);
  }

  const response = await axios.put(`${API_BASE_URL}/${userId}/update/${skillId}`, formData);
  return response.data;
};

export const deleteSkill = async (userId, skillId) => {
  const response = await axios.delete(`${API_BASE_URL}/${userId}/delete/${skillId}`);
  return response.data;
};

export const getSkillById = async (skillId) => {
  const response = await axios.get(`${API_BASE_URL}/${skillId}`);
  return response.data;
};

export const getAllSkillsByUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}/all`);
  return response.data;
};
