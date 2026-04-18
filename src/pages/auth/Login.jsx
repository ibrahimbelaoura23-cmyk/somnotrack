import React, { useState } from 'react';
import { Lock, User, Activity } from 'lucide-react';
import { ROLES } from '../../constants/roles';

const Login = () => {
  const [credentials, setCredentials] = useState({ name: '', password: '', role: ROLES.DOCTOR });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <Activity className="text-white h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Clinic Portal</h2>
          <p className="text-slate-500 text-sm">Sign in to manage respiratory studies</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User Role</label>
            <select 
              value={credentials.role}
              onChange={(e) => setCredentials({...credentials, role: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {Object.values(ROLES).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-blue-200 transition-all">
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New staff member? <a href="/signup" className="text-blue-600 font-semibold hover:underline">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;