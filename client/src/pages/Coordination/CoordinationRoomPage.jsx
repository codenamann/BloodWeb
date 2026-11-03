import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  CoordinationLoadingSkeleton,
  CoordinationErrorView,
  CoordinationSummaryBanners,
  CoordinationChatStream,
  CoordinationParticipantsCard,
  CoordinationDocumentCard,
} from './components';
import { useCoordinationRoomPage } from './hooks/useCoordinationRoomPage';

export const CoordinationRoomPage = () => {
  const { requestId } = useParams();
  const { currentUser } = useAuth();

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
    handleCloseRoom,
    handleVolunteerStatusUpdate,
  } = useCoordinationRoomPage(requestId, currentUser);

  if (loading) {
    return <CoordinationLoadingSkeleton />;
  }

  if (error || !request) {
    return <CoordinationErrorView error={error} onRetry={loadRoomData} />;
  }

  const activeVolunteers =
    participants.volunteers && participants.volunteers.length > 0
      ? participants.volunteers
      : request.responses || [];

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CoordinationChatStream
          messages={messages}
          messagesEndRef={messagesEndRef}
          pinnedText={pinnedText}
          isRequester={isRequester}
          isClosed={isClosed}
          isVolunteer={isVolunteer}
          currentUser={currentUser}
          handlePin={handlePin}
          handleQuickAction={handleQuickAction}
          isActionPending={isActionPending}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSend={handleSend}
          cooldownRemaining={cooldownRemaining}
          isSending={isSending}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          adminId={
            room?.adminId || request?.createdBy?._id || request?.createdBy
          }
          request={request}
          participants={participants}
          room={room}
          cooldownEnabled={cooldownEnabled}
          handleToggleCooldown={handleToggleCooldown}
          handleUpdateCooldown={handleUpdateCooldown}
          handleCloseRoom={handleCloseRoom}
          activeVolunteers={activeVolunteers}
        />

        <div className="flex flex-col h-[650px] gap-4">
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
        <CoordinationSummaryBanners
          request={request}
          activeVolunteers={activeVolunteers}
        />
      </div>
    </div>
  );
};

export default CoordinationRoomPage;
