import React, { useState, useEffect } from 'react';
import { X, Users, FileText } from 'lucide-react';
import CoordinationParticipantsCard from './CoordinationParticipantsCard';
import CoordinationDocumentCard from './CoordinationDocumentCard';

export const CoordinationSidebarDrawer = ({
  isOpen,
  onClose,
  activeVolunteers = [],
  participants,
  request,
  isRequester,
  isClosed,
  updatingVolunteerId,
  handleVolunteerStatusUpdate,
  isDockedDesktop = false,
}) => {
  const hasDocument = Boolean(request?.hospitalDocument);
  const [activeTab, setActiveTab] = useState('participants');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalConnected = (activeVolunteers?.length || 0) + 1;

  const content = (
    <div className="flex flex-col h-full bg-[#faf8f5] overflow-hidden">
      {/* Drawer Header with Tabs & Close Button */}
      <div className="p-3 sm:px-4 sm:py-3 bg-white border-b border-stone-200/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('participants')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'participants'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#d93829]" />
            <span>Participants ({totalConnected})</span>
          </button>

          {hasDocument && (
            <button
              type="button"
              onClick={() => setActiveTab('document')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Document</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 flex flex-col min-h-0 custom-scrollbar-2px">
        {activeTab === 'participants' ? (
          <CoordinationParticipantsCard
            activeVolunteers={activeVolunteers}
            participants={participants}
            request={request}
            isRequester={isRequester}
            isClosed={isClosed}
            updatingVolunteerId={updatingVolunteerId}
            handleVolunteerStatusUpdate={handleVolunteerStatusUpdate}
          />
        ) : (
          <CoordinationDocumentCard request={request} />
        )}
      </div>
    </div>
  );

  if (isDockedDesktop) {
    return (
      <>
        {/* Docked pane for desktop in fullscreen */}
        <div
          className={`hidden lg:flex flex-col h-full border-l border-stone-200/80 bg-white transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
            isOpen ? 'w-88 sm:w-96 opacity-100 shadow-xl' : 'w-0 opacity-0 border-l-0'
          }`}
        >
          {isOpen && content}
        </div>

        {/* Slide-over drawer for mobile/tablet in fullscreen */}
        <div className="lg:hidden">
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 transition-opacity animate-fade-in"
              onClick={onClose}
            />
          )}
          <div
            className={`fixed inset-y-0 right-0 w-[88%] max-w-sm z-50 shadow-2xl transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {content}
          </div>
        </div>
      </>
    );
  }

  // Slide-over drawer for normal view (especially mobile)
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-[88%] max-w-sm z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};

export default CoordinationSidebarDrawer;
