import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Building,
  AlertCircle,
  Clock,
  FileText,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests, MOCK_HOSPITALS } from '../../context/BloodRequestContext';
import { BLOOD_GROUPS } from '../../utils/compatibility';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';

export const CreateRequestPage = () => {
  const { currentUser } = useAuth();
  const { createRequest } = useBloodRequests();
  const navigate = useNavigate();

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const [formData, setFormData] = useState({
    patientBloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalId: 'hosp-1',
    urgency: 'CRITICAL',
    neededBy: 'Immediate (Next 45 mins)',
    patientCondition: '',
    hospitalDocument: 'doctor_requisition_slip.pdf',
    contactPhone: currentUser?.phone || '+1 (555) 234-5678',
  });

  const selectedHospital = MOCK_HOSPITALS.find((h) => h.id === formData.hospitalId) || MOCK_HOSPITALS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsBroadcasting(true);

    // Simulate real-time broadcast and donor discovery
    setTimeout(() => {
      const created = createRequest(formData, currentUser);
      setIsBroadcasting(false);
      navigate(`/requests/${created._id}`);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-16">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-3xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-4 sm:space-y-6">
        
        {/* Back Button */}
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#575965] hover:text-[#1c1d22] transition-colors p-2 rounded-xl clay-btn-cream"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>

        {isBroadcasting ? (
          /* Real-time Broadcast Animation Transition */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="clay-card p-8 sm:p-12 bg-white text-center space-y-5 sm:space-y-6 shadow-2xl"
          >
            <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-[#d93829]/20 animate-ping" />
              <div className="absolute inset-3 rounded-full border-2 border-[#d93829]/30 animate-pulse" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full clay-btn-crimson flex items-center justify-center shadow-lg">
                <Droplets className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white animate-bounce" />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1c1d22]">Broadcasting to Donor Network...</h2>
              <p className="text-xs sm:text-sm text-[#575965] mt-1 max-w-md mx-auto">
                Finding compatible <strong className="text-[#d93829]">{formData.patientBloodGroup}</strong> donors within 10km of {selectedHospital.name}.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Multi-Step Creation Form */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card p-4 sm:p-8 bg-white shadow-xl space-y-5 sm:space-y-6"
          >
            
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-3.5 pb-4 border-b border-stone-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl clay-card-crimson flex items-center justify-center text-white shrink-0 shadow-md">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1c1d22] tracking-tight">
                  Create Blood Requirement
                </h1>
                <p className="text-xs text-[#575965] font-medium">
                  Connect your emergency requirement directly with verified donors
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* 1. Patient Blood Group */}
              <div>
                <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-2">
                  1. Required Patient Blood Group
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                  {BLOOD_GROUPS.map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setFormData({ ...formData, patientBloodGroup: group })}
                      className={`h-10 sm:h-11 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                        formData.patientBloodGroup === group
                          ? 'clay-btn-crimson text-white scale-105 shadow-md'
                          : 'clay-btn-cream text-slate-700'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Units Needed */}
              <div>
                <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-2">
                  2. Number of Blood Units
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, unitsNeeded: num })}
                      className={`flex-1 h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        formData.unitsNeeded === num
                          ? 'clay-btn-crimson text-white shadow-md'
                          : 'clay-btn-cream text-slate-700'
                      }`}
                    >
                      {num} {num === 1 ? 'Unit' : 'Units'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Hospital Location */}
              <div>
                <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-2">
                  3. Hospital / Medical Center
                </label>
                <div className="space-y-2">
                  {MOCK_HOSPITALS.map((hosp) => (
                    <div
                      key={hosp.id}
                      onClick={() => setFormData({ ...formData, hospitalId: hosp.id })}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        formData.hospitalId === hosp.id
                          ? 'border-[#d93829] bg-red-50/60 ring-2 ring-[#d93829]/20'
                          : 'border-stone-200 bg-[#faf7f2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                        <div className="overflow-hidden">
                          <div className="text-xs sm:text-sm font-extrabold text-[#1c1d22] truncate">{hosp.name}</div>
                          <div className="text-[10px] sm:text-xs text-[#747682] truncate">{hosp.address}</div>
                        </div>
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-[#d93829] shrink-0">{hosp.emergencyContact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Urgency & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-2">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {[
                      { id: 'CRITICAL', label: 'Critical', color: 'bg-red-50 text-[#d93829] border-red-300' },
                      { id: 'HIGH', label: 'High', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                      { id: 'NORMAL', label: 'Standard', color: 'bg-stone-50 text-slate-700 border-stone-200' },
                    ].map((urg) => (
                      <button
                        key={urg.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency: urg.id })}
                        className={`p-2 sm:p-2.5 rounded-xl text-[11px] sm:text-xs font-extrabold border transition-all cursor-pointer ${
                          formData.urgency === urg.id
                            ? `${urg.color} ring-2 ring-[#d93829]/30 font-black scale-102`
                            : 'bg-white border-stone-200 text-slate-600'
                        }`}
                      >
                        {urg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-2">
                    Needed By Timeline
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.neededBy}
                    onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                    placeholder="e.g. Within 2 hours / 4:00 PM"
                    className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                  />
                </div>
              </div>

              {/* 5. Patient Condition & Medical Note */}
              <div>
                <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
                  5. Medical Reason & Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.patientCondition}
                  onChange={(e) => setFormData({ ...formData, patientCondition: e.target.value })}
                  placeholder="e.g. Emergency surgery preparation. Room 304 Trauma Ward."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                />
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50/80 border border-red-200 text-[11px] sm:text-xs text-[#575965]">
                <ShieldCheck className="w-4 h-4 text-[#d93829] shrink-0" />
                <span>
                  Creating this request initiates live proximity matching. Eligible donors receive urgent notifications immediately.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 clay-btn-crimson font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>Broadcast Emergency Request</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

            </form>

          </motion.div>
        )}

      </main>
    </div>
  );
};

export default CreateRequestPage;
