import React, { useState } from 'react';
import { FileText, User, Scale, CheckSquare, Activity, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const SYMPTOMS = [
  "Somnolence diurne excessive", "Ronflements", "Pauses respiratoires nocturnes",
  "Fatigue matinale", "Céphalées", "Irritabilité", "Polyurie nocturne",
  "Hypersudation nocturne", "Réveils en sursaut", "Accès nocturnes de suffocation",
  "Troubles mnésiques", "Troubles de la concentration", "Vertiges", "Dyspnée",
  "Fatigue", "Sécheresse buccale", "Palpitations nocturnes", "Syndrome dépressif",
  "Troubles de la libido", "Rhinite allergique", "Hallucinations"
];

const ANTECEDENTS = {
  "Cardiology": ["HTA", "HTA Sévère", "Cardiopathie Ischémique", "Insuffisance Cardiaque", "ACFA", "AVC", "Stent Coronaire", "Pacemaker", "Angor"],
  "Endocrinology": ["Diabète Type 1", "Diabète Type 2", "Hypothyroïdie", "Hyperthyroïdie", "Obésité", "Obésité Morbide", "Dyslipidémie", "Syndrome Métabolique"],
  "Respiratory": ["Asthme", "BPCO", "Embolie Pulmonaire", "HTAP", "Tuberculose"],
  "Neurology/Psych": ["Épilepsie", "Maladie de Parkinson", "Dépression", "Schizophrénie", "Démence"],
  "Other": ["Insuffisance Rénale", "PTI", "MICI", "Ulcère / Gastrite", "Cancer", "Drépanocytose", "Scoliose"]
};

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', nationalId: '', phone: '',
    weight: '', height: '', selectedSymptoms: [], selectedAntecedents: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleItem = (listName, item) => {
    setFormData(prev => {
      const list = prev[listName];
      const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
      return { ...prev, [listName]: newList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nationalId.length < 18) return alert("National ID must be 18 digits.");
    try {
      const response = await patientService.registerPatient(formData);
      if (response) {
        alert("Patient registered successfully!");
        navigate('/doctor-dashboard');
      }
    } catch (error) {
      alert("Connection error. Check if Flask is running.");
    }
  };

  return (
    /* FORCE BACKGROUND AND TEXT COLOR VIA INLINE STYLE */
    <div 
      style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', width: '100%' }}
      className="py-10 px-4 flex flex-col items-center"
    >
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-slate-800 rounded-xl transition-all border border-slate-700 text-blue-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-black uppercase tracking-tight">Clinical Registration</h2>
            </div>
          </div>
          <button onClick={() => navigate('/doctor-dashboard')} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          
          {/* Identity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest border-b border-slate-100 pb-2">
                <User size={16} /> Patient Identity
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} required />
                <input name="lastName" placeholder="Last Name" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} required />
                <input name="nationalId" placeholder="National ID (18 digits)" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" onChange={handleInputChange} required />
                <input name="phone" placeholder="Phone Number" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} required />
              </div>
            </div>

            {/* Biometrics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest border-b border-slate-100 pb-2">
                <Scale size={16} /> Biometrics
              </div>
              <div className="space-y-4">
                <input name="weight" type="number" placeholder="Weight (kg)" className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
                <input name="height" type="number" placeholder="Height (cm)" className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest border-b border-slate-100 pb-2">
              <CheckSquare size={16} /> Clinical Signs
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {SYMPTOMS.map(s => (
                <button 
                  key={s} type="button" 
                  onClick={() => toggleItem('selectedSymptoms', s)}
                  className={`text-[10px] p-2 rounded-xl font-bold uppercase transition-all border ${formData.selectedSymptoms.includes(s) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Antecedents */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest border-b border-slate-100 pb-2">
              <Activity size={16} /> Medical History
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(ANTECEDENTS).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <button 
                        key={item} type="button"
                        onClick={() => toggleItem('selectedAntecedents', item)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${formData.selectedAntecedents.includes(item) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-10 flex justify-end">
            <button type="submit" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 uppercase text-xs tracking-widest transition-transform active:scale-95">
              Save Patient File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;