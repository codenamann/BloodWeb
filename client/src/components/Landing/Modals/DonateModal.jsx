import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, Check, Sparkles, Droplets } from 'lucide-react';
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
  Card,
} from '../../ui';

export const DonateModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    bloodGroup: 'O+',
    avatarType: 'alex',
    age: 24,
    city: 'New York',
    weightEligible: true,
    lastDonationMonths: 'More than 3 months ago',
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const avatarOptions = [
    { type: 'alex', label: 'Male Style 1' },
    { type: 'sarah', label: 'Female Style 1' },
    { type: 'david', label: 'Glasses' },
    { type: 'elena', label: 'Female Style 2' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent onClose={onClose}>
        {step === 1 ? (
          <div>
            <DialogHeader>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl clay-card-flat bg-red-50 text-[#d93829] shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-[#d93829]" />
              </div>
              <div>
                <DialogTitle>Become a Blood Donor</DialogTitle>
                <DialogDescription>
                  Join 50,000+ lifesavers ready to answer emergency calls
                </DialogDescription>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>

              {/* Avatar Type Picker */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Choose Your 3D Clay Avatar
                </label>
                <div className="flex items-center justify-between gap-2 bg-white/50 p-2.5 rounded-2xl border border-slate-200">
                  {avatarOptions.map((av) => (
                    <button
                      key={av.type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, avatarType: av.type })
                      }
                      className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
                        formData.avatarType === av.type
                          ? 'ring-2 ring-[#d93829] bg-red-50/50 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Avatar clayType={av.type} size={40} showBadge={false} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                  Your Blood Group
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                  {bloodTypes.map((type) => {
                    const isActive = formData.bloodGroup === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, bloodGroup: type })
                        }
                        className={`relative h-9 sm:h-10 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer hover:opacity-90 ${
                          isActive
                            ? 'text-white scale-105'
                            : 'clay-btn-cream text-slate-700'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="donate-modal-blood-group"
                            className="absolute inset-0 clay-btn-crimson text-white transition-none!"
                            style={{ borderRadius: 12 }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 40,
                            }}
                          />
                        )}
                        <span className="relative z-10">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* City & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                    City / Neighborhood
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g. San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965] mb-1.5">
                    Age (18-65)
                  </label>
                  <Input
                    type="number"
                    min="18"
                    max="65"
                    required
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Quick Health Checklist */}
              <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold text-xs">
                    Donor Eligibility Standard
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-600">
                  By joining, you confirm you are in good general health, weigh
                  over 50kg (110 lbs), and haven't donated whole blood in the
                  past 56 days.
                </p>
              </div>

              <Button
                type="submit"
                variant="crimson"
                size="lg"
                className="w-full"
              >
                Complete Registration & Activate ID
              </Button>
            </form>
          </div>
        ) : (
          /* Step 2: Instant 3D Clay Donor Card */
          <div className="text-center space-y-5 sm:space-y-6 py-2">
            <div className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <DialogTitle className="text-center">
                You're Officially a Lifesaver!
              </DialogTitle>
              <DialogDescription className="text-center">
                Here is your verified BloodWeb Community Donor Card
              </DialogDescription>
            </div>

            {/* Tactile Clay Donor Card */}
            <Card
              variant="elevated"
              className="p-4 sm:p-6 bg-gradient-to-br from-white via-[#faf6f0] to-[#f4ebe0] text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d93829]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-[#d93829]" />
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#1c1d22]">
                    BloodWeb Verified Donor
                  </span>
                </div>
                <Badge
                  variant="emerald"
                  className="text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1"
                >
                  <Check className="w-3 h-3 stroke-[3]" /> Active
                </Badge>
              </div>

              <div className="flex items-center gap-3 my-2 sm:my-3">
                <Avatar
                  clayType={formData.avatarType}
                  size={52}
                  showBadge={true}
                  badgeColor="crimson"
                />
                <div>
                  <h4 className="text-base sm:text-lg font-black text-[#1c1d22]">
                    {formData.fullName || 'Anonymous Donor'}
                  </h4>
                  <p className="text-xs text-[#575965]">
                    {formData.city} • Verified Ready
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="crimson" className="text-xs font-black">
                      Type {formData.bloodGroup}
                    </Badge>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">
                      ID: #BW-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-[#575965]">
                <span className="text-[11px]">
                  Emergency Broadcast:{' '}
                  <strong className="text-emerald-600 font-bold">
                    Enabled (10km)
                  </strong>
                </span>
                <Award className="w-4 h-4 text-[#d93829]" />
              </div>
            </Card>

            <Button
              variant="crimson"
              size="lg"
              onClick={onClose}
              className="w-full"
            >
              Enter Community Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonateModal;
