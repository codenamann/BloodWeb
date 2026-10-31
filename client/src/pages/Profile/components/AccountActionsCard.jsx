import React from 'react';
import { Lock, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const AccountActionsCard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="clay-card p-5 bg-white/95 space-y-2 shadow-sm">
      <button
        onClick={() =>
          alert('Password reset link sent to your verified email address.')
        }
        className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center justify-between cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-stone-400" /> Change Password
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
      </button>

      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 flex items-center justify-between cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-2">
          <LogOut className="w-3.5 h-3.5 text-red-500" /> Sign Out
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-red-300" />
      </button>
    </div>
  );
};

export default AccountActionsCard;
