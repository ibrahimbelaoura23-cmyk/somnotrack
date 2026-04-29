import React, { useState } from 'react';
import { FileText, User, Scale, CheckSquare, Activity, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const SYMPTOMS = ["Somnolence diurne excessive", "Ronflements", "Pauses respiratoires nocturnes", "Fatigue matinale", "Céphalées", "Irritabilité", "Polyurie nocturne", "Hypersudation nocturne", "Réveils en sursaut", "Accès nocturnes de suffocation", "Troubles mnésiques", "Troubles de la concentration", "Vertiges", "Dyspnée", "Fatigue", "Sécheresse buccale", "Palpitations nocturnes", "Syndrome dépressif", "Troubles de la libido", "Rhinite allergique", "Hallucinations"];

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
    weight: '', age: '', selectedSymptoms: [], selectedAntecedents: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // --- STRICT LIMITS ---
    // 1. National ID: Only digits, max 18
    if (name === 'nationalId') {
      if (!/^\d*$/.test(value) || value.length > 18) return;
    }
    // 2. Phone: Only digits, max 10
    if (name === 'phone') {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    // 3. Age: Max 3 digits (standard clinical cap)
    if (name === 'age' && value.length > 3) return;

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
    if (formData.nationalId.length !== 18) return alert("National ID must be exactly 18 digits.");
    
    try {
      const response = await patientService.registerPatient(formData);
      if (response) {
        alert("Patient Saved Successfully");
        navigate('/doctor-dashboard');
      }
    } catch (err) {
      alert("Registration failed. Ensure backend is active.");
    }
  };

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
        overflowY: 'auto'
      }}
    >
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden text-left">
          
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-xl border border-slate-700 text-blue-400">
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-black uppercase tracking-tight italic">New Patient Record</h2>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] border-b pb-2">
                  <User size={14} /> Identity Information
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="firstName" placeholder="First Name" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-medium" value={formData.firstName} onChange={handleInputChange} required />
                  <input name="lastName" placeholder="Last Name" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-medium" value={formData.lastName} onChange={handleInputChange} required />
                  <input name="nationalId" placeholder="National ID (18 digits)" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-mono" value={formData.nationalId} onChange={handleInputChange} required />
                  <input name="phone" placeholder="Phone (10 digits)" className="p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] border-b pb-2">
                  <Scale size={14} /> Biometrics
                </div>
                <div className="space-y-4">
                  <input name="weight" type="number" placeholder="Weight (kg)" className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900" value={formData.weight} onChange={handleInputChange} />
                  <div className="relative">
                    <Calendar className="absolute right-4 top-4 text-slate-400" size={16} />
                    <input name="age" type="number" placeholder="Patient Age" className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900" value={formData.age} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] border-b pb-2">Reported Symptoms</div>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map(s => (
                  <button key={s} type="button" onClick={() => toggleItem('selectedSymptoms', s)}
                    className={`text-[10px] px-3 py-2 rounded-xl font-bold uppercase transition-all border ${formData.selectedSymptoms.includes(s) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}
                  > {s} </button>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] border-b pb-2">Medical History</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(ANTECEDENTS).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(item => (
                        <button key={item} type="button" onClick={() => toggleItem('selectedAntecedents', item)}
                          className={`px-2 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${formData.selectedAntecedents.includes(item) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
                        > {item} </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-8 flex justify-end">
              <button type="submit" className="px-16 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 uppercase text-xs tracking-widest transition-transform active:scale-95">
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;