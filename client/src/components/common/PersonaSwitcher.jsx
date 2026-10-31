import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, ChevronUp, ChevronDown, Check, UserCheck } from 'lucide-react';
import ClayAvatar from '../ClayAssets/ClayAvatar';

export const PersonaSwitcher = () => {
  const { currentUser, switchPersona, allPersonas } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40">
      {isOpen && (
        <div className="mb-2 w-68 sm:w-72 rounded-3xl clay-card bg-white p-3 sm:p-3.5 shadow-2xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs font-bold text-[#1c1d22]">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#d93829]" />
              <span>Simulate Role Perspective</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 text-[10px] cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="space-y-1.5">
            {allPersonas.map((persona) => {
              const isSelected = currentUser?._id === persona._id;
              return (
                <button
                  key={persona._id}
                  onClick={() => {
                    switchPersona(persona._id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 text-[#d93829] border border-red-200'
                      : 'hover:bg-stone-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ClayAvatar type={persona.avatarType} size={30} showBadge={false} />
                    <div className="text-left overflow-hidden">
                      <div className="text-xs font-black truncate">{persona.name}</div>
                      <div className="text-[10px] text-[#747682] font-semibold">
                        Type {persona.bloodGroup} • {persona._id === 'user-sarah' ? 'Requester' : 'Donor'}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#d93829] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="clay-card-flat px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white/95 backdrop-blur-md flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#1c1d22] shadow-lg hover:scale-105 transition-transform cursor-pointer border border-stone-200"
      >
        <ClayAvatar type={currentUser?.avatarType || 'sarah'} size={22} showBadge={false} />
        <span>View as: <strong>{currentUser?.name?.split(' ')[0]}</strong></span>
        {isOpen ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronUp className="w-3 h-3 text-slate-400" />}
      </button>
    </div>
  );
};

export default PersonaSwitcher;
