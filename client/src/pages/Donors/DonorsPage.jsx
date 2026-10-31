import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  ShieldCheck,
  Heart,
  Users,
  Filter,
  CheckCircle2,
  ArrowRight,
  Clock,
  Building,
  SlidersHorizontal,
  RotateCcw,
  ChevronRight,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { BLOOD_GROUPS, isDonorCompatible } from '../../utils/compatibility';

import {
  ClayHandsHeart,
  ClayCharacterBoy,
  ClayDropCharacter,
  ClayMapPin,
} from '../../components/ClayAssets/ClayIllustrations';

export const DonorsPage = () => {
  const { currentUser } = useAuth();
  const { requests } = useBloodRequests();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filters State
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [radiusKm, setRadiusKm] = useState(25);
  const [unitsFilter, setUnitsFilter] = useState('ANY'); // 'ANY' | '1' | '2' | '3+'
  const [sortBy, setSortBy] = useState('NEAREST'); // 'NEAREST' | 'URGENT' | 'NEWEST'
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  React.useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Base list of requests enriched with distance simulation
  const enrichedRequests = requests.map((req, idx) => {
    const distanceKm = Math.round((2.5 + idx * 2.2) * 10) / 10;
    return {
      ...req,
      distanceKm,
    };
  });

  // Filter logic
  const filtered = enrichedRequests.filter((req) => {
    // Blood Group
    if (selectedBloodGroup !== 'ALL' && req.patientBloodGroup !== selectedBloodGroup) {
      return false;
    }

    // Urgency
    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) {
      return false;
    }

    // Radius distance
    if (req.distanceKm > radiusKm) {
      return false;
    }

    // Units needed
    if (unitsFilter === '1' && req.unitsNeeded !== 1) return false;
    if (unitsFilter === '2' && req.unitsNeeded !== 2) return false;
    if (unitsFilter === '3+' && req.unitsNeeded < 3) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHosp = req.hospitalName?.toLowerCase().includes(q);
      const matchAddress = req.hospitalAddress?.toLowerCase().includes(q);
      const matchBg = req.patientBloodGroup?.toLowerCase().includes(q);
      if (!matchHosp && !matchAddress && !matchBg) return false;
    }

    return true;
  });

  // Sorting
  const sortedRequests = [...filtered].sort((a, b) => {
    if (sortBy === 'NEAREST') return a.distanceKm - b.distanceKm;
    if (sortBy === 'URGENT') {
      const priority = { CRITICAL: 3, HIGH: 2, NORMAL: 1 };
      return (priority[b.urgency] || 1) - (priority[a.urgency] || 1);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleResetFilters = () => {
    setSelectedBloodGroup('ALL');
    setSelectedUrgency('ALL');
    setRadiusKm(25);
    setUnitsFilter('ANY');
    setSearchQuery('');
    setSortBy('NEAREST');
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-100 text-[#d93829] font-black';
      case 'HIGH':
        return 'bg-amber-100 text-amber-900 font-bold';
      default:
        return 'bg-emerald-100 text-emerald-800 font-bold';
    }
  };

  return (
    <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & INSPIRATIONAL BANNER */}
        {/* ========================================================================= */}
        <div className="clay-card p-6 sm:p-8 bg-gradient-to-r from-red-50/80 via-white to-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-red-100/50">
          <div className="space-y-2 text-center md:text-left z-10 max-w-lg">
            <span className="text-[10px] font-black text-[#d93829] uppercase tracking-wider">
              ← DISCOVER REQUESTS
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1c1d22] tracking-tight">
              Find a way to help.
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Real people. Real needs. Real impact. Find blood requests near you and save lives.
            </p>
          </div>

          {/* 3D Boy Holding Blood Drop */}
          <div className="shrink-0 flex items-center justify-center">
            <ClayCharacterBoy size={140} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THREE-COLUMN DISCOVERY GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 1: LEFT FILTERS PANEL */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-1 space-y-5">
            <div className="clay-card p-5 bg-white/95 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#d93829]" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-stone-400 hover:text-[#d93829] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Blood Group Grid */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-stone-700 block">Blood Group</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['ALL', ...BLOOD_GROUPS].map((bg) => {
                    const isActive = selectedBloodGroup === bg;
                    return (
                      <button
                        key={bg}
                        onClick={() => setSelectedBloodGroup(bg)}
                        className={`relative py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                          isActive ? 'text-white' : 'bg-[#faf7f2] text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="donors-blood-group"
                            className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                            style={{ borderRadius: 12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                          />
                        )}
                        <span className="relative z-10">{bg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location & Radius Slider */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-stone-700">Distance Radius</label>
                  <span className="text-xs font-black text-[#d93829]">Within {radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-[#d93829] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold">
                  <span>5 km</span>
                  <span>100 km</span>
                </div>
              </div>

              {/* Urgency Filter */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold text-stone-700 block">Urgency Level</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'ALL', label: 'All Urgencies' },
                    { id: 'NORMAL', label: 'Normal' },
                    { id: 'HIGH', label: 'High' },
                    { id: 'CRITICAL', label: 'Critical SOS' },
                  ].map((u) => (
                    <label
                      key={u.id}
                      onClick={() => setSelectedUrgency(u.id)}
                      className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer p-1.5 rounded-lg hover:bg-stone-50"
                    >
                      <input
                        type="radio"
                        name="urgency"
                        checked={selectedUrgency === u.id}
                        onChange={() => setSelectedUrgency(u.id)}
                        className="accent-[#d93829]"
                      />
                      <span>{u.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Units Needed */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold text-stone-700 block">Units Needed</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['ANY', '1', '2', '3+'].map((u) => {
                    const isActive = unitsFilter === u;
                    return (
                      <button
                        key={u}
                        onClick={() => setUnitsFilter(u)}
                        className={`relative py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                          isActive ? 'text-white' : 'bg-[#faf7f2] text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="donors-units-needed"
                            className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                            style={{ borderRadius: 12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                          />
                        )}
                        <span className="relative z-10">{u}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Map Pin Card */}
            <div className="clay-card p-5 bg-white/95 text-center space-y-2 shadow-xs">
              <div className="flex justify-center">
                <ClayMapPin size={90} />
              </div>
              <h4 className="text-xs font-black text-[#d93829]">More People. More Hope.</h4>
              <p className="text-[11px] text-stone-500 font-medium">Find requests near you and be the reason someone smiles tomorrow.</p>
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 2: CENTER REQUESTS LIST (2-COLS) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Results Counter & Sort By Toolbar */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-stone-900">
                {sortedRequests.length} {sortedRequests.length === 1 ? 'Request' : 'Requests'} Found
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-xs font-black bg-white rounded-xl border border-stone-200 text-stone-800 cursor-pointer focus:outline-none shadow-xs"
                >
                  <option value="NEAREST">Nearest First</option>
                  <option value="URGENT">Most Urgent</option>
                  <option value="NEWEST">Newest</option>
                </select>
              </div>
            </div>

            {/* Requests Cards Stream */}
            {sortedRequests.length === 0 ? (
              <div className="clay-card p-12 text-center bg-white space-y-3 shadow-xs">
                <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-black text-stone-900">No Matching Requests</h3>
                <p className="text-xs text-stone-500">
                  Try adjusting your distance radius or blood group filters to discover more requests.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="clay-btn-cream px-4 py-2 text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedRequests.map((req) => (
                  <div
                    key={req._id}
                    onClick={() => navigate(`/requests/${req._id}`)}
                    className="clay-card p-4 sm:p-5 bg-white/95 flex items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Blood Group Pill */}
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d93829] font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-red-100 group-hover:scale-105 transition-transform">
                        {req.patientBloodGroup}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-stone-900 group-hover:text-[#d93829] transition-colors">
                            {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'} of {req.patientBloodGroup}
                          </span>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] uppercase tracking-wider ${getUrgencyBadge(req.urgency)}`}>
                            {req.urgency}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 font-medium flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-stone-400" />
                          <span>{req.hospitalName}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#d93829]" />
                          <span>{req.distanceKm} km away</span>
                          <span>• Needed by {req.neededBy || 'Today'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50 text-stone-400 group-hover:text-stone-800">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 3: RIGHT ACTION CARDS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-1 space-y-5">
            
            {/* Make a Difference Card */}
            <div className="clay-card p-5 bg-white/95 text-center space-y-3 shadow-xs">
              <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                Make a Difference
              </h4>
              <div className="flex justify-center">
                <ClayHandsHeart size={120} />
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Your willingness to donate can give someone a second chance at life.
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="w-full clay-btn-crimson py-2.5 text-xs font-black shadow-md cursor-pointer"
              >
                Be a Donor →
              </button>
            </div>

            {/* Eligibility Guidelines */}
            <div className="clay-card p-5 bg-white/95 space-y-2.5 shadow-xs">
              <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                Not Sure If You're Eligible?
              </h4>
              <p className="text-xs text-stone-500 font-medium">
                Check basic eligibility criteria before you volunteer to donate blood.
              </p>
              <button
                onClick={() => alert('Basic Eligibility: Age 18-65, Weight > 50kg, Haemoglobin > 12.5 g/dL, no recent tattoos/surgeries in past 6 months.')}
                className="w-full clay-btn-cream py-2 text-xs font-bold text-stone-800"
              >
                View Guidelines →
              </button>
            </div>

            {/* Character Sign Card */}
            <div className="clay-card p-4 bg-white/95 flex items-center gap-3 shadow-xs">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                <ClayDropCharacter size={50} />
              </div>
              <div className="text-xs">
                <div className="font-black text-[#d93829]">Same Blood</div>
                <div className="font-bold text-stone-800">Stronger People</div>
              </div>
            </div>

          </div>

        </div>

      </div>
  );
};

export default DonorsPage;
