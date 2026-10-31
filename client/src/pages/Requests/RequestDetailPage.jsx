import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  Heart,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  FileText,
  Phone,
  MessageSquare,
  Share2,
  Trash2,
  Check,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { isDonorCompatible, getCompatibleDonorGroups } from '../../utils/compatibility';

import ClayAvatar from '../../components/ClayAssets/ClayAvatar';
import ClayBloodDrop from '../../components/ClayAssets/ClayBloodDrop';
import { ClayHandsHeart, ClayCalendar } from '../../components/ClayAssets/ClayIllustrations';
import { HospitalDocumentPreview } from '../../components/HospitalDocumentPreview';

export const RequestDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const {
    getRequestById,
    volunteerForRequest,
    updateVolunteerStatus,
    updateRequestStatus,
  } = useBloodRequests();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'VOLUNTEERS' | 'UPDATES' | 'COORDINATION'
  const [shareFeedback, setShareFeedback] = useState(false);

  const request = getRequestById(id);

  if (!request) {
    return (
      <AppShell activeNav="My Requests">
        <div className="clay-card p-12 text-center bg-white space-y-4 max-w-xl mx-auto my-12">
          <Droplets className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-xl font-black text-stone-900">Blood Request Not Found</h2>
          <p className="text-xs text-stone-500">The request may have been removed or does not exist.</p>
          <Link to="/requests" className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-block">
            Return to Requests
          </Link>
        </div>
      </AppShell>
    );
  }

  const isRequester = request.createdBy?._id === currentUser?._id;
  const isCompatible = currentUser?.bloodGroup && isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup);
  const myResponse = request.responses?.find((resp) => resp.donorId === currentUser?._id);
  const alreadyVolunteered = !!myResponse;
  const acceptedVolunteers = request.responses?.filter((r) => r.status === 'ACCEPTED') || [];
  const fulfilledUnits = acceptedVolunteers.length;
  const unitsNeeded = request.unitsNeeded || 1;
  const remainingUnits = Math.max(0, unitsNeeded - fulfilledUnits);
  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request.status);

  const handleVolunteer = () => {
    volunteerForRequest(request._id, currentUser);
    setActiveTab('VOLUNTEERS');
  };

  const handleStatusChange = (responseId, newStatus) => {
    updateVolunteerStatus(request._id, responseId, newStatus);
  };

  const handleCancelRequest = () => {
    if (window.confirm('Are you sure you want to cancel this emergency request?')) {
      updateRequestStatus(request._id, 'CANCELLED');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 3000);
  };

  const getVolunteerBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800';
      case 'BACKUP':
        return 'bg-blue-100 text-blue-900';
      case 'WITHDRAWN':
        return 'bg-stone-100 text-stone-500';
      default:
        return 'bg-amber-100 text-amber-900';
    }
  };

  return (
    <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & BREADCRUMB */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/requests"
              className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Requests</span>
            </Link>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
                Request Details
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                request.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : request.status === 'CANCELLED'
                  ? 'bg-red-100 text-[#d93829]'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {request.status?.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-xs text-stone-500 font-medium mt-1">
              Request ID: <span className="font-bold text-stone-800">#{request._id}</span> • Created on {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Requester Actions / Donor Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isRequester && !isTerminal && (
              <button
                onClick={handleCancelRequest}
                className="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-[#d93829] text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Request</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/coordination/${request._id}`)}
              className="clay-btn-crimson px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Coordination Room</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN REQUEST HERO CARD */}
        {/* ========================================================================= */}
        <div className="clay-card p-6 sm:p-8 bg-white/95 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            
            {/* Blood Type & Units */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-red-50 text-[#d93829] font-black text-2xl sm:text-3xl flex flex-col items-center justify-center shrink-0 shadow-xs border border-red-100">
                <span>{request.patientBloodGroup}</span>
                <span className="text-[8px] font-bold text-stone-400 uppercase">TYPE</span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    request.urgency === 'CRITICAL' ? 'bg-red-100 text-[#d93829]' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {request.urgency} URGENCY
                  </span>
                  <span className="text-xs text-stone-400 font-bold">
                    Needed by <span className="text-stone-800 font-extrabold">{request.neededBy}</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {request.unitsNeeded} {request.unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
                </h2>
                <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#d93829]" />
                  <span>For a patient at <strong className="text-stone-800">{request.hospitalName}</strong></span>
                </p>
              </div>
            </div>

            {/* 3D Clay Hands Illustration in Hero */}
            <div className="hidden md:flex shrink-0">
              <ClayHandsHeart size={140} />
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2 overflow-x-auto">
            {[
              { id: 'OVERVIEW', label: 'Overview' },
              { id: 'VOLUNTEERS', label: `Volunteers (${request.responses?.length || 0})` },
              { id: 'COORDINATION', label: 'Coordination Room' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'COORDINATION') {
                      navigate(`/coordination/${request._id}`);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`relative px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap hover:opacity-90 ${
                    isActive ? 'text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="request-detail-tab"
                      className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                      style={{ borderRadius: 12 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ======================================================================= */}
          {/* TAB CONTENT: OVERVIEW */}
          {/* ======================================================================= */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2-Cols: Info Cards */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Hospital Information Card */}
                <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
                      <Building className="w-4 h-4 text-[#d93829]" />
                      <span>Hospital Information</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified Center
                    </span>
                  </div>
                  <div className="text-sm font-black text-stone-900">{request.hospitalName}</div>
                  <p className="text-xs text-stone-500 font-medium">{request.hospitalAddress || 'Bengaluru, KA'}</p>
                </div>

                {/* Request Details & Requester Note */}
                <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                  <div className="text-xs font-black text-stone-900 uppercase tracking-wider">
                    Clinical Context & Instructions
                  </div>
                  <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-stone-100 italic">
                    "{request.patientCondition || 'Emergency blood requirement for surgery.'}"
                  </p>
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-500 font-medium">Request Creator:</span>
                    <span className="font-bold text-stone-800">{request.createdBy?.name || 'Requester'}</span>
                  </div>
                </div>

                {/* Hospital Document Preview */}
                {request.hospitalDocument && (
                  <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                    <div className="text-xs font-black text-stone-900 uppercase tracking-wider">
                      Supporting Document
                    </div>
                    <HospitalDocumentPreview document={request.hospitalDocument} />
                  </div>
                )}

                {/* Donor Volunteer Action if not requester */}
                {!isRequester && (
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                        Donor Response Status
                      </h4>
                      {isCompatible && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Compatible Donor ({currentUser?.bloodGroup})
                        </span>
                      )}
                    </div>

                    {alreadyVolunteered ? (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-xs font-black text-emerald-800">
                            You have volunteered for this request
                          </div>
                          <p className="text-[11px] text-stone-600 font-medium">
                            Status: <strong className="uppercase">{myResponse?.status}</strong> • Coordination is open.
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/coordination/${request._id}`)}
                          className="clay-btn-crimson px-4 py-2 text-xs font-bold shadow-md cursor-pointer"
                        >
                          Open Coordination Room
                        </button>
                      </div>
                    ) : !isCompatible && currentUser?.bloodGroup ? (
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-100 text-xs font-semibold text-stone-600 border border-stone-200">
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Your blood group ({currentUser.bloodGroup}) does not match patient's needed blood group ({request.patientBloodGroup}).</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-xs text-stone-600 font-medium">
                          Can you donate blood for this emergency? Your response connects directly with the requester.
                        </p>
                        <button
                          onClick={handleVolunteer}
                          className="clay-btn-crimson px-5 py-2.5 text-xs font-black shadow-lg cursor-pointer shrink-0"
                        >
                          Volunteer to Donate
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Right 1-Col: Progress Gauge & Quick Actions */}
              <div className="space-y-4">
                
                {/* Progress Gauge */}
                <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-center space-y-3">
                  <div className="text-xs font-black text-stone-900 uppercase tracking-wider text-left">
                    Request Progress
                  </div>
                  
                  <div className="relative w-28 h-28 mx-auto flex flex-col items-center justify-center rounded-full bg-white shadow-inner border-4 border-red-100">
                    <span className="text-xl font-black text-stone-900">{fulfilledUnits} / {unitsNeeded}</span>
                    <span className="text-[9px] font-bold text-stone-400 uppercase">Units Fulfilled</span>
                  </div>

                  <div className="space-y-1.5 text-xs font-semibold text-stone-600 text-left pt-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d93829]" /> Donated Units:</span>
                      <span className="font-bold text-stone-900">{fulfilledUnits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-300" /> Units Remaining:</span>
                      <span className="font-bold text-stone-900">{remainingUnits}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions List */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2">
                  <div className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2">
                    Quick Actions
                  </div>
                  <button
                    onClick={handleShare}
                    className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2"><Share2 className="w-4 h-4 text-stone-500" /> Share Request</span>
                    {shareFeedback && <span className="text-[10px] text-emerald-600 font-bold">Link Copied!</span>}
                  </button>
                  <button
                    onClick={() => navigate(`/coordination/${request._id}`)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-[#d93829]" />
                    <span>Coordination Room</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB CONTENT: VOLUNTEERS */}
          {/* ======================================================================= */}
          {activeTab === 'VOLUNTEERS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-stone-900">
                  Volunteers Responded ({request.responses?.length || 0})
                </h3>
              </div>

              {!request.responses || request.responses.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 font-medium">
                  No volunteers have responded yet. Compatible donors are notified.
                </div>
              ) : (
                <div className="space-y-3">
                  {request.responses.map((resp) => {
                    const isSelf = resp.donorId === currentUser?._id;

                    return (
                      <div
                        key={resp._id}
                        className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <ClayAvatar type={resp.donor?.avatarType || 'alex'} size={44} showBadge={false} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-stone-900">
                                {resp.donor?.name || 'Verified Donor'} {isSelf && '(You)'}
                              </span>
                              <span className="px-2 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[10px] font-black">
                                {resp.donor?.bloodGroup || request.patientBloodGroup}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getVolunteerBadge(resp.status)}`}>
                                {resp.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                              Distance: <strong className="text-stone-700">{resp.estimatedDistanceKm || '2.4'} km away</strong> • Responded {new Date(resp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        {/* Status Change Controls for Requester */}
                        {isRequester && resp.status !== 'WITHDRAWN' && (
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {resp.status !== 'ACCEPTED' && (
                              <button
                                onClick={() => handleStatusChange(resp._id, 'ACCEPTED')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                              >
                                Accept Donor
                              </button>
                            )}
                            {resp.status !== 'BACKUP' && (
                              <button
                                onClick={() => handleStatusChange(resp._id, 'BACKUP')}
                                className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer transition-colors"
                              >
                                Set as Backup
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
  );
};

export default RequestDetailPage;
