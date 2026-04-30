import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Trash2, User, AlertCircle, Clock, FileText, Plus, Activity, HeartPulse, X
} from 'lucide-react';
import { patientService } from '../../services/patientService';

const PatientConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState("");

  const availableSymptoms = ["Snoring", "Daytime Sleepiness", "Insomnia", "Headache", "Choking", "Fatigue", "Dry Mouth"];
  const availableAntecedents = ["Hypertension", "Diabetes", "Asthma", "Cardiac Surgery", "Smoking", "Obesity", "Allergy"];

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) setUserRole(savedRole.toLowerCase().trim());

    const loadPatient = async () => {
      try {
        const data = await patientService.getPatientById(id);
        setPatient({
          ...data,
          symptoms: Array.isArray(data.symptoms) ? data.symptoms : (data.symptoms?.split(',') || []),
          antecedents: Array.isArray(data.antecedents) ? data.antecedents : (data.antecedents?.split(',') || [])
        });
      } catch (error) { console.error("Error:", error); } finally { setLoading(false); }
    };
    loadPatient();
  }, [id]);

  // Permission Checks
  const isDoctor = userRole === 'doctor';
  const isNurse = userRole === 'nurse';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const toggleItem = (listName, item) => {
    setPatient(prev => {
      const currentList = prev[listName];
      const newList = currentList.includes(item) ? currentList.filter(i => i !== item) : [...currentList, item];
      return { ...prev, [listName]: newList };
    });
  };

  const handleUpdate = async () => {
    try {
      await patientService.updatePatient(id, patient);
      alert("Database Synced.");
      setIsEditing(false);
    } catch (error) { alert("Error."); }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase">Accessing Dossier...</div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 9999, color: '#0f172a', textAlign: 'left' }} className="flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><ArrowLeft size={24} /></button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">{patient.first_name} {patient.last_name}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {isNurse ? "Nurse View-Only" : `Dossier: ${patient.national_id}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isDoctor && (
              <>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all">Modify Records</button>
                ) : (
                  <button onClick={handleUpdate} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700"><Save size={14} /> Commit Changes</button>
                )}
                <button onClick={() => { if(window.confirm("Delete?")) patientService.deletePatient(id).then(() => navigate('/doctor-dashboard'))}} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
              </>
            )}
            {isNurse && <span className="text-[10px] bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-black uppercase tracking-widest">Protected Record</span>}
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Bio Data */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 mb-6"><User size={16} className="text-blue-600" /> Administrative</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase">Age</label>
                {isEditing ? <input name="age" type="number" value={patient.age} onChange={handleInputChange} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg font-bold" /> : <p className="font-bold text-slate-800">{patient.age} Yrs</p>}
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase">Weight</label>
                {isEditing ? <input name="weight" type="number" value={patient.weight} onChange={handleInputChange} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg font-bold" /> : <p className="font-bold text-slate-800">{patient.weight} kg</p>}
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase">Contact</label>
                {isEditing ? <input name="phone" value={patient.phone} onChange={handleInputChange} className="w-full mt-1 p-2 bg-slate-50 border rounded-lg font-bold" /> : <p className="font-bold text-slate-800">{patient.phone}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Symptoms */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 mb-6"><Activity size={16} className="text-emerald-500" /> Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? availableSymptoms : patient.symptoms).map((symptom) => {
                const isSelected = patient.symptoms.includes(symptom);
                if (!isEditing && !isSelected) return null;
                return (
                  <button key={symptom} disabled={!isEditing} onClick={() => toggleItem('symptoms', symptom)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isSelected ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}
                  >
                    {symptom} {isEditing && isSelected && <X size={10} className="inline ml-1" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Antecedents */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 mb-6"><HeartPulse size={16} className="text-red-500" /> Antecedents</h3>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? availableAntecedents : patient.antecedents).map((ante) => {
                const isSelected = patient.antecedents.includes(ante);
                if (!isEditing && !isSelected) return null;
                return (
                  <button key={ante} disabled={!isEditing} onClick={() => toggleItem('antecedents', ante)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isSelected ? 'bg-red-500 text-white' : 'bg-white text-slate-300'}`}
                  >
                    {ante} {isEditing && isSelected && <X size={10} className="inline ml-1" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* SIDEBAR: HIDDEN FOR NURSES */}
        <div className="space-y-6">
          {/* THE REPORT BUTTON IS WRAPPED IN A DOCTOR CHECK */}
          {isDoctor && (
            <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
               <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-blue-400 mb-6"><FileText size={16} /> Analysis</h3>
                <button onClick={() => navigate(`/generate-report/${id}`)} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg">
                  Make a New Report
                </button>
            </section>
          )}

          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 mb-4"><Clock size={16} /> Status</h3>
            <div className="pl-4 border-l-2 border-slate-200 py-1">
              <p className="text-[10px] font-black text-slate-900 uppercase">Verification</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Cloud Synchronized</p>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
};

export default PatientConsultation;