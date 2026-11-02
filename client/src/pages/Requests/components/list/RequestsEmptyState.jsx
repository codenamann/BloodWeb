import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClayBloodDrop } from '../../../../components/ClayAssets/ClayBloodDrop';

export const RequestsEmptyState = ({ scopeTab, currentUser }) => {
  const navigate = useNavigate();

  return (
    <div className="clay-card p-12 text-center bg-white space-y-4 shadow-sm">
      <div className="w-16 h-16 mx-auto flex items-center justify-center">
        <ClayBloodDrop size={54} />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base font-black text-stone-900">
          No Blood Requests Found
        </h3>
        <p className="text-xs text-stone-500 font-medium">
          {scopeTab === 'MINE'
            ? "You haven't posted any blood requests matching the selected filters."
            : !currentUser?.bloodGroup
            ? "You haven't set your blood group yet. Configure your donor requirements to discover matching emergency blood requests."
            : !currentUser?.location?.city
            ? "Your location is not set yet. Configure your location to discover emergency blood requests in your area."
            : !currentUser?.availability
            ? "Your donor availability is currently paused. Turn your availability ON to discover emergency requests."
            : `No emergency blood requests matching your blood type (${currentUser.bloodGroup}) and selected filters right now.`}
        </p>
      </div>
      {scopeTab === 'MINE' ? (
        <button
          onClick={() => navigate('/requests/create')}
          className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Request</span>
        </button>
      ) : !currentUser?.bloodGroup || !currentUser?.availability || !currentUser?.location?.city ? (
        <button
          onClick={() => navigate('/donors')}
          className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Heart className="w-4 h-4" />
          <span>Configure Discovery Requirements</span>
        </button>
      ) : null}
    </div>
  );
};

export default RequestsEmptyState;
