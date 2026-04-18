import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the new Navbar
import Login from './pages/auth/login';
import Signup from './pages/auth/Signup';
import AddPatient from './pages/patients/AddPatient';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar /> {/* This stays visible everywhere */}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;