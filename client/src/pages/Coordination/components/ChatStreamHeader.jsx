import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  MoreVertical,
  XCircle,
  Clock,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import CooldownModal from './CooldownModal';
import UnitsFulfilledBadge from './UnitsFulfilledBadge';

export const ChatStreamHeader = ({
  request,
  participants,
  room,
  isClosed,
  isRequester,
  cooldownEnabled,
  handleUpdateCooldown,
  handleCloseRoom,
  activeVolunteers = [],
  isFullscreen = false,
  onToggleFullscreen,
  isSidebarOpen = false,
  onToggleSidebar,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCooldownModalOpen, setIsCooldownModalOpen] = useState(false);

  const adminName =
    request?.createdBy?.name || participants?.requester?.name || 'Requester';
  const fulfilledUnits = activeVolunteers.filter(
    (v) => v.status === 'ACCEPTED'
  ).length;
  const totalUnits = request?.unitsNeeded || 1;

  return (
    <>
      <div
        style={{
          boxShadow:
            'inset 1px 1.5px 2px rgba(255, 255, 255, 1), inset -1.5px 0 3px rgba(175, 155, 140, 0.2), inset 1.5px 0 2px rgba(255, 255, 255, 0.9)',
        }}
        className={`relative z-20 p-3 sm:px-4 sm:py-3 bg-white/95 border-b border-stone-200/80 flex items-center justify-between gap-3 shrink-0 ${
          isFullscreen ? 'rounded-none' : 'rounded-t-[28px]'
        }`}
      >
        {/* Left: Back Button + Room Badge + Title + Subheading */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link
            to={request?._id ? `/requests/${request._id}` : '/requests'}
            title="Back to Request Details"
            className=" -ml-0.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-[#d93829] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {request?.patientBloodGroup || 'AB'}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-stone-900 tracking-tight">
              Coordination Room
            </h2>

            <div className="text-[10px] text-stone-500 font-medium truncate flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-stone-700 font-semibold">
                <Shield className="w-2.5 h-2.5 text-[#d93829]" />
                {adminName}
              </span>
              {request?.hospitalName && (
                <>
                  <span>•</span>
                  <span className="truncate">{request.hospitalName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Fulfilled Badge, Sidebar Toggle, Fullscreen Toggle & 3-Dots Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <UnitsFulfilledBadge
            fulfilledUnits={fulfilledUnits}
            totalUnits={totalUnits}
          />

          {isFullscreen && onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={
                isSidebarOpen
                  ? 'Hide Info & Documents'
                  : 'View Info & Documents'
              }
              aria-label="Toggle sidebar"
              className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                isSidebarOpen
                  ? 'bg-red-50 border-red-200 text-[#d93829] shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {isSidebarOpen ? (
                <PanelRightClose className="w-4 h-4 text-[#d93829]" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
              <span className="hidden md:inline text-[11px] font-bold">
                {isSidebarOpen ? 'Hide' : 'Info'}
              </span>
            </button>
          )}

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
              aria-label="Toggle full screen"
              className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
                isFullscreen
                  ? 'bg-stone-900 border-stone-900 text-white shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}

          {isRequester && !isClosed && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Room options"
                className={`p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ${
                  isMenuOpen
                    ? 'bg-stone-100 text-stone-900 ring-2 ring-stone-200'
                    : ''
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Backdrop click-away for menu */}
              <div
                className={`fixed inset-0 z-20 transition-opacity duration-200 ${
                  isMenuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Dropdown Menu Card with smooth open and close transition */}
              <div
                className={`absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-stone-200/80 py-1.5 z-30 origin-top-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-90 -translate-y-2 pointer-events-none'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCooldownModalOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Message Cooldown</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${cooldownEnabled ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'}`}
                  >
                    {cooldownEnabled
                      ? `${room?.messageCooldownSeconds || 3}s`
                      : 'Off'}
                  </span>
                </button>

                <div className="my-1 border-t border-stone-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleCloseRoom();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-[#d93829] hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-[#d93829]" />
                  <span>Close Room</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Separate Cooldown Modal */}
      <CooldownModal
        isOpen={isCooldownModalOpen}
        onClose={() => setIsCooldownModalOpen(false)}
        cooldownEnabled={cooldownEnabled}
        currentSeconds={room?.messageCooldownSeconds || 3}
        onSave={handleUpdateCooldown}
      />
    </>
  );
};

export default ChatStreamHeader;
