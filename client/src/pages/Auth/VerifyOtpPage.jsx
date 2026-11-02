import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClayLogo from '../../components/ClayAssets/ClayLogo';
import { OtpInputGroup, OtpResendTimer } from './components';
import { useVerifyOtp } from './hooks/useVerifyOtp';

export const VerifyOtpPage = () => {
  const {
    email,
    otpDigits,
    inputRefs,
    error,
    successMsg,
    isLoading,
    countdown,
    isResendLoading,
    handleDigitChange,
    handleKeyDown,
    handleVerify,
    handleResend,
  } = useVerifyOtp();

  return (
    <div className="min-h-screen bg-[#f6f1eb] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Back Button */}
      <div className="w-full max-w-md flex justify-start mb-2 sm:mb-0 sm:absolute sm:top-6 sm:left-6 z-20">
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-[#575965] hover:text-[#1c1d22] transition-colors p-2 sm:p-2.5 rounded-2xl clay-btn-cream"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 my-4 sm:my-8"
      >
        <div className="clay-card p-5 sm:p-8 bg-white/95 shadow-2xl space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <ClayLogo size="lg" to="/" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1c1d22] tracking-tight">
              Verify Your Email
            </h2>
            <p className="text-xs text-[#575965] font-medium leading-relaxed">
              We've dispatched a 6-digit security code to
              <br />
              <strong className="text-[#1c1d22] break-all">{email}</strong>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-[#d93829] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 6-Digit OTP Form */}
          <form onSubmit={handleVerify} className="space-y-5 sm:space-y-6">
            <OtpInputGroup
              otpDigits={otpDigits}
              inputRefs={inputRefs}
              onDigitChange={handleDigitChange}
              onKeyDown={handleKeyDown}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 clay-btn-crimson font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Code...' : 'Verify Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <OtpResendTimer
            countdown={countdown}
            isResendLoading={isResendLoading}
            handleResend={handleResend}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
