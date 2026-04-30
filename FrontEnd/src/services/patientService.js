import apiClient from './api';

export const patientService = {
  // Register a new patient
  registerPatient: async (patientData) => {
    try {
      const response = await apiClient.post('/patients/add', patientData);
      return response.data;
    } catch (error) {
      console.error("Service Error: registerPatient failed", error);
      throw error;
    }
  },

  // Get list of all patients
  getAllPatients: async () => {
    try {
      const response = await apiClient.get('/patients');
      return response.data || []; 
    } catch (error) {
      console.error("Service Error: getAllPatients failed", error);
      return []; 
    }
  },

  // --- NEW: Get a single patient's full dossier ---
  getPatientById: async (id) => {
    try {
      // Logic: Fetches specific data for the Consultation page
      const response = await apiClient.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Service Error: Failed to fetch patient ${id}`, error);
      throw error;
    }
  },

  // --- NEW: Delete patient record ---
  deletePatient: async (id) => {
    try {
      const response = await apiClient.delete(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Service Error: Failed to delete patient ${id}`, error);
      throw error;
    }
  }
};