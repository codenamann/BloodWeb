import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Heart,
  Plus,
  ArrowRight,
  AlertCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  MessageSquare,
  ShieldCheck,
  Building,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { isDonorCompatible } from '../../utils/compatibility';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';
import ClayAvatar from '../../components/ClayAssets/ClayAvatar';

export const DashboardPage = () => {
  const { currentUser, toggleAvailability } = useAuth();
  const { requests, volunteerForRequest } = useBloodRequests();
  const navigate = useNavigate();

  // Requests created by current user
  const myCreatedRequests = requests.filter((r) => r.createdBy?._id === currentUser?._id);

  // Active emergency requests that match current user's blood group as donor
  const compatibleRequests = requests.filter((r) => {
    if (!currentUser?.bloodGroup) return false;
    return isDonorCompatible(currentUser.bloodGroup, r.patientBloodGroup) && r.createdBy?._id !== currentUser?._id;
  });

  // Recent requests in network
  const recentRequests = requests.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-16">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. TOP GREETING & PERSONALIZED STATUS BAR */}
        {/* ========================================================================= */}
        <div className="clay-card p-5 sm:p-8 bg-white/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-xl">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <ClayAvatar type={currentUser?.avatarType || 'sarah'} size={56} showBadge={true} badgeColor="crimson" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
                  Welcome, {currentUser?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[11px] sm:text-xs font-black">
                  Type {currentUser?.bloodGroup || 'O+'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#575965] font-medium mt-0.5">
                {currentUser?.location?.area || 'Metro District'}, {currentUser?.location?.city || 'New York'} • {currentUser?.roleTag}
              </p>
            </div>
          </div>

          {/* Donor Readiness Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-[#faf7f2] border border-stone-200/80 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold text-[#1c1d22]">Donor Emergency Status</div>
                <div className="text-[10px] text-[#747682] font-semibold">
                  {currentUser?.availability ? 'Available for instant broadcasts' : 'Paused / Inactive'}
                </div>
              </div>

              <button
                onClick={() => toggleAvailability()}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  currentUser?.availability
                    ? 'clay-btn-crimson bg-emerald-600 text-white shadow-md'
                    : 'clay-btn-cream text-slate-700'
                }`}
              >
                {currentUser?.availability ? 'Active' : 'Paused'}
              </button>
            </div>

            <button
              onClick={() => navigate('/requests/create')}
              className="clay-btn-crimson px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Request</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ROLE-ADAPTIVE SPOTLIGHT SECTION */}
        {/* ========================================================================= */}

        {/* CASE A: USER HAS AN ACTIVE BLOOD REQUEST CREATED (e.g. Sarah) */}
        {myCreatedRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card-elevated p-5 sm:p-8 bg-gradient-to-br from-white via-[#faf6f0] to-[#f4ebe0] border border-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d93829]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 relative z-10">
              
              <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-100 text-[#d93829] text-[10px] sm:text-xs font-extrabold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-ping text-[#d93829]" />
                    Your Active Emergency Request
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-black uppercase">
                    {myCreatedRequests[0].urgency} Urgency
                  </span>
                </div>

                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-[#1c1d22]">
                    Need {myCreatedRequests[0].unitsNeeded} Units of {myCreatedRequests[0].patientBloodGroup} Blood
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#575965] font-semibold mt-1">
                    <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-400" /> {myCreatedRequests[0].hospitalName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {myCreatedRequests[0].neededBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white shadow-sm border border-stone-200/60 flex items-center gap-2 font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{myCreatedRequests[0].responses?.length || 0} Donors Responded</span>
                  </div>
                  <span className="text-[11px] text-[#747682] font-semibold hidden sm:inline">
                    Live Coordination Room Open
                  </span>
                </div>
              </div>

              {/* Action Buttons for Requester */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full lg:w-auto">
                <button
                  onClick={() => navigate(`/coordination/${myCreatedRequests[0]._id}`)}
                  className="clay-btn-crimson px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enter Coordination Room</span>
                </button>

                <button
                  onClick={() => navigate(`/requests/${myCreatedRequests[0]._id}`)}
                  className="clay-btn-cream px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-[#1c1d22] flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                >
                  <span>Manage Request</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* CASE B: COMPATIBLE EMERGENCY DONATION MATCH */}
        {compatibleRequests.length > 0 && currentUser?._id !== 'user-sarah' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card p-5 sm:p-7 bg-red-50/70 border border-red-200/80 shadow-xl"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl clay-card-crimson flex items-center justify-center text-white shrink-0 shadow-md">
                  <Droplets className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      Critical Match
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#d93829] font-bold">Your {currentUser?.bloodGroup} matches!</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#1c1d22] mt-0.5">
                    {compatibleRequests[0].patientBloodGroup} Needed at {compatibleRequests[0].hospitalName}
                  </h3>
                  <p className="text-xs text-[#575965] font-medium mt-0.5">
                    {compatibleRequests[0].unitsNeeded} Units required • {compatibleRequests[0].hospitalAddress}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                <button
                  onClick={() => {
                    volunteerForRequest(compatibleRequests[0]._id, currentUser);
                    navigate(`/coordination/${compatibleRequests[0]._id}`);
                  }}
                  className="clay-btn-crimson w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Volunteer & Coordinate</span>
                </button>

                <button
                  onClick={() => navigate(`/requests/${compatibleRequests[0]._id}`)}
                  className="clay-btn-cream w-full sm:w-auto px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#1c1d22] cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 3. CORE METRICS STRIP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="clay-card-flat p-3.5 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Active Requests</span>
              <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d93829]" />
            </div>
            <div className="text-xl sm:text-3xl font-black text-[#1c1d22]">{requests.length}</div>
            <p className="text-[10px] sm:text-[11px] text-[#747682] font-semibold mt-0.5">Live emergencies in network</p>
          </div>

          <div className="clay-card-flat p-3.5 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Available Donors</span>
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-3xl font-black text-[#1c1d22]">18</div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5">Within 10km radius</p>
          </div>

          <div className="clay-card-flat p-3.5 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Reliability</span>
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d93829]" />
            </div>
            <div className="text-xl sm:text-3xl font-black text-[#1c1d22]">
              {currentUser?.totalVolunteers ? Math.round((currentUser.successfulDonations / currentUser.totalVolunteers) * 100) : 100}%
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#747682] font-semibold mt-0.5">{currentUser?.totalVolunteers || 0} dispatches</p>
          </div>

          <div className="clay-card-flat p-3.5 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#747682]">Response Time</span>
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-3xl font-black text-[#1c1d22]">&lt; 8 mins</div>
            <p className="text-[10px] sm:text-[11px] text-[#747682] font-semibold mt-0.5">Avg. donor arrival ETA</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DISCOVER BLOOD REQUESTS FEED */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1c1d22] tracking-tight">Active Blood Requirements</h3>
              <p className="text-xs text-[#575965] font-medium">Real-time emergencies requiring compatible donors</p>
            </div>
            <Link to="/requests" className="text-xs font-bold text-[#d93829] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentRequests.map((req) => (
              <motion.div
                key={req._id}
                whileHover={{ y: -3 }}
                className="clay-card p-4 sm:p-5 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                      req.urgency === 'CRITICAL' ? 'bg-red-100 text-[#d93829]' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {req.urgency} Urgency
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#747682] font-semibold">{req.neededBy}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl clay-card-crimson flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                      <span className="text-base font-black leading-none">{req.patientBloodGroup}</span>
                      <span className="text-[7px] font-bold opacity-75">TYPE</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1c1d22]">
                        {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
                      </h4>
                      <p className="text-xs text-[#575965] font-medium truncate max-w-[180px] sm:max-w-[200px]">
                        {req.hospitalName}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-[#747682] font-medium bg-[#faf7f2] p-2 rounded-xl mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d93829] shrink-0" />
                    <span className="truncate">{req.hospitalAddress}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs text-emerald-700 font-bold">
                    {req.responses?.length || 0} Donors Joined
                  </span>

                  <button
                    onClick={() => navigate(`/requests/${req._id}`)}
                    className="px-3.5 py-1.5 clay-btn-crimson text-xs font-bold cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
