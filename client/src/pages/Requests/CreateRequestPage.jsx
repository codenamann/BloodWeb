import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  FileText,
  CheckCircle2,
  HelpCircle,
  Search,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { searchHospitals } from '../../api/hospital.api';
import { BLOOD_GROUPS } from '../../utils/compatibility';

import { ClayHandsHeart } from '../../components/ClayAssets/ClayIllustrations';

export const CreateRequestPage = () => {
  const { currentUser } = useAuth();
  const { createRequest } = useBloodRequests();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientBloodGroup: '',
    unitsNeeded: 2,
    hospitalId: '',
    urgency: 'NORMAL',
    neededBy: '',
    patientCondition: '',
    hospitalDocument: '',
  });

  const [hospitalQuery, setHospitalQuery] = useState('');
  const [hospitalCity, setHospitalCity] = useState(
    currentUser?.location?.city || ''
  );
  const [isSearchingHospitals, setIsSearchingHospitals] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalResults, setHospitalResults] = useState([]);
  const [hospitalSearchError, setHospitalSearchError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreHospitals, setHasMoreHospitals] = useState(false);
  const [isLoadingMoreHospitals, setIsLoadingMoreHospitals] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastSearchedRef = useRef('');
  const searchRequestIdRef = useRef(0);

  // Populate city from currentUser when it becomes available
  useEffect(() => {
    if (currentUser?.location?.city && !hospitalCity) {
      setHospitalCity(currentUser.location.city);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Fetch hospitals based on search
  useEffect(() => {
    const query = hospitalQuery.trim();
    const city = hospitalCity.trim();

    if (!query || query.length < 3 || !city || city.length < 2) {
      setHospitalResults([]);
      setHasMoreHospitals(false);
      setCurrentPage(1);
      setHospitalSearchError(null);
      lastSearchedRef.current = '';
      return;
    }

    const searchKey = `${query.toLowerCase()}|${city.toLowerCase()}`;
    if (lastSearchedRef.current === searchKey) {
      return;
    }

    const timer = setTimeout(async () => {
      lastSearchedRef.current = searchKey;
      const requestId = ++searchRequestIdRef.current;

      setIsSearchingHospitals(true);
      setHospitalSearchError(null);

      try {
        const results = await searchHospitals(query, city, 1, 10);
        if (requestId === searchRequestIdRef.current) {
          setHospitalResults(results.hospitals || []);
          setHasMoreHospitals(results.pagination?.hasMore || false);
          setCurrentPage(1);
        }
      } catch (err) {
        if (requestId === searchRequestIdRef.current) {
          console.dir(err);
          setHospitalSearchError(
            'Failed to fetch hospitals. Please try again.'
          );
        }
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setIsSearchingHospitals(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [hospitalQuery, hospitalCity]);

  const handleLoadMoreHospitals = async () => {
    if (isLoadingMoreHospitals || !hasMoreHospitals) return;

    const query = hospitalQuery.trim();
    const city = hospitalCity.trim();
    const nextPage = currentPage + 1;

    const requestId = ++searchRequestIdRef.current;
    setIsLoadingMoreHospitals(true);

    try {
      const results = await searchHospitals(query, city, nextPage, 10);
      if (requestId === searchRequestIdRef.current) {
        setHospitalResults((prev) => {
          // Deduplicate based on _id
          const newHospitals = results.hospitals || [];
          const existingIds = new Set(prev.map((h) => h._id));
          const filteredNew = newHospitals.filter(
            (h) => !existingIds.has(h._id)
          );
          return [...prev, ...filteredNew];
        });
        setHasMoreHospitals(results.pagination?.hasMore || false);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      if (requestId === searchRequestIdRef.current) {
        console.error('Error loading more hospitals:', err);
        setHospitalSearchError(
          'Failed to fetch more hospitals. Please try again.'
        );
      }
    } finally {
      if (requestId === searchRequestIdRef.current) {
        setIsLoadingMoreHospitals(false);
      }
    }
  };

  const handleHospitalQueryChange = (e) => {
    setHospitalQuery(e.target.value);
    if (selectedHospital) {
      setFormData((prev) => ({ ...prev, hospitalId: '' }));
    }
  };

  const handleHospitalCityChange = (e) => {
    setHospitalCity(e.target.value);
    if (selectedHospital) {
      setFormData((prev) => ({ ...prev, hospitalId: '' }));
    }
  };

  const handleSelectHospital = (hosp) => {
    setSelectedHospital(hosp);
    setFormData((prev) => ({ ...prev, hospitalId: hosp._id }));
    setHospitalQuery('');
    setHospitalResults([]);
  };

  const handleUnitsChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      unitsNeeded: Math.max(1, Math.min(10, prev.unitsNeeded + delta)),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowed.includes(file.type)) {
         setHospitalSearchError('Only PDF, JPG, and PNG are allowed');
         return;
      }
      if (file.size > 5 * 1024 * 1024) {
         setHospitalSearchError('File size must be under 5MB');
         return;
      }
      setHospitalSearchError(null);
      setUploadedFileName(file.name);
      setFormData((prev) => ({ ...prev, hospitalDocument: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHospital || !formData.patientBloodGroup || !formData.neededBy || !formData.hospitalDocument) {
        setHospitalSearchError('Please fill all required fields including the document.');
        return;
    }

    setIsSubmitting(true);
    setHospitalSearchError(null);

    try {
      const created = await createRequest({
          ...formData,
          hospitalId: selectedHospital._id,
      });
      setIsSubmitting(false);
      navigate(`/requests/${created._id}`);
    } catch (err) {
      console.error(err);
      setHospitalSearchError(err.response?.data?.message || 'Failed to create request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & HEADER */}
      {/* ========================================================================= */}
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Requests</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
              Create a Blood Request
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Share the details and let our verified donor community help.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/90 text-[#d93829] text-xs font-black self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Help Brings Hope</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN FORM & GUIDELINES GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2-Cols: Stepped Structured Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* ----------------------------------------------------------------------- */}
          {/* STEP 1: PATIENT DETAILS */}
          {/* ----------------------------------------------------------------------- */}
          <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Patient Details
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Tell us about the blood requirement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Blood Group Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-700">
                  Patient's Blood Group{' '}
                  <span className="text-[#d93829]">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map((bg) => {
                    const isActive = formData.patientBloodGroup === bg;
                    return (
                      <button
                        type="button"
                        key={bg}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            patientBloodGroup: bg,
                          }))
                        }
                        className={`relative py-2 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                          isActive
                            ? 'text-white'
                            : 'bg-[#faf7f2] border border-stone-200/80 text-stone-700'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="create-request-blood-group"
                            className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                            style={{ borderRadius: 12 }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 40,
                            }}
                          />
                        )}
                        <span className="relative z-10">{bg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Units Needed Counter */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-700">
                  Units Needed <span className="text-[#d93829]">*</span>
                </label>
                <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#faf7f2] border border-stone-200/80 justify-between">
                  <button
                    type="button"
                    onClick={() => handleUnitsChange(-1)}
                    className="w-9 h-9 rounded-xl clay-btn-cream text-stone-700 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-black text-stone-900">
                    {formData.unitsNeeded}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUnitsChange(1)}
                    className="w-9 h-9 rounded-xl clay-btn-cream text-[#d93829] flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 font-semibold block text-center">
                  (Standard blood donation unit: 350-450 ml)
                </span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 2: HOSPITAL INFORMATION */}
          {/* ----------------------------------------------------------------------- */}
          <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Hospital Information
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Select the hospital where the blood is needed.
                </p>
              </div>
            </div>

            {/* Hospital Search Input */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-700">
                    Hospital Name <span className="text-[#d93829]">*</span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={hospitalQuery}
                      onChange={handleHospitalQueryChange}
                      placeholder="Search hospital..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-700">
                    City <span className="text-[#d93829]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={hospitalCity}
                      onChange={handleHospitalCityChange}
                      placeholder="Enter city"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Live Hospital Suggestions List */}
              {hospitalQuery.trim().length >= 2 && hospitalCity.trim() && (
                <div className="max-h-48 overflow-y-auto rounded-2xl bg-white border border-stone-200 p-2 shadow-lg space-y-1 divide-y divide-stone-100 relative overflow-hidden">
                  {isSearchingHospitals && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <Loader2 className="w-5 h-5 animate-spin text-[#d93829]" />
                    </div>
                  )}
                  {isSearchingHospitals && hospitalResults.length === 0 && (
                    <div className="h-12 w-full" />
                  )}
                  {hospitalSearchError ? (
                    <div className="py-3 text-center text-xs text-red-500 font-medium">
                      {hospitalSearchError}
                    </div>
                  ) : hospitalResults.length === 0 && !isSearchingHospitals ? (
                    <div className="py-3 text-center text-xs text-stone-400 font-medium">
                      No verified hospitals found with that query.
                    </div>
                  ) : (
                    <>
                      {hospitalResults.map((hosp) => (
                        <div
                          key={hosp._id}
                          onClick={() => handleSelectHospital(hosp)}
                          className="pt-2 pb-1.5 px-3 rounded-xl hover:bg-red-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <div className="text-xs font-black text-stone-900">
                              {hosp.name}
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium">
                              {hosp.address}
                            </div>
                          </div>
                          {hosp.verified && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                              Verified
                            </span>
                          )}
                        </div>
                      ))}
                      {hasMoreHospitals && (
                        <div className="pt-2 pb-1">
                          <button
                            type="button"
                            onClick={handleLoadMoreHospitals}
                            disabled={isLoadingMoreHospitals}
                            className="w-full py-2 text-[11px] font-bold text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isLoadingMoreHospitals ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
                                <span>Loading more...</span>
                              </>
                            ) : (
                              <span>Load 10 more</span>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Selected Hospital Card Display */}
            {selectedHospital && (
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#d93829] flex items-center justify-center shadow-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-stone-900">
                        {selectedHospital.name}
                      </span>
                      {selectedHospital.verified && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedHospital.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 3: REQUEST DETAILS (URGENCY & NEEDED BY) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Request Details
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Help donors understand the urgency.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Urgency Level Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-700">
                  Urgency Level <span className="text-[#d93829]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'NORMAL',
                      label: 'Normal',
                      color: 'bg-blue-50 text-blue-800',
                    },
                    {
                      id: 'HIGH',
                      label: 'High',
                      color: 'bg-amber-50 text-amber-900',
                    },
                    {
                      id: 'CRITICAL',
                      label: 'Critical',
                      color: 'bg-red-50 text-[#d93829]',
                    },
                  ].map((u) => {
                    const isActive = formData.urgency === u.id;
                    return (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, urgency: u.id }))
                        }
                        className={`relative py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                          isActive
                            ? 'text-white'
                            : `${u.color} border border-stone-200/80`
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="create-request-urgency"
                            className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                            style={{ borderRadius: 12 }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 40,
                            }}
                          />
                        )}
                        <span className="relative z-10">{u.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Needed By Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-700">
                  Needed By (Timeline) <span className="text-[#d93829]">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="datetime-local"
                    value={formData.neededBy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        neededBy: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Patient Condition Notes */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-extrabold text-stone-700">
                Medical Context / Note for Donors (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.patientCondition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientCondition: e.target.value,
                  }))
                }
                placeholder="e.g. Patient undergoing bypass surgery at 4 PM. Low platelets..."
                className="w-full p-3 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium resize-none"
              />
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 4: SUPPORTING DOCUMENT UPLOAD */}
          {/* ----------------------------------------------------------------------- */}
          <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Supporting Document <span className="text-[#d93829]">*</span>
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Upload a valid doctor's requisition note, prescription, or admission
                  slip. This is required for verification.
                </p>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer bg-[#faf7f2]/60">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600">
                  <FileText className="w-5 h-5 text-[#d93829]" />
                </div>
                <div className="text-xs font-black text-stone-800">
                  {uploadedFileName ? uploadedFileName : 'Upload Document'}
                </div>
                <p className="text-[10px] text-stone-400 font-semibold">
                  PDF, JPG or PNG (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selectedHospital || !formData.patientBloodGroup || !formData.neededBy || !formData.hospitalDocument}
              className="w-full clay-btn-crimson py-3.5 sm:py-4 text-sm font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Broadcasting Request...</span>
                </>
              ) : (
                <>
                  <span>Create Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right 1-Col: Guidance & Tips */}
        <div className="space-y-6">
          {/* Things to keep in mind */}
          <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#d93829]">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                A Few Things to Keep in Mind
              </h4>
            </div>

            <div className="space-y-3">
              {[
                'Provide accurate hospital & ward details.',
                'Upload a valid medical requisition slip. (Required)',
                'Be honest and specific about the needed urgency.',
                'Our community will be notified instantly upon submission.',
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-stone-600 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#d93829] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help Card */}
          <div className="clay-card p-6 bg-white/95 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-stone-500" />
              <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                Need Help?
              </h4>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              If you're unsure about hospital details or blood matching
              protocols, our support team is available 24/7.
            </p>
            <button
              type="button"
              onClick={() =>
                alert('BloodWeb Emergency Support Hotline: +1 (800) 555-BLOOD')
              }
              className="w-full clay-btn-cream py-2 text-xs font-bold text-stone-800"
            >
              Contact Support
            </button>
          </div>

          {/* Supportive Illustration Card */}
          <div className="clay-card p-6 bg-white/95 text-center space-y-2 shadow-sm">
            <div className="flex justify-center">
              <ClayHandsHeart size={140} />
            </div>
            <h4 className="text-xs font-black text-stone-900">
              Together for a Healthier Tomorrow
            </h4>
            <p className="text-[11px] text-stone-500 font-medium">
              Every blood request connects willing donors with lives in need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestPage;
