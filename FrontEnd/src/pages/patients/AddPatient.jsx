import React, { useState } from 'react';
import { FileText, User, Scale, CheckSquare, Activity, Search } from 'lucide-react';
import { patientService } from '../../services/patientService';

const SYMPTOMS = [
  "Somnolence diurne excessive", "Ronflements", "Pauses respiratoires nocturnes",
  "Fatigue matinale", "Céphalées", "Irritabilité", "Polyurie nocturne",
  "Hypersudation nocturne", "Réveils en sursaut", "Accès nocturnes de suffocation",
  "Troubles mnésiques", "Troubles de la concentration", "Vertiges", "Dyspnée",
  "Fatigue", "Sécheresse buccale", "Palpitations nocturnes", "Syndrome dépressif",
  "Troubles de la libido", "Rhinite allergique", "Hallucinations"
];

// Grouped Antecedents based on your CSV
const ANTECEDENTS = {
  "Cardiology": ["HTA", "HTA Sévère", "Cardiopathie Ischémique", "Insuffisance Cardiaque", "ACFA", "AVC", "Stent Coronaire", "Pacemaker", "Angor"],
  "Endocrinology": ["Diabète Type 1", "Diabète Type 2", "Hypothyroïdie", "Hyperthyroïdie", "Obésité", "Obésité Morbide", "Dyslipidémie", "Syndrome Métabolique"],
  "Respiratory": ["Asthme", "BPCO", "Embolie Pulmonaire", "HTAP", "Tuberculose"],
  "Neurology/Psych": ["Épilepsie", "Maladie de Parkinson", "Dépression", "Schizophrénie", "Démence"],
  "Other": ["Insuffisance Rénale", "PTI", "MICI", "Ulcère / Gastrite", "Cancer", "Drépanocytose", "Scoliose"]
};

const AddPatient = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    phone: '',
    weight: '',
    height: '',
    selectedSymptoms: [],
    selectedAntecedents: []
  });

  const [antFilter, setAntFilter] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'firstName' || name === 'lastName') && !/^[a-zA-ZÀ-ÿ-\s]*$/.test(value)) return;
    if (name === 'nationalId' && (!/^[0-9]*$/.test(value) || value.length > 18)) return;
    if (name === 'phone' && (!/^[0-9]*$/.test(value) || value.length > 10)) return;
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
    
    if (formData.nationalId.length < 18) {
        alert("National ID must be 18 digits.");
        return;
    }
    
    try {
        const response = await patientService.registerPatient(formData);
        console.log("Patient saved:", response);
        
        if (response.success) {
            alert("Patient registered successfully!");
            // Optional: Clear form or redirect
            // window.location.href = '/patients';
        } else {
            alert("Failed to save patient: " + response.error);
        }
    } catch (error) {
        console.error("Error saving patient:", error);
        alert("Cannot connect to server. Is backend running?");
    }
};

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold tracking-tight">Patient Clinical Registration</h2>
          </div>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
            Step 1: Intake & History
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12 text-left">
          
          {/* Identity & Biometrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-blue-600 font-bold border-b pb-2">
                <User size={18} /> <h3>Administrative Identity</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" value={formData.firstName} onChange={handleInputChange} required />
                <input name="lastName" placeholder="Last Name" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" value={formData.lastName} onChange={handleInputChange} required />
                <input name="nationalId" placeholder="National ID (18 digits)" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" value={formData.nationalId} onChange={handleInputChange} required />
                <input name="phone" placeholder="Phone (10 digits)" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 font-bold border-b pb-2">
                <Scale size={18} /> <h3>Biometrics</h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute right-3 top-3 text-slate-400">kg</span>
                  <input name="weight" type="number" placeholder="Weight" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" onChange={handleInputChange} />
                </div>
                <div className="relative">
                  <span className="absolute right-3 top-3 text-slate-400">cm</span>
                  <input name="height" type="number" placeholder="Height" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" onChange={handleInputChange} />
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Signs (Symptoms) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold border-b pb-2">
              <CheckSquare size={18} /> <h3>Reported Symptoms</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SYMPTOMS.map(s => (
                <button 
                  key={s} type="button" 
                  onClick={() => toggleItem('selectedSymptoms', s)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${formData.selectedSymptoms.includes(s) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Antecedents (Categorized) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Activity size={18} /> <h3>Medical Antecedents</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(ANTECEDENTS).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{category}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => (
                      <button 
                        key={item} type="button"
                        onClick={() => toggleItem('selectedAntecedents', item)}
                        className={`px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${formData.selectedAntecedents.includes(item) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end pt-8">
            <button type="submit" className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl transition-all active:scale-95">
              COMPLETE REGISTRATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;