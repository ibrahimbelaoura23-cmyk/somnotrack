import apiClient from './api';

export const patientService = {
  // Register a new patient (Admin/Doctor Only)
  registerPatient: async (patientData) => {
    try {
      // Logic: Maps the frontend symptoms to what Flask expects
      const response = await apiClient.post('/patients/add', patientData);
      return response.data;
    } catch (error) {
      console.error("Service Error: registerPatient failed", error);
      throw error; // Pass the error back to the component to show the alert
    }
  },

  // Get list of patients (Used by Nurse/Doctor Dashboards)
  getAllPatients: async () => {
    try {
      const response = await apiClient.get('/patients');
      
      /* SAFETY CHECK: 
         Your Flask backend returns the list directly. 
         Axios puts it in response.data.
      */
      return response.data || []; 
    } catch (error) {
      console.error("Service Error: getAllPatients failed", error);
      return []; // Return empty array so the dashboard doesn't crash
    }
  }
};