import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MapPin, Building, Clock, Droplets, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { BLOOD_GROUPS, isDonorCompatible } from '../../utils/compatibility';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';

export const RequestsPage = () => {
  const { currentUser } = useAuth();
  const { requests } = useBloodRequests();
  const navigate = useNavigate();

  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'MINE' | 'COMPATIBLE'

  const filteredRequests = requests.filter((req) => {
    const matchGroup = selectedGroup === 'ALL' || req.patientBloodGroup === selectedGroup;
    const matchUrgency = selectedUrgency === 'ALL' || req.urgency === selectedUrgency;
    const matchSearch =
      req.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.hospitalAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.patientBloodGroup.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchTab = true;
    if (activeTab === 'MINE') {
      matchTab = req.createdBy?._id === currentUser?._id;
    } else if (activeTab === 'COMPATIBLE') {
      matchTab = currentUser?.bloodGroup ? isDonorCompatible(currentUser.bloodGroup, req.patientBloodGroup) : true;
    }

    return matchGroup && matchUrgency && matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-16">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
              Blood Requests Network
            </h1>
            <p className="text-xs sm:text-sm text-[#575965] font-medium mt-0.5">
              Live emergency requirements matched with verified donors in real time
            </p>
          </div>

          <button
            onClick={() => navigate('/requests/create')}
            className="clay-btn-crimson px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Blood Request</span>
          </button>
        </div>

        {/* Filter & View Tabs Toolbar */}
        <div className="clay-card-flat p-3.5 sm:p-5 bg-white/90 space-y-3 sm:space-y-4">
          
          {/* Top Row: Search & View Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital or location..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
              />
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#faf7f2] border border-stone-200/60 w-full md:w-auto justify-between overflow-x-auto">
              {[
                { id: 'ALL', label: 'All Requests' },
                { id: 'COMPATIBLE', label: `Matches (${currentUser?.bloodGroup || 'My Type'})` },
                { id: 'MINE', label: 'My Requests' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'clay-btn-crimson text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Bottom Row: Blood Group Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
            <span className="text-[11px] sm:text-xs font-bold text-[#747682] mr-1">Filter Group:</span>
            {['ALL', ...BLOOD_GROUPS].map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                  selectedGroup === group
                    ? 'clay-btn-crimson text-white shadow-sm scale-105'
                    : 'clay-btn-cream text-slate-700 hover:text-slate-900'
                }`}
              >
                {group}
              </button>
            ))}

            <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 pt-2 sm:pt-0">
              <span className="text-[11px] sm:text-xs font-bold text-[#747682]">Urgency:</span>
              {['ALL', 'CRITICAL', 'HIGH'].map((urg) => (
                <button
                  key={urg}
                  onClick={() => setSelectedUrgency(urg)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all cursor-pointer ${
                    selectedUrgency === urg
                      ? 'bg-red-100 text-[#d93829] font-black border border-red-200'
                      : 'bg-stone-50 text-slate-600 hover:bg-stone-100'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="clay-card p-8 sm:p-12 text-center bg-white space-y-3">
            <Droplets className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-[#1c1d22]">No Matching Blood Requests Found</h3>
            <p className="text-xs text-[#575965] max-w-sm mx-auto">
              Try adjusting your blood type filter, location search, or create a new emergency blood request.
            </p>
            <button
              onClick={() => { setSelectedGroup('ALL'); setSelectedUrgency('ALL'); setSearchQuery(''); setActiveTab('ALL'); }}
              className="clay-btn-cream px-4 py-2 text-xs font-bold mt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredRequests.map((req) => {
              const isCompatible = currentUser?.bloodGroup && isDonorCompatible(currentUser.bloodGroup, req.patientBloodGroup);
              const isMyReq = req.createdBy?._id === currentUser?._id;

              return (
                <motion.div
                  key={req._id}
                  whileHover={{ y: -3 }}
                  className="clay-card p-4 sm:p-6 bg-white flex flex-col justify-between"
                >
                  <div>
                    {/* Urgency & Status Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        req.urgency === 'CRITICAL'
                          ? 'bg-red-100 text-[#d93829]'
                          : req.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-slate-700'
                      }`}>
                        {req.urgency} Urgency
                      </span>

                      {isCompatible && !isMyReq && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-extrabold flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-emerald-600 text-emerald-600" /> Compatible
                        </span>
                      )}

                      {isMyReq && (
                        <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[9px] sm:text-[10px] font-extrabold">
                          Created by You
                        </span>
                      )}
                    </div>

                    {/* Blood Group & Units */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl clay-card-crimson flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                        <span className="text-base sm:text-lg font-black leading-none">{req.patientBloodGroup}</span>
                        <span className="text-[8px] font-bold opacity-75">TYPE</span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-[#1c1d22]">
                          {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
                        </h3>
                        <p className="text-xs text-[#575965] font-semibold mt-0.5">
                          {req.neededBy}
                        </p>
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="space-y-1 text-xs text-[#575965] bg-[#faf7f2] p-2.5 sm:p-3 rounded-2xl border border-stone-100 mb-3">
                      <div className="flex items-center gap-1.5 font-bold text-[#1c1d22]">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{req.hospitalName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#747682]">
                        <MapPin className="w-3.5 h-3.5 text-[#d93829] shrink-0" />
                        <span className="truncate">{req.hospitalAddress}</span>
                      </div>
                    </div>

                    {req.patientCondition && (
                      <p className="text-xs text-[#747682] line-clamp-2 italic mb-3">
                        "{req.patientCondition}"
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-emerald-700 font-bold">
                      {req.responses?.length || 0} Donors Joined
                    </span>

                    <button
                      onClick={() => navigate(`/requests/${req._id}`)}
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 clay-btn-crimson text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span>{isMyReq ? 'Manage' : 'View'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default RequestsPage;
