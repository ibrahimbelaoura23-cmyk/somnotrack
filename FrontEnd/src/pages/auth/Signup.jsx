import React from 'react';
import { UserPlus, Mail, ShieldCheck } from 'lucide-react';
import { ROLES } from '../../constants/roles';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Staff Registration</h2>
        
        <form className="space-y-4">
          <div className="relative">
            <UserPlus className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <select className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Select Assigned Role</option>
              {Object.values(ROLES).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="password" placeholder="Password" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Confirm" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-all mt-4">
            Register Staff
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;