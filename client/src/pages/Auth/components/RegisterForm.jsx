import React from 'react';
import { Mail, User, ArrowRight } from 'lucide-react';
import { PasswordInput } from '../../../components/ui';

export const RegisterForm = ({
  formData,
  setFormData,
  handleSubmit,
  isLoading,
  error,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-[#d93829]">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Enter your name"
            className="w-full pl-10 pr-4 py-2.5 text-sm text-[#1c1d22] bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="name@example.com"
            className="w-full pl-10 pr-4 py-2.5 text-sm text-[#1c1d22] bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
          />
        </div>
      </div>

      {/* Password & Confirm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
            Password
          </label>
          <PasswordInput
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Min 6 chars"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#575965] mb-1.5">
            Confirm Password
          </label>
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Repeat password"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 clay-btn-crimson font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        <span>
          {isLoading
            ? 'Creating Account...'
            : 'Continue to Email Verification'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default RegisterForm;
