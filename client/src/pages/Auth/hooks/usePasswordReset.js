import { useState, useEffect } from 'react';
import {
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from '../../../api/auth.api';

export const usePasswordReset = (initialEmail = '', onPasswordResetSuccess) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleOpenResetModal = (currentEmail = '') => {
    setResetEmail((currentEmail || initialEmail).trim());
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
    e?.preventDefault();
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

      if (onPasswordResetSuccess) {
        onPasswordResetSuccess(resetEmail.trim(), resetNewPassword);
      }

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

  return {
    showResetModal,
    setShowResetModal,
    resetStep,
    setResetStep,
    resetEmail,
    setResetEmail,
    resetOtp,
    setResetOtp,
    resetNewPassword,
    setResetNewPassword,
    resetConfirmPassword,
    setResetConfirmPassword,
    resetLoading,
    resetError,
    resetSuccessMessage,
    cooldownSeconds,
    handleOpenResetModal,
    handleSendResetOtp,
    handleConfirmReset,
  };
};

export default usePasswordReset;
