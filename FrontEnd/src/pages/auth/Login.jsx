import React, { useState } from 'react';
import { Activity, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await authService.login(credentials);
        console.log("Login success:", response);
        if (response.success) {
            // Save token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            // Redirect to dashboard
            window.location.href = '/dashboard';
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Check credentials.");
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Dark Header for high contrast */}
        <div className="bg-slate-900 p-10 text-center relative">
          <div className="relative z-10">
            <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/40">
              {/* White icon on Blue background = No conflict */}
              <Activity className="text-white h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase">
              Somno<span className="text-blue-500">Track</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
              Sleep Analysis Management
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="identifier"
                type="text" 
                placeholder="National ID or Email" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="password"
                type="password" 
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transform active:scale-[0.97] transition-all"
          >
            SIGN IN
          </button>

          {/* SIGNUP LINK RESTORED */}
          <div className="text-center space-y-4 pt-4 border-t border-slate-100">
            <p className="text-slate-500 text-sm">
              New to the staff?{' '}
              <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Create an account
              </Link>
            </p>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">
              Authorized Personnel Only
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;