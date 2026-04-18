import React, { useState } from 'react';
import { FileText, User, Scale, Ruler, ClipboardList } from 'lucide-react';

const AddPatient = () => {
  // Adding state prevents some "uncontrolled input" errors that can freeze React
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    weight: '',
    height: '',
    symptoms: '',
    history: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Patient Data Saved:", formData);
    alert("Patient file initialized!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold">Manage Patient File - New Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 text-left">
          {/* Identity Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold border-b border-slate-100 pb-2">
              <User size={18} /> <h3>Personal Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="National ID (Required)" 
                className="p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
              />
            </div>
          </section>

          {/* Biometrics Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold border-b border-slate-100 pb-2">
              <Scale size={18} /> <h3>Physical Measurements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">kg</span>
                <input 
                  type="number" 
                  placeholder="Weight (poid)" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div className="relative">
                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">cm</span>
                <input 
                  type="number" 
                  placeholder="Height (taille)" 
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Observations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold border-b border-slate-100 pb-2">
              <ClipboardList size={18} /> <h3>Medical Observation</h3>
            </div>
            <textarea 
              placeholder="Current Symptoms..." 
              className="w-full p-3 border border-slate-300 rounded-lg h-24 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
            ></textarea>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" className="px-6 py-2 text-slate-500 hover:text-slate-700 font-medium">Discard</button>
            <button type="submit" className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all">
              Save to Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;