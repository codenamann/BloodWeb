import React from 'react';
import { Phone } from 'lucide-react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';

export const CoordinationVolunteerItem = ({
  volunteer,
  request,
  isRequester,
  isClosed,
  updatingVolunteerId,
  handleVolunteerStatusUpdate,
}) => {
  const donorInfo = volunteer.donorId || volunteer.donor || {};
  const isAccepted = volunteer.status === 'ACCEPTED';
  const isPending = volunteer.status === 'PENDING';
  const isBackup = volunteer.status === 'BACKUP';

  return (
    <div
      className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
        isAccepted
          ? 'bg-emerald-50/50 border-emerald-100'
          : isPending
          ? 'bg-amber-50/40 border-amber-100'
          : 'bg-stone-50 border-stone-100'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClayAvatar
            type={donorInfo.avatarType || 'alex'}
            size={32}
            showBadge={false}
          />
          <div>
            <div className="text-xs font-bold text-stone-800">
              {donorInfo.name || 'Verified Donor'}
            </div>
            <div className="text-[10px] text-stone-400 font-medium">
              Type {donorInfo.bloodGroup || request.patientBloodGroup}
              {volunteer.estimatedDistanceKm != null &&
                ` • ${volunteer.estimatedDistanceKm} km`}
            </div>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
            isAccepted
              ? 'bg-emerald-100 text-emerald-800'
              : isPending
              ? 'bg-amber-100 text-amber-900'
              : 'bg-blue-100 text-blue-900'
          }`}
        >
          {volunteer.status}
        </span>
      </div>

      {/* Contact information for accepted donors (Mutual trust boundary) */}
      {donorInfo.phone && (
        <div className="pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[10px]">
          <span className="text-stone-500 font-medium">Donor Phone:</span>
          <a
            href={`tel:${donorInfo.phone}`}
            className="font-bold text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <Phone className="w-2.5 h-2.5" />
            {donorInfo.phone}
          </a>
        </div>
      )}

      {/* Requester Volunteer Management Controls */}
      {isRequester && !isClosed && (
        <div className="pt-1.5 border-t border-stone-200/50 flex items-center gap-1.5 justify-end">
          {isPending && (
            <>
              <button
                type="button"
                disabled={updatingVolunteerId === volunteer._id}
                onClick={() =>
                  handleVolunteerStatusUpdate(volunteer._id, 'ACCEPTED')
                }
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
              >
                {updatingVolunteerId === volunteer._id ? 'Updating...' : 'Accept'}
              </button>
              <button
                type="button"
                disabled={updatingVolunteerId === volunteer._id}
                onClick={() =>
                  handleVolunteerStatusUpdate(volunteer._id, 'BACKUP')
                }
                className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold cursor-pointer disabled:opacity-50 transition-colors"
              >
                Backup
              </button>
            </>
          )}

          {isAccepted && (
            <button
              type="button"
              disabled={updatingVolunteerId === volunteer._id}
              onClick={() =>
                handleVolunteerStatusUpdate(volunteer._id, 'BACKUP')
              }
              className="text-[9px] font-bold text-stone-500 hover:text-stone-800 underline cursor-pointer disabled:opacity-50"
            >
              Move to Backup
            </button>
          )}

          {isBackup && (
            <button
              type="button"
              disabled={updatingVolunteerId === volunteer._id}
              onClick={() =>
                handleVolunteerStatusUpdate(volunteer._id, 'ACCEPTED')
              }
              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[9px] font-black cursor-pointer disabled:opacity-50 transition-colors"
            >
              Promote to Accepted
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoordinationVolunteerItem;
