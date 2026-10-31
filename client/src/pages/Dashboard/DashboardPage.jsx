import React, { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Heart,
  Droplets,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Search,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  Bell,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../../components/ui/toast.js';
import { useBloodRequests } from '../../context/BloodRequestContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import {
  ClayHandsHeart,
  ClayCalendar,
  ClayDropCharacter,
} from '../../components/ClayAssets/ClayIllustrations';
import { useAuth } from '../../context/AuthContext.jsx';
import { isDonorCompatible } from '../../utils/compatibility';
import BloodGroupCard from '../../components/Dashboard/BloodGroupCard.jsx';
import LocationCard from '../../components/Dashboard/LocationCard.jsx';
import AvailabilityCard from '../../components/Dashboard/AvailabilityCard.jsx';

export const DashboardPage = () => {
  const { currentUser, toggleAvailability, refreshProfile } = useAuth();
  const { requests } = useBloodRequests();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const [impactTimeframe, setImpactTimeframe] = useState('All Time');

  // Refresh profile metrics on mount
  React.useEffect(() => {
    refreshProfile?.();
  }, [refreshProfile]);

  // Filter emergency requests to active/actionable emergencies matching user's blood type (excluding self-created)
  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
  const matchingRequests = requests.filter((req) => {
    const creatorId = (req.createdBy?._id || req.createdBy?.id || req.createdBy)?.toString();
    if (currentUserId && creatorId === currentUserId) return false;
    // Terminal requests are no longer active emergency dispatches
    if (req.status && req.status !== 'ACTIVE' && req.status !== 'PARTIALLY_FULFILLED') {
      return false;
    }
    if (currentUser?.bloodGroup) {
      return isDonorCompatible(currentUser.bloodGroup, req.patientBloodGroup);
    }
    return true;
  });

  // Recent 3 requests from matching pool
  const recentRequests = matchingRequests.slice(0, 3);
  const recentNotifs = notifications.slice(0, 3);

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-100 text-[#d93829] font-black';
      case 'HIGH':
        return 'bg-amber-100 text-amber-900 font-bold';
      default:
        return 'bg-blue-100 text-blue-900 font-bold';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'URGENT';
      case 'HIGH':
        return 'HIGH';
      default:
        return 'NORMAL';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good  afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto w-full">
      {/* ========================================================================= */}
      {/* 1. GREETING HEADER & MOTIVATIONAL QUOTE */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[#1c1d22] tracking-normal flex items-center gap-2">
            {getGreeting()}, {currentUser?.name?.split(' ')[0]}!{' '}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 font-semibold mt-1">
            Here's what's happening on BloodWeb today.
          </p>
        </div>

        {/* Inspirational Quote Card */}
        <div className="clay-card-flat px-4 py-3 bg-white/80 max-w-sm flex items-center gap-3 shadow-xs">
          <span className="text-xl">✨</span>
          <div className="text-xs">
            <p className="font-bold text-stone-800 italic">
              "The gift of blood is the gift of life."
            </p>
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
              — Unknown
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP THREE STATUS CARDS + IMPACT SIDEBAR ROW */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main 2-Col Span: 3 Quick Status Cards */}
        <div className="w-full lg:w-4/5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Blood Group */}
          <BloodGroupCard
            bloodGroup={currentUser?.bloodGroup}
            onSet={() => navigate('/profile')}
          />

          {/* Card 2: Donation Availability */}
          <AvailabilityCard
            availability={currentUser?.availability}
            onToggle={toggleAvailability}
          />

          {/* Card 3: Location */}
          <LocationCard
            location={currentUser?.location}
            onSet={() => navigate('/profile')}
          />
        </div>

        {/* Right Column: Your Impact Card */}
        <div className="w-full lg:w-1/3 clay-card p-5 bg-white/95 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Your Impact
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">
              <span>{impactTimeframe}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center text-[#d93829]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-stone-700">
                  Lives Helped
                </span>
              </div>
              <span className="text-sm font-black text-stone-900">
                {currentUser?.successfulDonations || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-700">
                  Requests Supported
                </span>
              </div>
              <span className="text-sm font-black text-stone-900">
                {currentUser?.totalVolunteers || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-700">
                  Days as a Donor
                </span>
              </div>
              <span className="text-sm font-black text-stone-900">
                {currentUser?.createdAt
                  ? differenceInDays(
                      new Date(),
                      new Date(currentUser.createdAt)
                    )
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HERO BANNER: "BE SOMEONE'S SECOND CHANCE" + UPCOMING ACTIONS */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Hero Banner (2-Cols) */}
        <div className="w-full lg:w-3/4 clay-card p-6 md:p-8 bg-gradient-to-r from-red-50/90 via-orange-50/50 to-white/95 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden border border-red-100/50">
          <div className="flex flex-col gap-3 text-center md:text-left z-10 max-w-md">
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[10px] font-black uppercase tracking-wider">
              Community Emergency Dispatch
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
              Be Someone's Second Chance
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Your willingness to help can give someone a healthier tomorrow.
              Explore active blood requests in your region.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/donors')}
                className="clay-btn-crimson px-5 py-2.5 text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer inline-flex w-fit mx-auto md:mx-0"
              >
                <span>Explore Requests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Clay Hands Illustration */}
          <div className="shrink-0 flex items-center justify-center relative">
            <ClayHandsHeart size={160} />
          </div>
        </div>

        {/* Upcoming Actions Card (1-Col) */}
        <div className="w-full lg:w-1/3 clay-card p-6 bg-white/95 flex flex-col justify-between text-center shadow-sm">
          <div className="flex items-center gap-2 text-stone-800 pb-3 border-b border-stone-100 text-left">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-black uppercase tracking-wider">
              Upcoming Actions
            </span>
          </div>

          <div className="my-auto py-6 space-y-3">
            <div className="flex justify-center">
              <ClayCalendar size={72} />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900">
                No upcoming Actions
              </h4>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                You're all caught up!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RECENT BLOOD REQUESTS + RECENT NOTIFICATIONS GRID */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left 2-Cols: Recent Blood Requests */}
        <div className="w-full lg:w-3/4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-black text-stone-900 tracking-tight">
              Recent Blood Requests
            </h3>
            <Link
              to="/requests"
              className="text-xs font-black text-[#d93829] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentRequests.length === 0 ? (
              <div className="clay-card p-6 text-center bg-white/95 text-stone-500 space-y-1 shadow-xs">
                <p className="text-xs font-bold text-stone-700">No emergency requests matching your blood type right now</p>
                <p className="text-[11px] text-stone-400">
                  {currentUser?.bloodGroup
                    ? `We will notify you immediately when a patient in need matches ${currentUser.bloodGroup}.`
                    : 'Update your blood type in your profile to receive matching donation requests.'}
                </p>
              </div>
            ) : (
              recentRequests.map((req) => (
                <div
                  key={req._id}
                  onClick={() => navigate(`/requests/${req._id}`)}
                  className="clay-card p-4 md:p-5 bg-white/95 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Blood Group Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d93829] font-black text-base flex items-center justify-center shrink-0 shadow-xs border border-red-100">
                      {req.patientBloodGroup}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-sm font-black text-stone-900">
                        {req.unitsNeeded}{' '}
                        {req.unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
                      </div>
                      <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[180px] md:max-w-xs">
                          {req.hospitalName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-3 shrink-0 mt-2 md:mt-0">
                    <div className="text-left md:text-right flex md:block items-center gap-2 md:gap-0">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getUrgencyBadge(req.urgency)}`}
                      >
                        {getUrgencyLabel(req.urgency)}
                      </span>
                      <div className="text-[10px] text-stone-500 font-semibold mt-1">
                        Needed by {req.neededBy || 'Today'}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-50 text-stone-400 group-hover:text-stone-700">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1-Col: Recent Notifications + Quote Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-black text-stone-900 tracking-tight">
              Recent Notifications
            </h3>
            <Link
              to="/notifications"
              className="text-xs font-black text-[#d93829] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentNotifs.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  if (n.redirectUrl) navigate(n.redirectUrl);
                }}
                className="clay-card p-3.5 bg-white/95 flex items-start justify-between gap-3 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5 text-[#d93829]" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-stone-900 leading-tight">
                      {n.title}
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5 line-clamp-1">
                      {n.body}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0 mt-2" />
              </div>
            ))}
          </div>

          {/* Clay Sitting Drop Character Quote Card */}
          <div className="clay-card p-4 bg-white/95 flex items-center gap-3 shadow-xs">
            <div className="shrink-0 w-16 h-16 flex items-center justify-center">
              <ClayDropCharacter size={56} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-stone-800 italic">
                "You don't have to be a doctor to save lives."
              </p>
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                — Just a Donor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. QUICK ACTIONS TOOLBAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/requests/create')}
            className="clay-card p-4 bg-white/95 flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-[#d93829] shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 group-hover:text-[#d93829] transition-colors">
                Create Blood Request
              </h4>
              <p className="text-[11px] text-stone-500 font-medium">
                Request blood for someone in need &gt;
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/donors')}
            className="clay-card p-4 bg-white/95 flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 group-hover:text-blue-700 transition-colors">
                Discover Requests
              </h4>
              <p className="text-[11px] text-stone-500 font-medium">
                Find and volunteer for requests &gt;
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="clay-card p-4 bg-white/95 flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 group-hover:text-amber-700 transition-colors">
                Update Profile
              </h4>
              <p className="text-[11px] text-stone-500 font-medium">
                Keep your information current &gt;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
