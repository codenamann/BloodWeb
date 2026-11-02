import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  CoordinationLoadingSkeleton,
  CoordinationErrorView,
  CoordinationRoomHeader,
  CoordinationSummaryBanners,
  CoordinationChatStream,
  CoordinationParticipantsCard,
  CoordinationHospitalCard,
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
    messagesEndRef,
    isRequester,
    isVolunteer,
    isClosed,
    pinnedText,
    loadRoomData,
    handleSend,
    handleQuickAction,
    handleToggleCooldown,
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
    <div className="space-y-5 max-w-6xl mx-auto">
      <CoordinationRoomHeader
        request={request}
        participants={participants}
        isClosed={isClosed}
        isRequester={isRequester}
        cooldownEnabled={cooldownEnabled}
        room={room}
        handleToggleCooldown={handleToggleCooldown}
        handleCloseRoom={handleCloseRoom}
      />

      <CoordinationSummaryBanners
        request={request}
        activeVolunteers={activeVolunteers}
      />

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
        />

        <div className="space-y-4">
          <CoordinationParticipantsCard
            activeVolunteers={activeVolunteers}
            participants={participants}
            request={request}
            isRequester={isRequester}
            isClosed={isClosed}
            updatingVolunteerId={updatingVolunteerId}
            handleVolunteerStatusUpdate={handleVolunteerStatusUpdate}
          />

          <CoordinationHospitalCard request={request} />
        </div>
      </div>
    </div>
  );
};

export default CoordinationRoomPage;
