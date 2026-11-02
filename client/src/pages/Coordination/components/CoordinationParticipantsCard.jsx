import React from 'react';
import { Users, Phone } from 'lucide-react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';
import CoordinationVolunteerItem from './CoordinationVolunteerItem';

export const CoordinationParticipantsCard = ({
  activeVolunteers,
  participants,
  request,
  isRequester,
  isClosed,
  updatingVolunteerId,
  handleVolunteerStatusUpdate,
}) => {
  return (
    <div className="clay-card p-5 bg-white/95 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
          <Users className="w-4 h-4 text-[#d93829]" />
          <span>Participants</span>
        </div>
        <span className="text-[10px] font-black text-stone-400">
          {activeVolunteers.length + 1} Connected
        </span>
      </div>

      {/* Coordinator Item */}
      <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ClayAvatar
              type={
                participants.requester?.avatarType ||
                request.createdBy?.avatarType ||
                'sarah'
              }
              size={36}
              showBadge={false}
            />
            <div>
              <div className="text-xs font-black text-stone-900">
                {participants.requester?.name ||
                  request.createdBy?.name ||
                  'Requester'}
              </div>
              <div className="text-[10px] font-bold text-[#d93829]">
                Room Admin / Coordinator
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[9px] font-black">
            Admin
          </span>
        </div>

        {/* Requester Contact (Exposed only to creator or accepted volunteers) */}
        {participants.requester?.phone && (
          <div className="pt-1.5 border-t border-red-200/50 flex items-center justify-between text-[10px]">
            <span className="text-stone-500 font-medium">Contact Phone:</span>
            <a
              href={`tel:${participants.requester.phone}`}
              className="font-black text-[#d93829] flex items-center gap-1 hover:underline"
            >
              <Phone className="w-2.5 h-2.5" />
              {participants.requester.phone}
            </a>
          </div>
        )}
      </div>

      {/* Volunteers List with In-Room Operational Management */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
            Volunteers ({activeVolunteers.length})
          </span>
        </div>

        {activeVolunteers.length === 0 ? (
          <div className="text-[11px] text-stone-400 font-medium py-2">
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
  );
};

export default CoordinationParticipantsCard;
