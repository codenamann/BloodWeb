import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';

function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type={showPassword ? 'text' : 'password'}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="input-field pl-12 bg-white/50 dark:bg-slate-900/50 text-black dark:text-white"
      />
      <button
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 text-slate-400" />
        ) : (
          <Eye className="w-5 h-5 text-slate-400" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
