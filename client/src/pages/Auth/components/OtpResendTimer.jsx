import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

export const OtpResendTimer = ({
  countdown,
  isResendLoading,
  handleResend,
}) => {
  return (
    <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-2.5 text-xs">
      <div className="flex items-center gap-1 text-[#575965]">
        <span>Didn't receive code?</span>
        {isResendLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#d93829]" />
        ) : countdown > 0 ? (
          <span className="font-semibold text-stone-400">
            Resend in {Math.floor(countdown / 60)}:
            {String(countdown % 60).padStart(2, '0')}
          </span>
        ) : (
          <button
            onClick={handleResend}
            className="font-extrabold text-[#d93829] hover:underline cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Resend Code
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpResendTimer;
