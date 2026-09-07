import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  ShieldCheck,
  Heart,
  Users,
  Filter,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS } from '../../data/mockData';
import { BLOOD_GROUPS } from '../../utils/compatibility';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';
import ClayAvatar from '../../components/ClayAssets/ClayAvatar';

export const DonorsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [searchCity, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const donorsList = [
    ...MOCK_USERS,
    {
      _id: 'user-marcus',
      name: 'Marcus Chen',
      email: 'marcus.chen@example.com',
      phone: '+1 (555) 749-1122',
      bloodGroup: 'O+',
      avatarType: 'alex',
      location: {
        city: 'new york',
        area: 'South District',
        coordinates: { lat: 40.71, lng: -74.008 },
      },
      availability: true,
      totalVolunteers: 22,
      successfulDonations: 22,
      roleTag: 'Active O+ Donor',
    },
    {
      _id: 'user-emily',
      name: 'Emily Watson',
      email: 'emily.watson@example.com',
      phone: '+1 (555) 832-3344',
      bloodGroup: 'A-',
      avatarType: 'sarah',
      location: {
        city: 'new york',
        area: 'Sunset Park',
        coordinates: { lat: 40.73, lng: -73.99 },
      },
      availability: true,
      totalVolunteers: 11,
      successfulDonations: 10,
      roleTag: 'Rare A- Donor',
    },
    {
      _id: 'user-michael',
      name: 'Michael Vance',
      email: 'm.vance@example.com',
      phone: '+1 (555) 443-8899',
      bloodGroup: 'B-',
      avatarType: 'david',
      location: {
        city: 'new york',
        area: 'North Bay District',
        coordinates: { lat: 40.74, lng: -73.98 },
      },
      availability: true,
      totalVolunteers: 8,
      successfulDonations: 8,
      roleTag: 'Rare B- Donor',
    },
  ];

  const filteredDonors = donorsList.filter((donor) => {
    const matchGroup =
      selectedGroup === 'ALL' || donor.bloodGroup === selectedGroup;
    const matchAvail = !onlyAvailable || donor.availability;
    const matchCity =
      donor.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      donor.location?.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      donor.location?.area.toLowerCase().includes(searchCity.toLowerCase());
    return matchGroup && matchAvail && matchCity;
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
              Donor Discovery Network
            </h1>
            <p className="text-xs sm:text-sm text-[#575965] font-medium mt-0.5">
              Discover verified volunteers ranked by compatibility, proximity,
              and donation reliability
            </p>
          </div>

          <button
            onClick={() => navigate('/requests/create')}
            className="clay-btn-crimson px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <span>Broadcast Request to Network</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="clay-card-flat p-3.5 sm:p-5 bg-white/90 space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor name or neighborhood..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
              />
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-2 text-xs font-extrabold text-[#1c1d22] cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-[#d93829] rounded accent-[#d93829]"
              />
              <span>Show Available Only</span>
            </label>
          </div>

          {/* Blood Group Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
            <span className="text-[11px] sm:text-xs font-bold text-[#747682] mr-1">
              Blood Group:
            </span>
            {['ALL', ...BLOOD_GROUPS].map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                  selectedGroup === group
                    ? 'clay-btn-crimson text-white shadow-sm scale-105'
                    : 'clay-btn-cream text-slate-700'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDonors.map((donor) => {
            const reliability = donor.totalVolunteers
              ? Math.round(
                  (donor.successfulDonations / donor.totalVolunteers) * 100
                )
              : 100;

            return (
              <motion.div
                key={donor._id}
                whileHover={{ y: -3 }}
                className="clay-card p-4 sm:p-6 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        donor.availability
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${donor.availability ? 'bg-emerald-600' : 'bg-slate-400'}`}
                      />
                      {donor.availability ? 'Available (Ready)' : 'Paused'}
                    </span>

                    <span className="px-2 py-0.2 rounded-md bg-stone-100 text-[#575965] text-[9px] sm:text-[10px] font-bold">
                      {donor.roleTag || 'Donor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-3">
                    <ClayAvatar
                      type={donor.avatarType || 'alex'}
                      size={50}
                      showBadge={true}
                      badgeColor="crimson"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1c1d22]">
                        {donor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#575965] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#d93829]" />
                        <span>
                          {donor.location?.area || 'New York'},{' '}
                          {donor.location?.city}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.2 rounded-md bg-red-50 text-[#d93829] font-black text-[11px] sm:text-xs border border-red-200">
                          Type {donor.bloodGroup}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#747682] font-semibold">
                          {donor.totalVolunteers || 0} donations
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-2xl bg-[#faf7f2] border border-stone-100 flex items-center justify-between text-xs text-[#575965] mb-3">
                    <span>Reliability:</span>
                    <strong className="text-emerald-700 font-extrabold">
                      {reliability}% ({donor.successfulDonations || 0} verified)
                    </strong>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-100 flex gap-2">
                  <button
                    onClick={() => navigate('/requests/create')}
                    className="w-full py-2.5 clay-btn-crimson text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Dispatch Emergency Alert</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default DonorsPage;
