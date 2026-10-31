import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Clock,
  Users,
  Droplets,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Trash2,
  AlertCircle,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isDonorCompatible } from '../../../utils/compatibility';

export const formatHumanDateTime = (dateVal) => {
  if (!dateVal) return 'Immediate / ASAP';
  if (
    typeof dateVal === 'string' &&
    (dateVal.includes('Immediate') ||
      dateVal.includes('mins') ||
      dateVal.includes('hours'))
  ) {
    return dateVal;
  }
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal);

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });

  return `${dateStr} at ${timeStr}`;
};

export const RequestCard = ({
  request,
  currentUser,
  currentUserId,
  onCancel,
  onVolunteer,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const acceptedVolunteers =
    request.responses?.filter((r) => r.status === 'ACCEPTED') || [];

  const reqCreatorId = (
    request.createdBy?._id ||
    request.createdBy?.id ||
    request.createdBy
  )?.toString();
  const isRequester = currentUserId && reqCreatorId === currentUserId;
  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(
    request.status
  );

  const hasVolunteered = Boolean(
    currentUserId &&
    request.responses?.some((r) => {
      const donorId = (r.donorId || r.donor?._id || r.donor?.id)?.toString();
      return donorId === currentUserId;
    })
  );

  const isCompatible = currentUser?.bloodGroup
    ? isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup)
    : true;

  const humanDeadline = formatHumanDateTime(request.neededBy);
  const responseCount = request.responses?.length || 0;

  // Restrained, premium badge rendering without rainbow pastels
  const renderStatusBadge = () => {
    const status = request.status || 'ACTIVE';
    let dotColor = 'bg-emerald-500 animate-pulse';
    let label = status.replace('_', ' ');

    if (status === 'PARTIALLY_FULFILLED') {
      dotColor = 'bg-amber-500';
      label = 'Partially Fulfilled';
    } else if (status === 'FULFILLED') {
      dotColor = 'bg-stone-500';
      label = 'Fulfilled';
    } else if (status === 'COMPLETED') {
      dotColor = 'bg-stone-400';
      label = 'Completed';
    } else if (status === 'CANCELLED') {
      dotColor = 'bg-stone-300';
      label = 'Cancelled';
    } else if (status === 'EXPIRED') {
      dotColor = 'bg-stone-300';
      label = 'Expired';
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200/80 shadow-2xs">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span>{label}</span>
      </span>
    );
  };

  const renderUrgencyBadge = () => {
    const urgency = request.urgency || 'ROUTINE';

    if (urgency === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#d93829] border border-red-200/80 shadow-2xs">
          <AlertCircle className="w-3 h-3 text-[#d93829]" />
          <span>Critical</span>
        </span>
      );
    }

    if (urgency === 'HIGH') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50/80 text-amber-900 border border-amber-200/60 shadow-2xs">
          <span>High Urgency</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200/70 shadow-2xs">
        <span>Routine</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => navigate(`/requests/${request._id}`)}
      className="clay-card p-4 sm:p-5 bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/60 shadow-sm hover:shadow-md transition-all flex flex-col gap-3.5 group cursor-pointer"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER STRIP: STATUS, URGENCY, FULFILLMENT, VOLUNTEERS + DEADLINE    */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-stone-100/90 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {renderStatusBadge()}
          {renderUrgencyBadge()}

          {/* Fulfillment Chip */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700 border border-stone-200/80 shadow-2xs">
            <Droplets className="w-3 h-3 text-[#d93829] shrink-0" />
            <span>
              <strong className="font-extrabold text-stone-900">
                {acceptedVolunteers.length} of {request.unitsNeeded}
              </strong>{' '}
              Fulfilled
            </span>
          </span>

          {/* Volunteer Count Chip */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700 border border-stone-200/80 shadow-2xs">
            <Users className="w-3 h-3 text-stone-500 shrink-0" />
            <span>
              <strong className="font-extrabold text-stone-900">
                {responseCount}
              </strong>{' '}
              {responseCount === 1 ? 'Volunteer' : 'Volunteers'}
            </span>
          </span>

          {/* Matching Blood Type Badge for compatible donors */}
          {!isRequester && isCompatible && currentUser?.bloodGroup && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Matches Blood ({currentUser.bloodGroup})</span>
            </span>
          )}

          {hasVolunteered && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>You Volunteered</span>
            </span>
          )}
        </div>

        {/* Needed By at top-right */}
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 shrink-0">
          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>
            Needed by{' '}
            <strong className="text-stone-800 font-bold">
              {humanDeadline}
            </strong>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN ROW: BLOOD GROUP TILE + DETAILS + HORIZONTALLY ALIGNED ACTIONS     */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Blood Group Tile + Request Info */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          {/* Prominent Blood Group Tile */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/80 border border-red-200/70 shadow-xs flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <span className="text-xl sm:text-2xl font-black text-[#d93829] leading-none tracking-tight">
              {request.patientBloodGroup}
            </span>
            <span className="text-[8px] font-black tracking-widest text-[#d93829]/70 uppercase mt-0.5">
              TYPE
            </span>
          </div>

          {/* Details */}
          <div className="min-w-0 space-y-1 flex-1">
            {/* Title: Units Needed (NO duplicate blood group here) */}
            <h3 className="text-base sm:text-lg font-black text-[#1c1d22] group-hover:text-[#d93829] transition-colors leading-tight truncate">
              {request.unitsNeeded}{' '}
              {request.unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
            </h3>

            {/* Hospital Name (NO address here - details handles that) */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="font-semibold text-stone-700 truncate">
                {request.hospitalName || 'Unspecified Hospital'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons cluster (Aligned horizontally on desktop!) */}
        <div className="flex items-end gap-2 shrink-0 self-end md:self-end">
          {/* Volunteer Button for non-creators who haven't volunteered yet and whose blood matches */}
          {!isRequester && !hasVolunteered && !isTerminal && isCompatible && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVolunteer?.(e, request);
              }}
              className="clay-btn-crimson h-10 px-4 rounded-xl text-xs font-black text-white shadow-sm flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Volunteer</span>
            </button>
          )}

          {/* Coordination Chat Button (Available to requester and volunteers) */}
          {(isRequester || hasVolunteered) && (
            <Link
              to={`/coordination/${request._id}`}
              onClick={(e) => e.stopPropagation()}
              className="clay-btn-cream h-10 px-3.5 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-900 shadow-2xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-95 shrink-0"
              title="Open Coordination Room"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#d93829]" />
              <span>Chat</span>
            </Link>
          )}

          {/* Details Button */}
          <Link
            to={`/requests/${request._id}`}
            onClick={(e) => e.stopPropagation()}
            className={`${
              !isRequester && !hasVolunteered && !isTerminal
                ? 'clay-btn-cream text-stone-700 hover:text-stone-900'
                : 'clay-btn-crimson text-white shadow-sm'
            } h-10 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-transform hover:scale-[1.02] active:scale-95 shrink-0`}
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {/* 3-Dots Safe Overflow Menu for Creator */}
          {isRequester && !isTerminal && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="w-10 h-10 rounded-xl clay-btn-cream text-stone-500 hover:text-stone-900 shadow-2xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                title="More options"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.12 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-white border border-stone-200/80 shadow-xl p-1.5 z-50 origin-bottom-right clay-card"
                    >
                      <button
                        onClick={(e) => {
                          setMenuOpen(false);
                          onCancel?.(e, request);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                        <span>Cancel Request</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
