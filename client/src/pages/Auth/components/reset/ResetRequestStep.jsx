import React from 'react';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';

export const ResetRequestStep = ({
  resetEmail,
  setResetEmail,
  resetError,
  resetLoading,
  handleSendResetOtp,
  onClose,
}) => {
  return (
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
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={resetLoading}
          className="flex-1 py-2.5 clay-btn-crimson text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
        >
          {resetLoading ? 'Sending Code...' : 'Send Reset Code'}
        </button>
      </div>
    </form>
  );
};

export default ResetRequestStep;
