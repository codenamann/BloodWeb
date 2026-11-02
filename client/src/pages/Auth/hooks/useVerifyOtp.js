import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { resendOtp } from '../../../api/auth.api.js';

export const useVerifyOtp = () => {
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
    try {
      const res = await verifyOtp(email, fullOtp);

      if (res.status === 'success') {
        setSuccessMsg('Email verified successfully! Entering BloodWeb...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(res.message || 'Invalid verification code. Please check your email.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Verification failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResendLoading) return;

    setIsResendLoading(true);
    try {
      const res = await resendOtp(email);
      if (res.status === 'success') {
        const newExpiresAt = Date.now() + 300 * 1000;
        setExpiresAt(newExpiresAt);
        sessionStorage.setItem(
          'pendingVerification',
          JSON.stringify({ email, expiresAt: newExpiresAt })
        );
        setSuccessMsg('A fresh verification code has been dispatched to your email.');
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

  return {
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
  };
};

export default useVerifyOtp;
