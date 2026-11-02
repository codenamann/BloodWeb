import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isDonorCompatible } from '../../utils/compatibility';

import { RequestDetailSkeleton } from './components/RequestDetailSkeleton';
import {
  RequestDetailHeader,
  RequestHeroHeader,
  RequestDetailTabBar,
  RequestOverviewTab,
  RequestVolunteersTab,
  WithdrawConfirmationModal,
  RequestNotFoundView,
  RequestErrorView,
} from './components/detail';
import { useRequestDetailPage } from './hooks/useRequestDetailPage';

const formatNeededBy = (val) => {
  if (!val) return 'As soon as possible';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RequestDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const {
    request,
    loading,
    error,
    statusCode,
    fetchRequest,
    cancelling,
    completing,
    confirmingComplete,
    setConfirmingComplete,
    actionLoading,
    responseToWithdraw,
    setResponseToWithdraw,
    handleCancelRequest,
    handleCompleteRequest,
    handleShare,
    shareFeedback,
    handleVolunteer,
    handleStatusChange,
    handleWithdraw,
    confirmWithdraw,
    getVolunteerBadge,
  } = useRequestDetailPage(id, setActiveTab);

  if (loading) {
    return <RequestDetailSkeleton />;
  }

  if (statusCode === 404 || (!request && !error)) {
    return <RequestNotFoundView />;
  }

  if (error || !request) {
    return <RequestErrorView error={error} onRetry={fetchRequest} />;
  }

  const isRequester = Boolean(currentUser?._id && request.createdBy?._id === currentUser._id);
  const isCompatible = Boolean(
    currentUser?.bloodGroup &&
    isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup)
  );

  const responses = Array.isArray(request.responses) ? request.responses : [];
  const myResponse = responses.find(
    (resp) =>
      currentUser?._id &&
      (resp.donorId === currentUser._id || resp.donor?._id === currentUser._id)
  );
  const alreadyVolunteered = Boolean(myResponse);
  const hasAcceptedVolunteers = responses.some((r) => r.status === 'ACCEPTED');

  const unitsNeeded = request.fulfillment?.unitsNeeded ?? request.unitsNeeded ?? 1;
  const fulfilledUnits = request.fulfillment?.fulfilledUnits ?? 0;
  const remainingUnits =
    request.fulfillment?.remainingUnits ?? Math.max(0, unitsNeeded - fulfilledUnits);
  const progressPercentage =
    request.fulfillment?.progressPercentage ??
    Math.min(100, Math.round((fulfilledUnits / (unitsNeeded || 1)) * 100));

  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request.status);
  const hospitalName = request.hospitalName || request.hospitalId?.name || 'Hospital';
  const hospitalLocation = [
    request.hospitalAddress || request.hospitalId?.address,
    request.hospitalCity || request.hospitalId?.city,
    request.hospitalState || request.hospitalId?.state,
  ]
    .filter(Boolean)
    .join(', ');
  const hospitalCoords = request.hospitalCoordinates || request.hospitalId?.coordinates || null;

  const formattedCreatedAt = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="space-y-6">
      <RequestDetailHeader
        request={request}
        formattedCreatedAt={formattedCreatedAt}
        isRequester={isRequester}
        isTerminal={isTerminal}
        hasAcceptedVolunteers={hasAcceptedVolunteers}
        confirmingComplete={confirmingComplete}
        setConfirmingComplete={setConfirmingComplete}
        handleCompleteRequest={handleCompleteRequest}
        handleCancelRequest={handleCancelRequest}
        completing={completing}
        cancelling={cancelling}
        actionLoading={actionLoading}
      />

      {/* MAIN REQUEST CARD */}
      <div className="clay-card p-6 sm:p-8 bg-white/95 shadow-sm space-y-6">
        <RequestHeroHeader
          patientBloodGroup={request.patientBloodGroup}
          urgency={request.urgency}
          neededByFormatted={formatNeededBy(request.neededBy)}
          unitsNeeded={unitsNeeded}
          hospitalName={hospitalName}
        />

        <RequestDetailTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          responseCount={responses.length}
          onOpenCoordination={() => navigate(`/coordination/${request._id}`)}
        />

        {activeTab === 'OVERVIEW' && (
          <RequestOverviewTab
            request={request}
            hospitalName={hospitalName}
            hospitalLocation={hospitalLocation}
            hospitalCoords={hospitalCoords}
            isRequester={isRequester}
            isCompatible={isCompatible}
            currentUser={currentUser}
            alreadyVolunteered={alreadyVolunteered}
            myResponse={myResponse}
            getVolunteerBadge={getVolunteerBadge}
            handleWithdraw={handleWithdraw}
            handleVolunteer={handleVolunteer}
            actionLoading={actionLoading}
            fulfilledUnits={fulfilledUnits}
            unitsNeeded={unitsNeeded}
            remainingUnits={remainingUnits}
            progressPercentage={progressPercentage}
            handleShare={handleShare}
            shareFeedback={shareFeedback}
          />
        )}

        {activeTab === 'VOLUNTEERS' && (
          <RequestVolunteersTab
            responses={responses}
            currentUser={currentUser}
            request={request}
            getVolunteerBadge={getVolunteerBadge}
            isRequester={isRequester}
            actionLoading={actionLoading}
            handleStatusChange={handleStatusChange}
            handleWithdraw={handleWithdraw}
          />
        )}
      </div>

      <WithdrawConfirmationModal
        responseToWithdraw={responseToWithdraw}
        onClose={() => setResponseToWithdraw(null)}
        confirmWithdraw={confirmWithdraw}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default RequestDetailPage;
