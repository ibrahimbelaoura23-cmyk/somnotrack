import React, { useState } from 'react';
import { Activity, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login(credentials);
      const response = result.data || result; 

      const userData = response.user || {};
      const rawRole = userData.role; 
      const userRole = rawRole ? String(rawRole).toLowerCase().trim() : null;

      console.log("Found Role:", userRole);

      if (userRole === 'nurse' || userRole === 'doctor') {
        // --- THE MISSING LINK ---
        // We save the WHOLE user object (firstName, lastName, etc.)
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('token', response.token);

        // Redirect based on role
        if (userRole === 'nurse') navigate('/nurse-dashboard');
        else navigate('/doctor-dashboard');
        
      } else {
        const userKeys = Object.keys(userData).join(', ');
        alert(`Role check failed.\nUser object contains: ${userKeys}\nValue of role: ${rawRole}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // The "bg-slate-100" ensures the background is LIGHT GREY, not blue.
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Dark Header - ONLY THIS PART SHOULD BE BLUE/DARK */}
        <div className="bg-slate-900 p-10 text-center relative">
          <div className="relative z-10">
            <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/40">
              <Activity className="text-white h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase">
              Somno<span className="text-blue-500">Track</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
              Medical Portal
            </p>
          </div>
        </div>

        {/* Form Body - This is the WHITE section */}
        <form onSubmit={handleLogin} className="p-10 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                name="identifier"
                type="text" 
                placeholder="Email" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
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
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            {isLoading ? 'VERIFYING...' : 'SIGN IN'}
          </button>

          <div className="text-center pt-4">
            <Link to="/signup" className="text-slate-400 text-xs font-bold hover:text-blue-600 uppercase tracking-tighter transition-colors">
              Request Staff Access
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;