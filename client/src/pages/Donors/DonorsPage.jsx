import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useDonorsPageData } from './hooks/useDonorsPageData';

// Subcomponents
import DonorsHeader from './components/DonorsHeader';
import DonorsFilterBar from './components/DonorsFilterBar';
import DonorsIncompleteRequirements from './components/DonorsIncompleteRequirements';
import DonorRequestCard from './components/DonorRequestCard';
import DonorsSidebar from './components/DonorsSidebar';
import DonorReadinessModal from './components/DonorReadinessModal';

export const DonorsPage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    hasBloodGroup,
    hasLocation,
    isAvailable,
    isDiscoverReady,
    showSetupModal,
    setShowSetupModal,
    selectedUrgency,
    setSelectedUrgency,
    radiusKm,
    setRadiusKm,
    unitsFilter,
    setUnitsFilter,
    sortBy,
    setSortBy,
    sortedRequests,
    handleResetFilters,
    handleSetupSuccess,
  } = useDonorsPageData();

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <DonorsHeader />

      {/* 2. Filters Strip */}
      <DonorsFilterBar
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        selectedUrgency={selectedUrgency}
        onUrgencyChange={setSelectedUrgency}
        unitsFilter={unitsFilter}
        onUnitsChange={setUnitsFilter}
        onReset={handleResetFilters}
        currentUser={currentUser}
      />

      {/* 3. Main Stream & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-3 space-y-4">
          {/* Results Counter & Sort By */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-stone-900">
              {sortedRequests.length}{' '}
              {sortedRequests.length === 1 ? 'Request' : 'Requests'} Found
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-400">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs font-black bg-white rounded-xl border border-stone-200 text-stone-800 cursor-pointer focus:outline-none shadow-xs"
              >
                <option value="NEAREST">Nearest First</option>
                <option value="URGENT">Most Urgent</option>
                <option value="NEWEST">Newest</option>
              </select>
            </div>
          </div>

          {/* Cards Stream */}
          {!isDiscoverReady ? (
            <DonorsIncompleteRequirements
              hasBloodGroup={hasBloodGroup}
              hasLocation={hasLocation}
              isAvailable={isAvailable}
              currentUser={currentUser}
              onConfigureClick={() => setShowSetupModal(true)}
            />
          ) : sortedRequests.length === 0 ? (
            <div className="clay-card p-12 text-center bg-white space-y-3 shadow-xs">
              <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-black text-stone-900">
                No Matching Requests
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No emergency requests match your blood type ({currentUser?.bloodGroup}) and chosen filters right now. Try adjusting your distance radius or urgency filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="clay-btn-cream px-4 py-2 text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRequests.map((req) => (
                <DonorRequestCard
                  key={req._id}
                  request={req}
                  onClick={() => navigate(`/requests/${req._id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <DonorsSidebar
          isDiscoverReady={isDiscoverReady}
          onActionClick={() => setShowSetupModal(true)}
        />
      </div>

      {/* 4. Strict Requirements Setup Modal */}
      <DonorReadinessModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        currentUser={currentUser}
        onSuccess={handleSetupSuccess}
      />
    </div>
  );
};

export default DonorsPage;
