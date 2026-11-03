import React from 'react';
import { Users } from 'lucide-react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';
import CoordinationVolunteerItem from './CoordinationVolunteerItem';

export const CoordinationParticipantsCard = ({
  activeVolunteers = [],
  participants,
  request,
  isRequester,
  isClosed,
  updatingVolunteerId,
  handleVolunteerStatusUpdate,
}) => {
  const volunteerCount = activeVolunteers.length;
  const totalConnected = volunteerCount + 1;

  return (
    <div className="clay-card p-4 sm:p-5 bg-white/95 flex flex-col flex-1 min-h-0 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
          <Users className="w-4 h-4 text-[#d93829]" />
          <span>Participants</span>
        </div>
        <span className="text-[10px] font-black text-stone-400">
          {totalConnected} Connected
        </span>
      </div>

      {/* Scrollable Window with Slight Border (Includes Admin and Volunteers) */}
      <div className="mt-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar-2px rounded-2xl border border-stone-200/80 p-2.5 space-y-2.5 bg-stone-50/40">
        {/* Coordinator / Admin Item */}
        <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ClayAvatar
                src={participants.requester?.avatar || request.createdBy?.avatar}
                type="neutral"
                size={36}
                showBadge={false}
              />
              <div>
                <div className="text-xs font-black text-stone-900">
                  {participants.requester?.name ||
                    request.createdBy?.name ||
                    'Requester'}
                </div>
                <div className="text-[10px] font-bold text-[#d93829]">Admin</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[9px] font-black">
              Admin
            </span>
          </div>
        </div>

        {/* Volunteers Section Header */}
        <div className="flex items-center justify-between pt-1 px-1">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
            Volunteers ({volunteerCount})
          </span>
        </div>

        {/* Volunteers List */}
        <div className="space-y-2">
          {volunteerCount === 0 ? (
            <div className="text-[11px] text-stone-400 font-medium py-3 text-center">
              No other donors connected yet.
            </div>
          ) : (
            activeVolunteers.map((r) => (
              <CoordinationVolunteerItem
                key={r._id}
                volunteer={r}
                request={request}
                isRequester={isRequester}
                isClosed={isClosed}
                updatingVolunteerId={updatingVolunteerId}
                handleVolunteerStatusUpdate={handleVolunteerStatusUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinationParticipantsCard;
