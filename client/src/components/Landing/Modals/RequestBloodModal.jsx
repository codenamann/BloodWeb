import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, Search, ArrowRight, ShieldCheck, MapPin, Building } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Badge,
  Button,
  Input,
  Avatar,
} from '../../ui';

export const RequestBloodModal = ({ isOpen, onClose, onSelectDonor }) => {
  const [step, setStep] = useState(1);
  const [bloodType, setBloodType] = useState('O-');
  const [urgency, setUrgency] = useState('Critical (Immediate)');
  const [hospital, setHospital] = useState('City General Hospital');
  const [units, setUnits] = useState(2);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedDonors, setMatchedDonors] = useState([]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const mockDonors = [
    { id: 1, name: 'Alex M.', type: 'alex', bloodGroup: 'O-', distance: '1.8 km', eta: '8 mins', phone: '+1 (555) 382-9912' },
    { id: 2, name: 'Sarah K.', type: 'sarah', bloodGroup: 'O-', distance: '2.4 km', eta: '12 mins', phone: '+1 (555) 749-2144' },
    { id: 3, name: 'David L.', type: 'david', bloodGroup: 'O-', distance: '3.1 km', eta: '15 mins', phone: '+1 (555) 621-8840' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setIsSearching(false);
      setMatchedDonors([]);
    }
  }, [isOpen]);

  const handleStartSearch = (e) => {
    e.preventDefault();
    setStep(2);
    setIsSearching(true);
    
    // Simulate real-time radar search
    setTimeout(() => {
      setIsSearching(false);
      setMatchedDonors(mockDonors);
    }, 2800);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent onClose={onClose}>
        {/* Modal Header */}
        <DialogHeader>
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl clay-card-flat bg-red-50 text-[#d93829] shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <DialogTitle>Emergency Blood Request</DialogTitle>
            <DialogDescription>
              Broadcasts instantly to verified donors in your vicinity
            </DialogDescription>
          </div>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleStartSearch} className="space-y-4 sm:space-y-5">
            {/* Urgency Selector */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5 sm:mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Critical', desc: '< 30 mins', color: 'border-red-400 bg-red-50/70 text-[#d93829]' },
                  { label: 'Urgent', desc: '1-3 hours', color: 'border-orange-300 bg-orange-50/70 text-orange-700' },
                  { label: 'Scheduled', desc: 'Within 24h', color: 'border-slate-200 bg-white/70 text-slate-700' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setUrgency(item.label)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      urgency === item.label
                        ? `${item.color} ring-2 ring-[#d93829]/30 shadow-sm font-bold`
                        : 'border-slate-200 bg-white/50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">{item.label}</div>
                    <div className="text-[10px] sm:text-[11px] opacity-75">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Type Selection */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5 sm:mb-2">
                Required Blood Group
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                {bloodTypes.map((type) => {
                  const isActive = bloodType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setBloodType(type)}
                      className={`relative h-10 sm:h-11 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer hover:opacity-90 ${
                        isActive ? 'text-white scale-105' : 'clay-btn-cream text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="request-modal-blood-group"
                          className="absolute inset-0 clay-btn-crimson text-white shadow-md transition-none!"
                          style={{ borderRadius: 12 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Units & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Units Needed
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4].map((num) => {
                    const isActive = units === num;
                    return (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setUnits(num)}
                        className={`relative flex-1 h-9 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer hover:opacity-90 ${
                          isActive ? 'text-white' : 'clay-btn-cream text-slate-700'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="request-modal-units"
                            className="absolute inset-0 clay-btn-crimson text-white transition-none!"
                            style={{ borderRadius: 12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                          />
                        )}
                        <span className="relative z-10">{num} {num === 1 ? 'Unit' : 'Units'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Hospital / Location
                </label>
                <Input
                  type="text"
                  required
                  icon={Building}
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="Enter hospital name"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Contact Person Name
                </label>
                <Input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Michael Miller"
                />
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Emergency Contact Phone
                </label>
                <Input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +1 555-0192"
                />
              </div>
            </div>

            {/* Safety notice */}
            <div className="flex items-center gap-2 text-xs text-[#575965] bg-red-50/60 p-2.5 sm:p-3 rounded-xl border border-red-100">
              <ShieldCheck className="w-4 h-4 text-[#d93829] shrink-0" />
              <span className="text-[11px] sm:text-xs">
                Only verified donors within 10km will receive instant SOS push alerts.
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="crimson"
              size="lg"
              className="w-full flex items-center justify-center gap-2 group"
            >
              <span>Broadcast Emergency SOS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        ) : (
          /* Step 2: Live Radar Search & Results */
          <div className="space-y-5 sm:space-y-6 py-2">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center space-y-4">
                <div className="relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36">
                  <div className="absolute inset-0 rounded-full border-2 border-[#d93829]/20 animate-ping" />
                  <div className="absolute inset-3 rounded-full border-2 border-[#d93829]/30 animate-pulse" />
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full clay-btn-crimson flex items-center justify-center shadow-lg">
                    <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#1c1d22]">Scanning 10km Radius...</h4>
                  <p className="text-xs sm:text-sm text-[#575965] mt-1">
                    Matching with eligible <span className="font-bold text-[#d93829]">{bloodType}</span> donors near {hospital}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    <span className="font-bold text-xs sm:text-sm text-[#1c1d22]">3 Verified Donors Mobilized</span>
                  </div>
                  <Badge variant="emerald" className="text-[10px] sm:text-xs">
                    ETA: 8-15 mins
                  </Badge>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {matchedDonors.map((donor) => (
                    <motion.div
                      key={donor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="clay-card-flat p-3 sm:p-3.5 flex items-center justify-between bg-white hover:bg-amber-50/20 transition-all gap-2"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <Avatar clayType={donor.type} size={42} showBadge={true} badgeColor="green" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-xs sm:text-sm text-[#1c1d22]">{donor.name}</h5>
                            <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[9px] font-extrabold">
                              {donor.bloodGroup}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#575965] mt-0.5">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {donor.distance}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">ETA {donor.eta}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="crimson"
                        size="sm"
                        onClick={() => {
                          alert(`Connecting you directly with ${donor.name} (${donor.phone}). SOS dispatch confirmed!`);
                          onClose();
                        }}
                      >
                        Call Donor
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-2 flex gap-2.5 sm:gap-3">
                  <Button
                    variant="cream"
                    onClick={() => setStep(1)}
                    className="flex-1 text-xs"
                  >
                    Edit Details
                  </Button>
                  <Button
                    variant="crimson"
                    onClick={onClose}
                    className="flex-1 text-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestBloodModal;
