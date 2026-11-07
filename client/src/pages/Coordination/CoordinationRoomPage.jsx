import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CoordinationLoadingSkeleton,
  CoordinationErrorView,
  CoordinationSummaryBanners,
  CoordinationChatStream,
  CoordinationParticipantsCard,
  CoordinationDocumentCard,
  CoordinationSidebarDrawer,
} from './components';
import { useCoordinationRoomPage } from './hooks/useCoordinationRoomPage';

export const CoordinationRoomPage = () => {
  const { requestId } = useParams();
  const { currentUser } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    request,
    room,
    messages,
    participants,
    loading,
    error,
    inputMessage,
    setInputMessage,
    cooldownRemaining,
    cooldownEnabled,
    isSending,
    isActionPending,
    updatingVolunteerId,
    replyingTo,
    setReplyingTo,
    messagesEndRef,
    isRequester,
    isVolunteer,
    isClosed,
    pinnedText,
    loadRoomData,
    handleSend,
    handleQuickAction,
    handleToggleCooldown,
    handleUpdateCooldown,
    handlePin,
    handleDeleteMessage,
    handleCloseRoom,
    handleVolunteerStatusUpdate,
  } = useCoordinationRoomPage(requestId, currentUser);

  if (loading) return <CoordinationLoadingSkeleton />;
  if (error || !request) return <CoordinationErrorView error={error} onRetry={loadRoomData} />;

  const activeVolunteers =
    participants.volunteers && participants.volunteers.length > 0
      ? participants.volunteers
      : request.responses || [];

  const chatStreamProps = {
    messages,
    messagesEndRef,
    pinnedText,
    isRequester,
    isClosed,
    isVolunteer,
    currentUser,
    handlePin,
    handleDeleteMessage,
    handleQuickAction,
    isActionPending,
    inputMessage,
    setInputMessage,
    handleSend,
    cooldownRemaining,
    isSending,
    replyingTo,
    setReplyingTo,
    adminId: room?.adminId || request?.createdBy?._id || request?.createdBy,
    request,
    participants,
    room,
    cooldownEnabled,
    handleToggleCooldown,
    handleUpdateCooldown,
    handleCloseRoom,
    activeVolunteers,
    isSidebarOpen,
    onToggleSidebar: () => setIsSidebarOpen((prev) => !prev),
  };

  const sidebarProps = {
    isOpen: isSidebarOpen,
    onClose: () => setIsSidebarOpen(false),
    activeVolunteers,
    participants,
    request,
    isRequester,
    isClosed,
    updatingVolunteerId,
    handleVolunteerStatusUpdate,
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#faf8f5] flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex-1 flex min-h-0 relative">
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <CoordinationChatStream
              {...chatStreamProps}
              isFullscreen={true}
              onToggleFullscreen={() => {
                setIsFullscreen(false);
                setIsSidebarOpen(false);
              }}
            />
          </div>
          <CoordinationSidebarDrawer {...sidebarProps} isDockedDesktop={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CoordinationChatStream
          {...chatStreamProps}
          isFullscreen={false}
          onToggleFullscreen={() => setIsFullscreen(true)}
        />

        <div className="flex flex-col lg:h-[650px] gap-4">
          <CoordinationParticipantsCard
            activeVolunteers={activeVolunteers}
            participants={participants}
            request={request}
            isRequester={isRequester}
            isClosed={isClosed}
            updatingVolunteerId={updatingVolunteerId}
            handleVolunteerStatusUpdate={handleVolunteerStatusUpdate}
          />
          <CoordinationDocumentCard request={request} />
        </div>

        <div className="col-span-full">
          <CoordinationSummaryBanners
            request={request}
            activeVolunteers={activeVolunteers}
          />
        </div>
      </div>
    </div>
  );
};

export default CoordinationRoomPage;
