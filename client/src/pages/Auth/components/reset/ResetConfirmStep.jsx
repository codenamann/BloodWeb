import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { PasswordInput } from '../../../../components/ui';

export const ResetConfirmStep = ({
  resetEmail,
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
  handleSendResetOtp,
  handleConfirmReset,
  onBack,
}) => {
  return (
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
            className="text-[11px] font-bold text-[#d93829] hover:underline disabled:text-stone-400 disabled:no-underline flex items-center gap-1 cursor-pointer"
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
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={resetLoading}
          className="flex-1 py-2.5 clay-btn-crimson text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
        >
          {resetLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
};

export default ResetConfirmStep;
