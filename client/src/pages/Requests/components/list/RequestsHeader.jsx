import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestsHeader = ({ totalCount, loading, hasItems }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
            My Requests
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#d93829] text-xs font-black">
            {totalCount} Total
          </span>
          {loading && hasItems && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs font-bold animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-[#d93829]" />
              <span>Updating...</span>
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
          Manage and track your emergency blood donation requests in real time.
        </p>
      </div>

      <button
        onClick={() => navigate('/requests/create')}
        className="clay-btn-crimson px-5 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Create Blood Request</span>
      </button>
    </div>
  );
};

export default RequestsHeader;
