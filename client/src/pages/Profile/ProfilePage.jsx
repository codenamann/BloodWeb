import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Droplets,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Save,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BLOOD_GROUPS } from '../../utils/compatibility';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';
import ClayAvatar from '../../components/ClayAssets/ClayAvatar';

export const ProfilePage = () => {
  const { currentUser, updateProfile, toggleAvailability } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bloodGroup: currentUser?.bloodGroup || 'O+',
    city: currentUser?.location?.city || 'new york',
    area: currentUser?.location?.area || 'Central District',
  });
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      location: {
        ...currentUser?.location,
        city: formData.city.toLowerCase(),
        area: formData.area,
      },
    });
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3500);
  };

  const reliability = currentUser?.totalVolunteers
    ? Math.round((currentUser.successfulDonations / currentUser.totalVolunteers) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-16">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Header Profile Hero Card */}
        <div className="clay-card p-5 sm:p-8 bg-white shadow-2xl space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-stone-100">
            
            <div className="flex items-center gap-3.5 sm:gap-5">
              <ClayAvatar type={currentUser?.avatarType || 'sarah'} size={64} showBadge={true} badgeColor="crimson" />
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h1 className="text-xl sm:text-3xl font-black text-[#1c1d22]">{currentUser?.name}</h1>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-black flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#575965] font-semibold mt-0.5">
                  {currentUser?.email} • {currentUser?.roleTag}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full clay-btn-crimson text-[11px] sm:text-xs font-black">
                    Type {currentUser?.bloodGroup || 'O+'}
                  </span>
                  <span className="text-xs font-bold text-[#747682]">
                    {currentUser?.location?.area}, {currentUser?.location?.city}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="clay-btn-cream px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-[#1c1d22] cursor-pointer w-full sm:w-auto"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>

          </div>

          {/* Donor Availability Master Control */}
          <div className="p-3.5 sm:p-5 rounded-3xl bg-[#faf7f2] border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#d93829] fill-[#d93829]" />
                <h3 className="font-black text-xs sm:text-sm text-[#1c1d22]">Donor Availability Broadcast</h3>
              </div>
              <p className="text-[11px] sm:text-xs text-[#575965] font-medium leading-relaxed max-w-lg">
                When active, your profile appears in emergency matching queries and you will receive priority SOS alerts for compatible patients within 10km.
              </p>
            </div>

            <button
              onClick={() => toggleAvailability()}
              className={`w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md shrink-0 ${
                currentUser?.availability
                  ? 'clay-btn-crimson bg-emerald-600 text-white'
                  : 'clay-btn-cream text-slate-700'
              }`}
            >
              {currentUser?.availability ? 'Status: Available (Ready)' : 'Status: Paused'}
            </button>
          </div>

          {/* Success Feedback */}
          {saveFeedback && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile information successfully updated!</span>
            </div>
          )}

          {/* Edit Form / Details */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3.5 sm:space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-sm sm:text-base font-black text-[#1c1d22]">Update Profile &amp; Blood Data</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
                  Blood Group
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                  {BLOOD_GROUPS.map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodGroup: group })}
                      className={`h-9 sm:h-10 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                        formData.bloodGroup === group
                          ? 'clay-btn-crimson text-white scale-105 shadow-sm'
                          : 'clay-btn-cream text-slate-700'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-1">
                    Area / District
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#575965] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto clay-btn-crimson px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          ) : null}

        </div>

        {/* Reliability & Donation Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
          <div className="clay-card-flat p-4 sm:p-5 bg-white space-y-1">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Total Volunteers</span>
            <div className="text-2xl sm:text-3xl font-black text-[#1c1d22]">{currentUser?.totalVolunteers || 0}</div>
            <p className="text-[10px] sm:text-[11px] text-[#747682] font-semibold">Emergency dispatches accepted</p>
          </div>

          <div className="clay-card-flat p-4 sm:p-5 bg-white space-y-1">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Successful Donations</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{currentUser?.successfulDonations || 0}</div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold">Completed transfusions</p>
          </div>

          <div className="clay-card-flat p-4 sm:p-5 bg-white space-y-1">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Reliability Score</span>
            <div className="text-2xl sm:text-3xl font-black text-[#d93829]">{reliability}%</div>
            <p className="text-[10px] sm:text-[11px] text-[#747682] font-semibold">Platform rating</p>
          </div>
        </div>

        {/* Donation Guidelines Card */}
        <div className="clay-card p-4 sm:p-6 bg-white space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#1c1d22]">
            <Award className="w-4 h-4 text-[#d93829]" />
            <span>BloodWeb Donor Integrity Standard</span>
          </div>
          <p className="text-xs text-[#575965] leading-relaxed font-medium">
            Whole blood donations require a 56-day interval between donations to safeguard donor health. Keep your availability status up to date so hospitals and patients receive rapid, accurate responses.
          </p>
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;
