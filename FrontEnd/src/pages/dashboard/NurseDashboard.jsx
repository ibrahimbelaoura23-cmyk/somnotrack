import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Calendar, 
  LogOut, 
  UserCircle,
  Activity,
  FileText,
  Clock,
  CalendarPlus
} from 'lucide-react';
import { patientService } from '../../services/patientService';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ firstName: "Staff", lastName: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          firstName: parsed.firstName || parsed.first_name || "Staff",
          lastName: parsed.lastName || parsed.last_name || ""
        });
      } catch (e) { console.error("Session error"); }
    }

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
      style={{ backgroundColor: '#f8fafc', minHeight: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 9999, color: '#0f172a', textAlign: 'left' }}
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Clinical Nurse</p>
              <p className="text-sm font-bold text-slate-700">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <UserCircle size={32} className="text-slate-300" />
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Nurse Portal</h1>
            <p className="text-slate-500 font-medium tracking-tight">Clinical Management & Appointments</p>
          </div>
          
          {/* ADDED: APPOINTMENT BUTTON */}
          <button 
            onClick={() => navigate('/appointments')}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            <CalendarPlus size={18} /> Schedule Appointment
          </button>
        </div>

        {/* --- STATS & SCHEDULE GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Count */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Records</p>
              <p className="text-2xl font-black text-slate-900">{patients.length}</p>
            </div>
          </div>

          {/* Appointments Quick View */}
          <div 
            onClick={() => navigate('/appointments')}
            className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-700">Today's Rendez-vous</h3>
              </div>
              <span className="text-[10px] font-black text-blue-600 group-hover:underline">Open Calendar</span>
            </div>
            <div className="flex gap-4">
              <div className="w-full p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center gap-3">
                <Clock size={16} className="text-slate-300" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to manage daily schedule</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PATIENT LIST --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search dossiers by name or National ID..."
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
                  <th className="px-8 py-5 text-center">Quick Action</th>
                  <th className="px-8 py-5 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="3" className="px-8 py-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Loading...</td></tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-black text-slate-800 uppercase italic">{p.first_name} {p.last_name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {p.national_id}</p>
                      </td>
                      {/* ADDED: QUICK APPOINTMENT BUTTON PER PATIENT */}
                      <td className="px-8 py-5 text-center">
                        <button 
                          onClick={() => navigate(`/appointments?patient=${p.id}`)}
                          className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                          title="Schedule Rendez-vous"
                        >
                          <CalendarPlus size={20} />
                        </button>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => navigate(`/patient/${p.id}`)}
                          className="px-6 py-2.5 bg-white border border-slate-200 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                          View
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
      
      <footer className="mt-auto py-6 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">SomnoTrack • Nurse Management Level</p>
      </footer>
    </div>
  );
};

export default NurseDashboard;