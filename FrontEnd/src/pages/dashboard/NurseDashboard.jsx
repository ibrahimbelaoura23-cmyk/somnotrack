import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Calendar, 
  Search, 
  ChevronRight, 
  LogOut,
  Database
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const NurseDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // FETCH DATA FROM FLASK -> SUPABASE
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const data = await patientService.getAllPatients();
        
        // Mapping Supabase snake_case (from main.py) to React camelCase
        const formattedData = data.map(p => ({
          id: p.id,
          firstName: p.first_name,
          lastName: p.last_name,
          nationalId: p.national_id
        }));

        setPatients(formattedData);
      } catch (error) {
        console.error("Database connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nationalId?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full font-sans text-slate-900">
      
      {/* 1. NAVIGATION (Professional Medical Header) */}
      <nav className="bg-slate-900 text-white px-6 py-4 shadow-xl flex items-center justify-between sticky top-0 z-50 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-black tracking-widest uppercase text-sm">
            Somno<span className="text-blue-500">Track</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/nurse-dashboard" className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-wider">
            <Users size={14} /> Patient Dossiers
          </Link>
          <Link to="/appointments" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-[10px] uppercase tracking-wider">
            <Calendar size={14} /> Appointments
          </Link>
        </div>

        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
        >
          <span className="hidden sm:inline">Logout</span>
          <LogOut size={18} />
        </button>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Clinical Records</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Database size={12} className="text-blue-500" />
              Verified Database Connection
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black uppercase">
              Clinical Staff Mode
            </span>
          </div>
        </div>

        {/* 3. SEARCH & FILTER */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-all" />
          <input 
            type="text" 
            placeholder="Search by Name or National ID..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-slate-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 4. DATA TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden w-full">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Retrieving Clinical Data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">National ID</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-700 capitalize">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Medical Record Active</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                          {patient.nationalId}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-tighter">
                          Open File
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPatients.length === 0 && (
                <div className="p-24 text-center">
                  <Users size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No patient records found in the system</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-slate-300 text-[9px] font-bold uppercase tracking-[0.4em]">
        SomnoTrack v1.0 • Secure Clinical Information System
      </footer>
    </div>
  );
};

export default NurseDashboard;