import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClayLogo from '../ClayAssets/ClayLogo';

export const ProtectedRoute = () => {
  const { currentUser, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f6f1eb] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <ClayLogo size="lg" />
          <div className="w-8 h-8 border-3 border-[#d93829] border-t-transparent rounded-full animate-spin mt-2" />
          <p className="text-xs font-semibold text-[#575965] tracking-wide">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
