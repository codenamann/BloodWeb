import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  HeartHandshake,
  MessageSquare,
  Undo2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const DonorVolunteerCard = ({
  request,
  isCompatible,
  currentUser,
  alreadyVolunteered,
  myResponse,
  getVolunteerBadge,
  handleWithdraw,
  handleVolunteer,
  actionLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="clay-card p-5 bg-white/95 rounded-2xl border border-stone-200/80 shadow-xs space-y-3.5">
      {alreadyVolunteered ? (
        <>
          {/* Row 1: Header (Title on Left, Status Badge on Right) */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-[#d93829]" />
              <span>Donor Volunteer Status</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getVolunteerBadge(
                myResponse?.status
              )}`}
            >
              {myResponse?.status || 'PENDING'}
            </span>
          </div>

          {/* Row 2: Heading & Subheading (Full Width) */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-900 leading-snug">
              You have volunteered for this request
            </h4>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Coordination room is active. Hospital staff and the requester can communicate with you directly.
            </p>
          </div>

          {/* Row 3: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => navigate(`/coordination/${request._id}`)}
              className="clay-btn-crimson text-white h-9 px-4.5 rounded-xl text-xs font-black shadow-xs whitespace-nowrap flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              <span>Open Coordination Room</span>
            </button>

            {myResponse?.status !== 'WITHDRAWN' && (
              <button
                onClick={() => handleWithdraw(myResponse._id)}
                disabled={actionLoading}
                className="clay-btn-cream text-stone-600 hover:text-[#d93829] h-9 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Undo2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Withdraw Offer</span>
              </button>
            )}
          </div>
        </>
      ) : !isCompatible && currentUser?.bloodGroup ? (
        <>
          {/* Row 1: Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-black text-stone-500 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-stone-400" />
              <span>Blood Compatibility</span>
            </div>
          </div>

          {/* Row 2: Incompatible Notice */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-900">
              Incompatible Blood Type
            </h4>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Your blood group ({currentUser.bloodGroup}) does not match the patient's needed blood group ({request.patientBloodGroup}).
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Row 1: Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-[#d93829]" />
              <span>Emergency Volunteer</span>
            </div>
          </div>

          {/* Row 2: Heading & Subheading (Full Width) */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-900 leading-snug">
              Can you donate blood for this emergency?
            </h4>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Your volunteer response connects directly with the requester and hospital team.
            </p>
          </div>

          {/* Row 3: Action Button */}
          <div className="pt-1">
            <button
              onClick={handleVolunteer}
              disabled={actionLoading}
              className="clay-btn-crimson h-9 px-5 rounded-xl text-xs font-black text-white shadow-xs whitespace-nowrap flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Heart className="w-3.5 h-3.5 fill-white" />
              )}
              <span>{actionLoading ? 'Submitting...' : 'Volunteer to Donate'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DonorVolunteerCard;
