import React from 'react';
import { Building, CheckCircle2, MapPin } from 'lucide-react';

export const SelectedHospitalCard = ({ selectedHospital }) => {
  if (!selectedHospital) return null;

  return (
    <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white text-[#d93829] flex items-center justify-center shadow-xs">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-stone-900">
              {selectedHospital.name}
            </span>
            {selectedHospital.verified && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{selectedHospital.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedHospitalCard;
