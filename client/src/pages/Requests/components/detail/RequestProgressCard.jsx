import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, MessageSquare } from 'lucide-react';

export const RequestProgressCard = ({
  fulfilledUnits,
  unitsNeeded,
  remainingUnits,
  progressPercentage,
  requestId,
  handleShare,
  shareFeedback,
  canAccessCoordination,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Progress Gauge */}
      <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-center space-y-3">
        <div className="text-xs font-black text-stone-900 uppercase tracking-wider text-left">
          Request Progress
        </div>

        <div className="relative w-28 h-28 mx-auto flex flex-col items-center justify-center rounded-full bg-white shadow-inner border-4 border-red-100">
          <span className="text-xl font-black text-stone-900">
            {fulfilledUnits} / {unitsNeeded}
          </span>
          <span className="text-[9px] font-bold text-stone-400 uppercase">
            Units Fulfilled
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-semibold text-stone-600 text-left pt-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d93829]" /> Donated Units:
            </span>
            <span className="font-bold text-stone-900">{fulfilledUnits}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-300" /> Units Remaining:
            </span>
            <span className="font-bold text-stone-900">{remainingUnits}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
            <span>Progress:</span>
            <span className="font-bold text-[#d93829]">{progressPercentage}%</span>
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
          <span className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-stone-500" /> Share Request
          </span>
          {shareFeedback && (
            <span className="text-[10px] text-emerald-600 font-bold">Link Copied!</span>
          )}
        </button>
        {canAccessCoordination && (
          <button
            onClick={() => navigate(`/coordination/${requestId}`)}
            className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#d93829]" />
            <span>Coordination Room</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestProgressCard;
