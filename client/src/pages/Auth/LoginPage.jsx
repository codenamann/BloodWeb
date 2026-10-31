import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Heart,
  UserCheck,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../../components/ui';
import {
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from '../../api/auth.api';
import ClayLogo from '../../components/ClayAssets/ClayLogo';
import ClayAvatar from '../../components/ClayAssets/ClayAvatar';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP + New Password, 3: Success
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      console.dir(res);
      if (res.status === 'success') {
        navigate(from, { replace: true });
      } else if (res.code === 'EMAIL_NOT_VERIFIED') {
        navigate('/verify-otp', { state: { email: res.email } });
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      );
      console.dir(err.response?.data);
      if (
        err.response?.data?.code === 'EMAIL_NOT_VERIFIED' ||
        err.response?.data?.code === 'OTP_ALREADY_SENT'
      ) {
        sessionStorage.setItem(
          'pendingVerification',
          JSON.stringify({
            email,
            expiresAt: err.response?.data?.data?.expiresAt,
          })
        );
        navigate('/verify-otp', { state: { email: err.response.data.email } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResetModal = (e) => {
    e.preventDefault();
    setResetEmail(email.trim());
    setResetStep(1);
    setResetError('');
    setResetSuccessMessage('');
    setResetOtp('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setShowResetModal(true);
  };

  const handleSendResetOtp = async (e) => {
    e?.preventDefault();
    setResetError('');
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetError('Please enter a valid email address.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await forgotPasswordApi(resetEmail.trim());
      setResetSuccessMessage(
        res.message || 'A 6-digit reset code has been sent to your email.'
      );
      setResetStep(2);
      setCooldownSeconds(60);
    } catch (err) {
      setResetError(
        err.response?.data?.message ||
          'Failed to send reset code. Please try again.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setResetError('');

    if (!resetOtp || resetOtp.trim().length !== 6) {
      setResetError('Please enter the 6-digit verification code.');
      return;
    }

    if (!resetNewPassword || resetNewPassword.length < 8) {
      setResetError('New password must be at least 8 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await resetPasswordApi({
        email: resetEmail.trim(),
        otp: resetOtp.trim(),
        newPassword: resetNewPassword,
      });

      setResetStep(3);
      setResetSuccessMessage(
        res.message || 'Password has been reset successfully!'
      );
      setEmail(resetEmail.trim());
      setPassword(resetNewPassword);

      setTimeout(() => {
        setShowResetModal(false);
      }, 2500);
    } catch (err) {
      setResetError(
        err.response?.data?.message ||
          'Failed to reset password. Please check your code.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1eb] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-12 left-12 w-6 h-6 clay-sphere opacity-70 animate-float-slow pointer-events-none hidden sm:block" />
      <div className="absolute bottom-16 right-16 w-8 h-8 clay-sphere-crimson opacity-70 animate-float-reverse pointer-events-none hidden sm:block" />

      {/* Back Button */}
      <div className="w-full max-w-md flex justify-start mb-2 sm:mb-0 sm:absolute sm:top-6 sm:left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-[#575965] hover:text-[#1c1d22] transition-colors p-2 sm:p-2.5 rounded-2xl clay-btn-cream"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 my-4 sm:my-8"
      >
        {/* Main Clay Card */}
        <div className="clay-card p-5 sm:p-8 bg-white/95 shadow-2xl space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <ClayLogo size="lg" to="/" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1c1d22] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-[#575965] font-medium">
              Sign in to coordinate emergency requests and donor matches
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8a8c98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-[#1c1d22] bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#575965]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenResetModal}
                  className="text-[11px] font-bold text-[#d93829] hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 clay-btn-crimson font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer link to Register */}
          <div className="text-center text-xs text-[#575965] pt-1">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-extrabold text-[#d93829] hover:underline"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Step 1: Request OTP */}
              {resetStep === 1 && (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-[#d93829]">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-stone-900">
                        Reset Password
                      </h3>
                      <p className="text-xs text-stone-500">
                        We will send a 6-digit reset code to your email.
                      </p>
                    </div>
                  </div>

                  {resetError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 py-2.5 clay-btn-crimson text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {resetLoading ? 'Sending Code...' : 'Send Reset Code'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Enter Code & New Password */}
              {resetStep === 2 && (
                <form onSubmit={handleConfirmReset} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-[#d93829]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-stone-900">
                        Set New Password
                      </h3>
                      <p className="text-xs text-stone-500">
                        Code sent to{' '}
                        <span className="font-semibold text-stone-700">
                          {resetEmail}
                        </span>
                      </p>
                    </div>
                  </div>

                  {resetSuccessMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{resetSuccessMessage}</span>
                    </div>
                  )}

                  {resetError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                        6-Digit Verification Code
                      </label>
                      <button
                        type="button"
                        disabled={cooldownSeconds > 0 || resetLoading}
                        onClick={handleSendResetOtp}
                        className="text-[11px] font-bold text-[#d93829] hover:underline disabled:text-stone-400 disabled:no-underline flex items-center gap-1"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${resetLoading ? 'animate-spin' : ''}`}
                        />
                        {cooldownSeconds > 0
                          ? `Resend in ${cooldownSeconds}s`
                          : 'Resend Code'}
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={resetOtp}
                      onChange={(e) =>
                        setResetOtp(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="Enter Reset Code"
                      className="w-full text-center tracking-[0.5em] font-mono text-lg py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                      New Password (min 8 chars)
                    </label>
                    <PasswordInput
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                      Confirm New Password
                    </label>
                    <PasswordInput
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 py-2.5 clay-btn-crimson text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {resetLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {resetStep === 3 && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">
                    Password Reset Complete
                  </h3>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto">
                    {resetSuccessMessage} Your new password has been applied.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
