import React, { useState } from 'react';
import { Activity, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: '', // This could be National ID or Email
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Your partner will use this data to query the DB and find the role
    console.log("Login Attempt:", credentials);
    alert("Authenticating...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Brand Header */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4">
            <Activity className="text-white h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SomnoTrack</h1>
          <p className="text-blue-100 text-sm mt-1">Medical Sleep Analysis Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                name="identifier"
                type="text" 
                placeholder="National ID or Email" 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                name="password"
                type="password" 
                placeholder="Password" 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md transform active:scale-[0.98] transition-all"
          >
            Sign In
          </button>

          <div className="text-center pt-2">
            <p className="text-slate-500 text-sm">
              Don't have an account? {' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;