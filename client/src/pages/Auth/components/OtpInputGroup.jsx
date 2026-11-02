import React from 'react';

export const OtpInputGroup = ({
  otpDigits,
  inputRefs,
  onDigitChange,
  onKeyDown,
}) => {
  return (
    <div className="flex justify-center gap-1.5 sm:gap-3">
      {otpDigits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onDigitChange(idx, e.target.value)}
          onKeyDown={(e) => onKeyDown(idx, e)}
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black rounded-2xl bg-[#faf7f2] border-2 border-stone-200 focus:border-[#d93829] focus:outline-none focus:ring-2 focus:ring-[#d93829]/20 transition-all shadow-inner"
        />
      ))}
    </div>
  );
};

export default OtpInputGroup;
