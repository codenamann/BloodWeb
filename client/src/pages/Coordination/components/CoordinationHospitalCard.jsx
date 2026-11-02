import React from 'react';
import { Building, CheckCircle2 } from 'lucide-react';
import { HospitalDocumentPreview } from '../../../components/HospitalDocumentPreview';

export const CoordinationHospitalCard = ({ request }) => {
  return (
    <>
      {/* Hospital Contact Info */}
      <div className="clay-card p-5 bg-white/95 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
          <Building className="w-4 h-4 text-[#d93829]" />
          <span>Hospital Blood Bank</span>
        </div>
        <div className="text-xs font-bold text-stone-800">
          {request.hospitalName}
        </div>
        <p className="text-[11px] text-stone-500 font-medium">
          {request.hospitalAddress}
        </p>
        {request.contactPhone && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Emergency Contact:</span>
            <span className="font-bold text-[#d93829]">{request.contactPhone}</span>
          </div>
        )}
      </div>

      {/* Document Verification Block */}
      {request.hospitalDocument && (
        <div className="clay-card p-5 bg-white/95 space-y-3 shadow-sm">
          <div className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Verified Document
          </div>
          <HospitalDocumentPreview document={request.hospitalDocument} />
        </div>
      )}
    </>
  );
};

export default CoordinationHospitalCard;
