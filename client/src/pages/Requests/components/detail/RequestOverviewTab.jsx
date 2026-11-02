import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  MapPin,
  ExternalLink,
  Phone,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { HospitalDocumentPreview } from '../../../../components/HospitalDocumentPreview';
import { RequestProgressCard } from './RequestProgressCard';

export const RequestOverviewTab = ({
  request,
  hospitalName,
  hospitalLocation,
  hospitalCoords,
  isRequester,
  isCompatible,
  currentUser,
  alreadyVolunteered,
  myResponse,
  getVolunteerBadge,
  handleWithdraw,
  handleVolunteer,
  actionLoading,
  fulfilledUnits,
  unitsNeeded,
  remainingUnits,
  progressPercentage,
  handleShare,
  shareFeedback,
}) => {
  const navigate = useNavigate();

  return (
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
          <div className="text-sm font-black text-stone-900">{hospitalName}</div>
          {hospitalLocation && (
            <p className="text-xs text-stone-500 font-medium">{hospitalLocation}</p>
          )}

          {/* Safe Map Link - only rendered if coordinates exist */}
          {hospitalCoords?.lat != null && hospitalCoords?.lng != null && (
            <div className="pt-1">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${hospitalCoords.lat},${hospitalCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#d93829] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Request Details & Requester Note */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
          <div className="text-xs font-black text-stone-900 uppercase tracking-wider">
            Clinical Context & Instructions
          </div>
          <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-stone-100 italic">
            "{request.patientCondition || 'Emergency blood requirement for medical treatment.'}"
          </p>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-stone-500 font-medium">Request Creator:</span>
            <span className="font-bold text-stone-800">
              {request.createdBy?.name || 'Requester'}
            </span>
          </div>

          {/* Privacy-Safe Requester Contact Rows: Only present for authorized viewers */}
          {(request.createdBy?.phone || request.createdBy?.email) && (
            <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600">
              {request.createdBy.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d93829]" />
                  <span>{request.createdBy.phone}</span>
                </span>
              )}
              {request.createdBy.email && (
                <span className="text-stone-500">
                  {request.createdBy.email}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hospital Document Preview - Only rendered if document is attached */}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-emerald-800">
                    You have volunteered for this request
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Status:{' '}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getVolunteerBadge(
                        myResponse?.status
                      )}`}
                    >
                      {myResponse?.status}
                    </span>{' '}
                    • Coordination is open.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {myResponse?.status !== 'WITHDRAWN' && (
                    <button
                      onClick={() => handleWithdraw(myResponse._id)}
                      disabled={actionLoading}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-[#d93829] text-stone-600 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Withdraw Offer
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/coordination/${request._id}`)}
                    className="clay-btn-crimson px-4 py-2 text-xs font-bold shadow-md cursor-pointer"
                  >
                    Open Coordination Room
                  </button>
                </div>
              </div>
            ) : !isCompatible && currentUser?.bloodGroup ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-100 text-xs font-semibold text-stone-600 border border-stone-200">
                <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                <span>
                  Your blood group ({currentUser.bloodGroup}) does not match patient's needed
                  blood group ({request.patientBloodGroup}).
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-stone-600 font-medium">
                  Can you donate blood for this emergency? Your response connects directly with
                  the requester.
                </p>
                <button
                  onClick={handleVolunteer}
                  disabled={actionLoading}
                  className="clay-btn-crimson px-5 py-2.5 text-xs font-black shadow-lg cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{actionLoading ? 'Submitting...' : 'Volunteer to Donate'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right 1-Col: Progress Gauge & Quick Actions */}
      <RequestProgressCard
        fulfilledUnits={fulfilledUnits}
        unitsNeeded={unitsNeeded}
        remainingUnits={remainingUnits}
        progressPercentage={progressPercentage}
        requestId={request._id}
        handleShare={handleShare}
        shareFeedback={shareFeedback}
      />
    </div>
  );
};

export default RequestOverviewTab;
