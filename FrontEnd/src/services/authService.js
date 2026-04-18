import apiClient from './api';

export const authService = {
  // Login: receives { identifier, password }
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Signup: receives { firstName, lastName, email, role, password }
  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  }
};