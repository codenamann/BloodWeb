import React from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequesterEmailStatusRow = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-extrabold text-stone-700 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-stone-400" />
          <span>Email Address</span>
        </span>
        {currentUser?.emailVerified ? (
          <span className="text-[10px] text-emerald-700 font-black flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        ) : (
          <span className="text-[10px] text-amber-600 font-black flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            Verification Needed
          </span>
        )}
      </label>
      <div className="px-3.5 py-2.5 text-xs bg-stone-100/80 rounded-xl border border-stone-200/80 font-bold text-stone-600 flex items-center justify-between">
        <span>{currentUser?.email || 'No email associated'}</span>
        {!currentUser?.emailVerified && (
          <button
            type="button"
            onClick={() => navigate('/verify-otp')}
            className="text-xs font-black text-[#d93829] hover:underline cursor-pointer"
          >
            Verify Email Now
          </button>
        )}
      </div>
    </div>
  );
};

export default RequesterEmailStatusRow;
