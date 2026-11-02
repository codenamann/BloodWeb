import React from 'react';
import { Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { ClayHandsHeart } from '../../../../components/ClayAssets/ClayIllustrations';

const TIPS = [
  'Provide accurate hospital & ward details.',
  'Upload a valid medical requisition slip. (Required)',
  'Be honest and specific about the needed urgency.',
  'Our community will be notified instantly upon submission.',
];

export const CreateRequestSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Things to keep in mind */}
      <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#d93829]">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
            A Few Things to Keep in Mind
          </h4>
        </div>

        <div className="space-y-3">
          {TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-stone-600 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-[#d93829] shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help Card */}
      <div className="clay-card p-6 bg-white/95 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-stone-500" />
          <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
            Need Help?
          </h4>
        </div>
        <p className="text-xs text-stone-500 font-medium">
          If you're unsure about hospital details or blood matching protocols, our support team is available 24/7.
        </p>
        <button
          type="button"
          onClick={() =>
            alert('BloodWeb Emergency Support Hotline: +1 (800) 555-BLOOD')
          }
          className="w-full clay-btn-cream py-2 text-xs font-bold text-stone-800"
        >
          Contact Support
        </button>
      </div>

      {/* Supportive Illustration Card */}
      <div className="clay-card p-6 bg-white/95 text-center space-y-2 shadow-sm">
        <div className="flex justify-center">
          <ClayHandsHeart size={140} />
        </div>
        <h4 className="text-xs font-black text-stone-900">
          Together for a Healthier Tomorrow
        </h4>
        <p className="text-[11px] text-stone-500 font-medium">
          Every blood request connects willing donors with lives in need.
        </p>
      </div>
    </div>
  );
};

export default CreateRequestSidebar;
