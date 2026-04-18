import apiClient from './api';

export const patientService = {
  // Register a new patient
  registerPatient: async (patientData) => {
    // patientData includes the symptoms and antecedents arrays
    const response = await apiClient.post('/patients/add', patientData);
    return response.data;
  },

  // Get list of patients (for the dashboard)
  getAllPatients: async () => {
    const response = await apiClient.get('/patients');
    return response.data;
  }
};