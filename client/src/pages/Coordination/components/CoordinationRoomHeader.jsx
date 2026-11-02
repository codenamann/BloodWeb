import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CoordinationRoomHeader = ({
  request,
  participants,
  isClosed,
  isRequester,
  cooldownEnabled,
  room,
  handleToggleCooldown,
  handleCloseRoom,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <Link
          to={`/requests/${request._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Request Details</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#1c1d22] tracking-tight">
            Coordination Room — Request #{request._id.slice(-6).toUpperCase()}
          </h1>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isClosed
                ? 'bg-stone-200 text-stone-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isClosed ? 'CLOSED' : 'LIVE'}
          </span>
        </div>

        <p className="text-xs text-stone-500 font-medium">
          Admin:{' '}
          <strong className="text-stone-800">
            {request.createdBy?.name || participants.requester?.name || 'Requester'}
          </strong>{' '}
          • Emergency Coordination Channel
        </p>
      </div>

      {/* Admin Controls */}
      {isRequester && !isClosed && (
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleToggleCooldown}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              cooldownEnabled
                ? 'bg-amber-100 text-amber-900'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {cooldownEnabled
              ? `Cooldown: ${room?.messageCooldownSeconds || 3}s`
              : 'Cooldown: Off'}
          </button>
          <button
            onClick={handleCloseRoom}
            className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-[#d93829] text-xs font-black transition-colors cursor-pointer"
          >
            Close Room
          </button>
        </div>
      )}
    </div>
  );
};

export default CoordinationRoomHeader;
