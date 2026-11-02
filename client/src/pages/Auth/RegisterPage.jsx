import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClayLogo from '../../components/ClayAssets/ClayLogo';
import RegisterForm from './components/RegisterForm';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(formData);

      if (res.status === 'success') {
        navigate('/verify-otp', {
          state: { email: formData.email, name: formData.name },
        });
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'An error occurred during registration. Please try again.'
      );
      console.dir(err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1eb] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
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
        {/* Registration Card */}
        <div className="clay-card p-5 sm:p-8 bg-white/95 shadow-2xl space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <ClayLogo size="lg" to="/" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1c1d22] tracking-tight">
              Create an Account
            </h2>
            <p className="text-xs text-[#575965] font-medium">
              Join the real-time blood donor and coordination network
            </p>
          </div>

          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Footer link to Login */}
          <div className="text-center text-xs text-[#575965] pt-2 border-t border-stone-100">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-extrabold text-[#d93829] hover:underline"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
