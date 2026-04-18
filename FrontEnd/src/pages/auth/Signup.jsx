import React, { useState } from 'react';
import { Activity, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

const handleSignup = async (e) => {
  e.preventDefault();
  
  try {
    const result = await authService.signup(formData);
    alert("Account created successfully!");
    // Redirect to login or dashboard
  } catch (error) {
    console.error("Signup failed", error);
    alert(error.response?.data?.message || "An error occurred");
  }
};

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Lexical Rule: Names (Letters and hyphens only)
    if ((name === 'firstName' || name === 'lastName') && !/^[a-zA-ZÀ-ÿ-\s]*$/.test(value)) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Account Creation Request:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Dark High-Contrast Header */}
        <div className="bg-slate-900 p-8 text-center relative">
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-blue-600 rounded-xl mb-3 shadow-lg shadow-blue-900/40">
              <Activity className="text-white h-7 w-7" />
            </div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">
              Join <span className="text-blue-500">SomnoTrack</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase tracking-[0.2em]">
              Medical Staff Registration
            </p>
          </div>
        </div>

        <form onSubmit={handleSignup} className="p-8 space-y-5">
          
          {/* First & Last Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="firstName" type="text" placeholder="First Name" 
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                onChange={handleInputChange} value={formData.firstName} required
              />
            </div>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="lastName" type="text" placeholder="Last Name" 
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                onChange={handleInputChange} value={formData.lastName} required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              name="email" type="email" placeholder="Professional Email" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              onChange={handleInputChange} required
            />
          </div>

          {/* Role Selection - Technicians removed */}
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <select 
              name="role"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none text-slate-600 font-medium cursor-pointer"
              onChange={handleInputChange}
              required
            >
              <option value="" disabled selected>Select Professional Role</option>
              <option value="doctor">Medical Doctor (MD)</option>
              <option value="nurse">Clinical Nurse</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          {/* Passwords */}
          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="password" type="password" placeholder="Password" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                onChange={handleInputChange} required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="confirmPassword" type="password" placeholder="Confirm Password" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                onChange={handleInputChange} required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transform active:scale-[0.97] transition-all mt-2"
          >
            CREATE ACCOUNT
          </button>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-slate-500 text-sm font-medium">
              Already registered? {' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;