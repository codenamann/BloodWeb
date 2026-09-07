import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Building,
  MapPin,
  Clock,
  Heart,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  FileText,
  PhoneCall,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { isDonorCompatible, getCompatibleDonorGroups } from '../../utils/compatibility';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';
import ClayAvatar from '../../components/ClayAssets/ClayAvatar';

export const RequestDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { getRequestById, getMatchingDonorsForRequest, volunteerForRequest, updateVolunteerStatus } = useBloodRequests();
  const navigate = useNavigate();

  const request = getRequestById(id);

  if (!request) {
    return (
      <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22]">
        <AppNavbar />
        <div className="max-w-2xl mx-auto pt-20 text-center space-y-4 px-4">
          <Droplets className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-black">Blood Request Not Found</h2>
          <Link to="/requests" className="clay-btn-crimson px-6 py-2.5 text-xs font-bold inline-block">
            Return to Requests
          </Link>
        </div>
      </div>
    );
  }

  const isRequester = request.createdBy?._id === currentUser?._id;
  const isCompatible = currentUser?.bloodGroup && isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup);
  const alreadyVolunteered = request.responses?.some((resp) => resp.donorId === currentUser?._id);
  const compatibleGroups = getCompatibleDonorGroups(request.patientBloodGroup);
  const matchingDonors = getMatchingDonorsForRequest(request);

  const handleVolunteer = () => {
    volunteerForRequest(request._id, currentUser);
    navigate(`/coordination/${request._id}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-16">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Back Button */}
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#575965] hover:text-[#1c1d22] transition-colors p-2 rounded-xl clay-btn-cream"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>

        {/* ========================================================================= */}
        {/* 1. TOP MAIN REQUEST HERO BANNER */}
        {/* ========================================================================= */}
        <div className="clay-card-elevated p-5 sm:p-8 bg-white shadow-2xl border border-white space-y-5 sm:space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 sm:pb-6 border-b border-stone-100">
            
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl clay-card-crimson flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
                <span className="text-xl sm:text-3xl font-black leading-none">{request.patientBloodGroup}</span>
                <span className="text-[8px] sm:text-[10px] font-bold opacity-80 mt-0.5">TYPE</span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                    request.urgency === 'CRITICAL' ? 'bg-red-100 text-[#d93829]' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {request.urgency} Urgency
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold">
                    Status: {request.status}
                  </span>
                </div>

                <h1 className="text-lg sm:text-3xl font-black text-[#1c1d22]">
                  Requirement: {request.unitsNeeded} Units of {request.patientBloodGroup} Blood
                </h1>

                <p className="text-xs sm:text-sm text-[#575965] font-semibold">
                  Needed: <strong className="text-[#1c1d22]">{request.neededBy}</strong> • ID #{request._id}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
              <button
                onClick={() => navigate(`/coordination/${request._id}`)}
                className="clay-btn-crimson w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enter Live Coordination Room</span>
              </button>
            </div>

          </div>

          {/* Key Facts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
            
            {/* Hospital Fact */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#faf7f2] border border-stone-200/70 space-y-1">
              <div className="flex items-center gap-2 font-black text-[#1c1d22]">
                <Building className="w-4 h-4 text-slate-400" />
                <span>Hospital Location</span>
              </div>
              <p className="font-extrabold text-[#1c1d22] truncate">{request.hospitalName}</p>
              <p className="text-[#747682] truncate">{request.hospitalAddress}</p>
            </div>

            {/* Requester Profile */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#faf7f2] border border-stone-200/70 space-y-1">
              <div className="flex items-center gap-2 font-black text-[#1c1d22]">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>Requester Contact</span>
              </div>
              <p className="font-extrabold text-[#1c1d22]">{request.createdBy?.name}</p>
              <p className="text-[#747682]">{request.createdBy?.phone} • Verified Kin</p>
            </div>

            {/* Compatible Groups */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#faf7f2] border border-stone-200/70 space-y-1">
              <div className="flex items-center gap-2 font-black text-[#1c1d22]">
                <Droplets className="w-4 h-4 text-[#d93829]" />
                <span>Eligible Donor Groups</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {compatibleGroups.map((g) => (
                  <span key={g} className="px-2 py-0.2 rounded-md bg-white text-[#d93829] font-black text-[11px] sm:text-xs border border-red-200">
                    {g}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {request.patientCondition && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 font-medium">
              <strong>Medical Reason:</strong> {request.patientCondition}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. DONOR PERSPECTIVE VOLUNTEER CTA (If User is Donor & Not Creator) */}
        {/* ========================================================================= */}
        {!isRequester && (
          <div className="clay-card p-5 sm:p-8 bg-gradient-to-r from-red-50/80 via-white to-red-50/80 border border-red-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[10px] sm:text-xs font-black">
                <Heart className="w-3.5 h-3.5 fill-[#d93829]" />
                <span>Donor Action Center</span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-[#1c1d22]">
                {alreadyVolunteered ? "You are an active volunteer for this request!" : isCompatible ? "Your blood is compatible with this emergency!" : "You can share or coordinate this requirement"}
              </h3>
              <p className="text-xs text-[#575965] font-medium max-w-xl">
                {alreadyVolunteered
                  ? "You have already joined this coordination group. Enter the live room to coordinate arrival with the hospital ward."
                  : "Volunteering notifies the patient's family immediately and unlocks the shared coordination room."}
              </p>
            </div>

            {alreadyVolunteered ? (
              <button
                onClick={() => navigate(`/coordination/${request._id}`)}
                className="clay-btn-crimson w-full md:w-auto px-6 py-3 text-xs sm:text-sm font-bold shadow-lg cursor-pointer shrink-0"
              >
                Open Coordination Room
              </button>
            ) : (
              <button
                onClick={handleVolunteer}
                className="clay-btn-crimson w-full md:w-auto px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer shrink-0"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Volunteer to Donate Now</span>
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. REQUEST RESPONSES & MATCHED DONORS SECTION */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: Volunteer Responses Received */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1c1d22]">Volunteer Responses ({request.responses?.length || 0})</h3>
              <p className="text-xs text-[#575965] font-medium">Donors who have stepped forward for this request</p>
            </div>

            {(!request.responses || request.responses.length === 0) ? (
              <div className="clay-card-flat p-6 sm:p-8 text-center bg-white text-xs text-slate-400 font-medium">
                No donor responses yet. The system is broadcasting to nearby matching volunteers.
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {request.responses.map((resp) => (
                  <div
                    key={resp._id}
                    className="clay-card-flat p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <ClayAvatar type={resp.donor?.avatarType || 'alex'} size={44} showBadge={true} badgeColor="green" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs sm:text-sm text-[#1c1d22]">{resp.donor?.name || 'Verified Donor'}</h4>
                          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[9px] sm:text-[10px] font-black">
                            {resp.donor?.bloodGroup || 'O-'}
                          </span>
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#575965] font-semibold mt-0.5">
                          {resp.estimatedDistanceKm} km away • ETA {resp.eta}
                        </div>
                        <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-md text-[9px] sm:text-[10px] font-black ${
                          resp.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Status: {resp.status}
                        </span>
                      </div>
                    </div>

                    {isRequester && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {resp.status !== 'ACCEPTED' && (
                          <button
                            onClick={() => updateVolunteerStatus(request._id, resp._id, 'ACCEPTED')}
                            className="flex-1 sm:flex-none px-3 py-1.5 clay-btn-crimson text-xs font-bold shadow-sm cursor-pointer"
                          >
                            Accept Donor
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/coordination/${request._id}`)}
                          className="flex-1 sm:flex-none px-3 py-1.5 clay-btn-cream text-xs font-bold cursor-pointer"
                        >
                          Chat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Discovered Matching Donors Network */}
          <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1c1d22]">Nearby Matching Donors ({matchingDonors.length})</h3>
              <p className="text-xs text-[#575965] font-medium">Ranked by Proximity (70%) + Reliability (30%)</p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {matchingDonors.map((donor) => (
                <div
                  key={donor._id}
                  className="clay-card-flat p-3 bg-white flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <ClayAvatar type={donor.avatarType} size={38} showBadge={false} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-[#1c1d22]">{donor.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-red-100 text-[#d93829] text-[9px] font-black">
                          {donor.bloodGroup}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#747682] font-semibold">
                        {donor.distanceKm} km • {donor.totalVolunteers} donations ({Math.round(donor.rankScore * 100)}% match)
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default RequestDetailPage;
