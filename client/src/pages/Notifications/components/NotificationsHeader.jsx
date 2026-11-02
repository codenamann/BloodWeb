import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ClayMailEnvelope } from '../../../components/ClayAssets/ClayIllustrations';

export const NotificationsHeader = () => {
  return (
    <div className="clay-card p-6 sm:p-8 bg-gradient-to-r from-red-50/80 via-white to-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-red-100/50">
      <div className="space-y-2 text-center md:text-left z-10 max-w-lg">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-4xl font-black text-[#1c1d22] tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          Stay updated with everything that matters in your blood coordination network.
        </p>
      </div>

      {/* 3D Envelope with Heart */}
      <div className="shrink-0 flex items-center justify-center">
        <ClayMailEnvelope size={150} />
      </div>
    </div>
  );
};

export default NotificationsHeader;
