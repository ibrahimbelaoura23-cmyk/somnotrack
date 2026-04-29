import React, { useState, useEffect } from 'react';
import { Activity, Users, Search, ChevronRight, LogOut, PlusCircle, BarChart3, Stethoscope, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const data = await patientService.getAllPatients();
        const formattedData = data.map(p => ({
          id: p.id,
          firstName: p.first_name,
          lastName: p.last_name,
          nationalId: p.national_id
        }));
        setPatients(formattedData);
      } catch (error) {
        console.error("Fetch error:", error);
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
    <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] text-[#1e293b]">
      
      {/* HEADER */}
      <nav className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-500" />
          <span className="font-bold tracking-tighter text-lg">SomnoTrack <span className="text-blue-500 text-xs uppercase ml-1">MD</span></span>
        </div>
        <div className="flex gap-6 items-center">
            <Link to="/analysis" className="text-xs font-bold text-slate-400 hover:text-white uppercase">Analysis</Link>
            <button onClick={handleLogout} className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                <LogOut size={18} />
            </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto w-full flex-1">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Database Records</p>
            <p className="text-3xl font-black text-slate-800">{patients.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
            <p className="text-xl font-black text-green-600 uppercase">Live Connection</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">System</p>
            <p className="text-xl font-black text-blue-600 uppercase">Doctor Mode</p>
          </div>
        </div>

        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">Physician Portal</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Medical Record Management</p>
          </div>
          <Link to="/add-patient" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-blue-200">
            + New Patient
          </Link>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <input 
              type="text" 
              placeholder="Filter by name or ID..."
              className="w-full max-w-sm px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Full Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">National ID</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                    <tr><td colSpan="3" className="p-20 text-center font-bold text-slate-400 animate-pulse">SYNCING DATABASE...</td></tr>
                ) : filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{p.firstName} {p.lastName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.nationalId}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                        Consult Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;