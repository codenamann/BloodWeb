import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBloodRequests } from '../../context/BloodRequestContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { isDonorCompatible } from '../../utils/compatibility';

import {
  BloodGroupCard,
  AvailabilityCard,
  LocationCard,
  DashboardGreetingHeader,
  ImpactSummaryCard,
  CommunityHeroBanner,
  RecentRequestsFeed,
  RecentNotificationsFeed,
  QuickActionsToolbar,
} from '../../components/Dashboard';

export const DashboardPage = () => {
  const { currentUser, toggleAvailability, refreshProfile } = useAuth();
  const { requests } = useBloodRequests();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  // Refresh profile metrics on mount
  useEffect(() => {
    refreshProfile?.();
  }, [refreshProfile]);

  // Filter emergency requests to active/actionable emergencies matching user's blood type (excluding self-created)
  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
  const matchingRequests = requests.filter((req) => {
    const creatorId = (req.createdBy?._id || req.createdBy?.id || req.createdBy)?.toString();
    if (currentUserId && creatorId === currentUserId) return false;
    if (req.status && req.status !== 'ACTIVE' && req.status !== 'PARTIALLY_FULFILLED') {
      return false;
    }
    if (!currentUser?.availability || !currentUser?.bloodGroup) {
      return false;
    }
    return isDonorCompatible(currentUser.bloodGroup, req.patientBloodGroup);
  });

  const recentRequests = matchingRequests.slice(0, 3);
  const recentNotifs = notifications.slice(0, 3);

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto w-full">
      <DashboardGreetingHeader currentUser={currentUser} />

      {/* TOP THREE STATUS CARDS + IMPACT SIDEBAR ROW */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-4/5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <BloodGroupCard
            bloodGroup={currentUser?.bloodGroup}
            onSet={() => navigate('/profile')}
          />
          <AvailabilityCard
            availability={currentUser?.availability}
            onToggle={toggleAvailability}
          />
          <LocationCard
            location={currentUser?.location}
            onSet={() => navigate('/profile')}
          />
        </div>

        <ImpactSummaryCard currentUser={currentUser} />
      </div>

      <CommunityHeroBanner />

      {/* RECENT BLOOD REQUESTS + RECENT NOTIFICATIONS GRID */}
      <div className="flex flex-col lg:flex-row gap-6">
        <RecentRequestsFeed
          recentRequests={recentRequests}
          currentUser={currentUser}
        />
        <RecentNotificationsFeed recentNotifs={recentNotifs} />
      </div>

      <QuickActionsToolbar />
    </div>
  );
};

export default DashboardPage;
