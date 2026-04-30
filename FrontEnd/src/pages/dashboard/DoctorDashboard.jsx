import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  ClipboardList, 
  LogOut, 
  UserCircle,
  Activity,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { patientService } from '../../services/patientService';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Default state for personalization
  const [user, setUser] = useState({ firstName: "Mohamed", lastName: "" });

  useEffect(() => {
    // 1. Grab user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          firstName: parsed.firstName || parsed.first_name || "Mohamed",
          lastName: parsed.lastName || parsed.last_name || ""
        });
      } catch (e) {
        console.error("Session data error");
      }
    }

    // 2. Fetch patient list
    const loadPatients = async () => {
      try {
        const data = await patientService.getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.national_id && String(p.national_id).includes(searchTerm))
  );

  return (
    <div 
      style={{ 
        backgroundColor: '#f8fafc', 
        minHeight: '100vh', 
        width: '100vw', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        zIndex: 9999, 
        color: '#0f172a',
        textAlign: 'left' 
      }}
      className="flex flex-col font-sans"
    >
      {/* --- NAVIGATION BAR --- */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Activity size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">
            Somno<span className="text-blue-600">Track</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r pr-6 border-slate-200">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Medical Officer</p>
              <p className="text-sm font-bold text-slate-700">
                Dr. {user.firstName} {user.lastName}
              </p>
            </div>
            <UserCircle size={32} className="text-slate-300" />
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Doctor Portal</h1>
            <p className="text-slate-500 font-medium tracking-tight">Welcome back, Dr. {user.firstName}. Patient records are synchronized.</p>
          </div>
          <button 
            onClick={() => navigate('/add-patient')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
          >
            <Plus size={18} /> Register New Patient
          </button>
        </div>

        {/* Stats & Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
              <p className="text-2xl font-black text-slate-900">{patients.length}</p>
            </div>
          </div>

          {/* ADDED: DATA ANALYSIS QUICK LINK */}
          <div 
            onClick={() => navigate('/analysis')}
            className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-all group"
          >
            <div className="bg-blue-600 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Clinical Intelligence</p>
              <p className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                Launch Analysis <ExternalLink size={14} />
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-sm font-black uppercase text-emerald-600 tracking-tighter italic">Live Database</p>
            </div>
          </div>
        </div>

        {/* Patient Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or National ID..."
              className="bg-transparent border-none outline-none w-full font-medium text-slate-600 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Full Name</th>
                  <th className="px-8 py-5">National ID</th>
                  <th className="px-8 py-5 text-center">Analysis</th>
                  <th className="px-8 py-5 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">
                      Synchronizing Records...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center font-black text-slate-300 uppercase tracking-widest">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-black text-slate-800 uppercase italic">
                          {p.first_name} {p.last_name}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                          {p.national_id}
                        </span>
                      </td>
                      {/* ADDED: TABLE ROW ANALYSIS BUTTON */}
                      <td className="px-8 py-5 text-center">
                        <button 
                          onClick={() => navigate(`/analysis/${p.id}`)}
                          className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                          title="Run Analysis"
                        >
                          <BarChart3 size={20} />
                        </button>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => navigate(`/patient/${p.id}`)}
                          className="px-6 py-2.5 bg-white border border-slate-200 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                        >
                          Consult
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;