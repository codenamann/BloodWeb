import React from 'react';
import { Phone } from 'lucide-react';
import ClayAvatar from '../../../../components/ClayAssets/ClayAvatar';

export const RequestVolunteersTab = ({
  responses,
  currentUser,
  request,
  getVolunteerBadge,
  isRequester,
  actionLoading,
  handleStatusChange,
  handleWithdraw,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-stone-900">
          Volunteers Responded ({responses.length})
        </h3>
      </div>

      {responses.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-400 font-medium">
          No volunteers have responded yet. Compatible donors are notified.
        </div>
      ) : (
        <div className="space-y-3">
          {responses.map((resp) => {
            const isSelf = !!(
              currentUser?._id &&
              (resp.donorId === currentUser._id || resp.donor?._id === currentUser._id)
            );

            return (
              <div
                key={resp._id}
                className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <ClayAvatar
                    src={resp.donor?.avatar}
                    type="neutral"
                    size={44}
                    showBadge={false}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-stone-900">
                        {resp.donor?.name || 'Verified Donor'} {isSelf && '(You)'}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[10px] font-black">
                        {resp.donor?.bloodGroup || request.patientBloodGroup}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getVolunteerBadge(
                          resp.status
                        )}`}
                      >
                        {resp.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                      {resp.estimatedDistanceKm != null && (
                        <>
                          Distance:{' '}
                          <strong className="text-stone-700">
                            {resp.estimatedDistanceKm} km away
                          </strong>{' '}
                          •{' '}
                        </>
                      )}
                      Responded{' '}
                      {resp.createdAt
                        ? new Date(resp.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </div>

                    {/* Privacy-safe contact display: Only if returned by role-aware backend */}
                    {(resp.donor?.phone || resp.donor?.email) && (
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 font-medium mt-1">
                        {resp.donor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#d93829]" />
                            <span>{resp.donor.phone}</span>
                          </span>
                        )}
                        {resp.donor.email && (
                          <span className="text-stone-500">{resp.donor.email}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Status Change Controls for Requester */}
                  {isRequester && resp.status !== 'WITHDRAWN' && (
                    <>
                      {resp.status !== 'ACCEPTED' && (
                        <button
                          onClick={() => handleStatusChange(resp._id, 'ACCEPTED')}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                        >
                          Accept Donor
                        </button>
                      )}
                      {resp.status !== 'BACKUP' && (
                        <button
                          onClick={() => handleStatusChange(resp._id, 'BACKUP')}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
                        >
                          Set as Backup
                        </button>
                      )}
                    </>
                  )}

                  {/* Withdrawal Control for Donor (Self) */}
                  {isSelf && resp.status !== 'WITHDRAWN' && (
                    <button
                      onClick={() => handleWithdraw(resp._id)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-[#d93829] text-xs font-bold cursor-pointer transition-colors border border-stone-200 disabled:opacity-50"
                    >
                      Withdraw Offer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestVolunteersTab;
