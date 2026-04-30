import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Signup from './pages/auth/Signup';
import NurseDashboard from './pages/dashboard/NurseDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import AddPatient from './pages/patients/AddPatient';
import PatientConsultation from './pages/patients/PatientConsultation';


function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 2. Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 3. Dashboard Routes - Ensure the path here matches navigate() exactly */}
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/patient/:id" element={<PatientConsultation />} />

        {/* 4. TEMPORARY: Comment this out to stop the redirect loop while debugging */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;