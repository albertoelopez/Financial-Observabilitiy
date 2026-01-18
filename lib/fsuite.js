import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const api = axios.create({
  baseURL: process.env.FSUITE_API_URL || 'http://localhost:5000',
});

export const setAuthToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getExpenses = () => api.get('/expense');

export const optimizeCosts = (data) => api.post('/expense/search', data);

export const askChat = (optionId, data) => api.post(`/expense/ask/${optionId}`, data);

export const textChat = (optionId, message) => api.post(`/expense/text/${optionId}`, { message });

export const uploadFile = (formData) => api.post('/file/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
