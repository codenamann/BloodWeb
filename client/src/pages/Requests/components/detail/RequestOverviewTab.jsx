import React from 'react';
import { Building, MapPin, ExternalLink, Phone } from 'lucide-react';
import { HospitalDocumentPreview } from '../../../../components/HospitalDocumentPreview';
import { RequestProgressCard } from './RequestProgressCard';
import { DonorVolunteerCard } from './DonorVolunteerCard';

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
          <DonorVolunteerCard
            request={request}
            isCompatible={isCompatible}
            currentUser={currentUser}
            alreadyVolunteered={alreadyVolunteered}
            myResponse={myResponse}
            getVolunteerBadge={getVolunteerBadge}
            handleWithdraw={handleWithdraw}
            handleVolunteer={handleVolunteer}
            actionLoading={actionLoading}
          />
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
