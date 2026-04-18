import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Activity className="text-white h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          Somno<span className="text-blue-600">Track</span>
        </span>
      </Link>

      {/* Right Side - Navigation Links */}
      <div className="flex items-center gap-6">
        <Link to="/add-patient" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
          Add Patient
        </Link>
        <button className="text-sm font-semibold bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;