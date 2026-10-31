import React, { useState, useEffect, useRef } from 'react';
import { motion, readTransformValue } from 'framer-motion';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClayLogo from '../../components/ClayAssets/ClayLogo';
import { resendOtp } from '../../api/auth.api.js';

export const VerifyOtpPage = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingData = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('pendingVerification') || 'null');
    } catch {
      return null;
    }
  })();

  const email = pendingData?.email || location.state?.email || '';
  const initialExpiresAt = pendingData?.expiresAt || Date.now() + 5 * 60 * 1000;

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResendLoading, setIsResendLoading] = useState(false);

  const inputRefs = useRef([]);

  // Resend countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);

      return remaining;
    };

    updateCountdown();

    const timer = setInterval(() => {
      const remaining = updateCountdown();
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtpDigits(newOtp);
      const nextIdx = Math.min(index + digits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    console.log(fullOtp);
    try {
      const res = await verifyOtp(email, fullOtp);

      if (res.status === 'success') {
        setSuccessMsg('Email verified successfully! Entering BloodWeb...');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(
          res.message || 'Invalid verification code. Please check your email.'
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Verification failed. Please try again.'
      );
      console.dir(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResendLoading) return;

    setIsResendLoading(true);

    try {
      const res = await resendOtp(email);
      console.dir(res);

      if (res.status === 'success') {
        const newExpiresAt = Date.now() + 300 * 1000;
        setExpiresAt(newExpiresAt);

        sessionStorage.setItem(
          'pendingVerification',
          JSON.stringify({ email, expiresAt: newExpiresAt })
        );

        setSuccessMsg(
          'A fresh verification code has been dispatched to your email.'
        );
        setError('');

        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'OTP resend failed. Please try again.'
      );

      if (err.response?.data?.code === 'OTP_ALREADY_SENT') {
        const newExpiresAt = err.response?.data?.data?.expiresAt;
        setExpiresAt(newExpiresAt);

        sessionStorage.setItem(
          'pendingVerification',
          JSON.stringify({ email, expiresAt: newExpiresAt })
        );
      }
    } finally {
      setIsResendLoading(false);
    }
  };

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

          {/* 6-Digit OTP Boxes */}
          <form onSubmit={handleVerify} className="space-y-5 sm:space-y-6">
            <div className="flex justify-center gap-1.5 sm:gap-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black rounded-2xl bg-[#faf7f2] border-2 border-stone-200 focus:border-[#d93829] focus:outline-none focus:ring-2 focus:ring-[#d93829]/20 transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 clay-btn-crimson font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Code...' : 'Verify Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Resend & Demo helper */}
          <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1 text-[#575965]">
              <span>Didn't receive code?</span>
              {isResendLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
