import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PasswordInput } from '../../../components/ui';
import ClayLogo from '../../../components/ClayAssets/ClayLogo';

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading,
  handleSubmit,
  handleOpenResetModal,
}) => {
  return (
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
  );
};

export default LoginForm;
