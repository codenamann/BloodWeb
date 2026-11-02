import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginForm, PasswordResetModal } from './components';
import { usePasswordReset } from './hooks/usePasswordReset';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const resetState = usePasswordReset(email, (newEmail, newPassword) => {
    setEmail(newEmail);
    setPassword(newPassword);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
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
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleOpenResetModal={(e) => {
            e.preventDefault();
            resetState.handleOpenResetModal(email);
          }}
        />
      </motion.div>

      <PasswordResetModal {...resetState} />
    </div>
  );
};

export default LoginPage;
