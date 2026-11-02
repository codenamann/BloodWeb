import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchHospitals } from '../../../../api/hospital.api';
import { HospitalSearchResultsDropdown } from './HospitalSearchResultsDropdown';
import { SelectedHospitalCard } from './SelectedHospitalCard';

export const HospitalInformationSection = ({
  selectedHospital,
  onSelectHospital,
  defaultCity = '',
}) => {
  const [hospitalQuery, setHospitalQuery] = useState('');
  const [hospitalCity, setHospitalCity] = useState(defaultCity);
  const [isSearchingHospitals, setIsSearchingHospitals] = useState(false);
  const [hospitalResults, setHospitalResults] = useState([]);
  const [hospitalSearchError, setHospitalSearchError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreHospitals, setHasMoreHospitals] = useState(false);
  const [isLoadingMoreHospitals, setIsLoadingMoreHospitals] = useState(false);

  const lastSearchedRef = useRef('');
  const searchRequestIdRef = useRef(0);

  useEffect(() => {
    if (defaultCity && !hospitalCity) {
      setHospitalCity(defaultCity);
    }
  }, [defaultCity, hospitalCity]);

  // Live debounced search
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
          console.error(err);
          setHospitalSearchError('Failed to fetch hospitals. Please try again.');
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
          const newHospitals = results.hospitals || [];
          const existingIds = new Set(prev.map((h) => h._id));
          const filteredNew = newHospitals.filter((h) => !existingIds.has(h._id));
          return [...prev, ...filteredNew];
        });
        setHasMoreHospitals(results.pagination?.hasMore || false);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      if (requestId === searchRequestIdRef.current) {
        console.error('Error loading more hospitals:', err);
        setHospitalSearchError('Failed to fetch more hospitals. Please try again.');
      }
    } finally {
      if (requestId === searchRequestIdRef.current) {
        setIsLoadingMoreHospitals(false);
      }
    }
  };

  const handleSelectHospital = (hosp) => {
    onSelectHospital(hosp);
    setHospitalQuery('');
    setHospitalResults([]);
  };

  return (
    <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
          2
        </span>
        <div>
          <h3 className="text-sm font-black text-stone-900">Hospital Information</h3>
          <p className="text-[11px] text-stone-500 font-medium">
            Select the hospital where the blood is needed.
          </p>
        </div>
      </div>

      {/* Hospital Search Inputs */}
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
                onChange={(e) => {
                  setHospitalQuery(e.target.value);
                  if (selectedHospital) onSelectHospital(null);
                }}
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
                onChange={(e) => {
                  setHospitalCity(e.target.value);
                  if (selectedHospital) onSelectHospital(null);
                }}
                placeholder="Enter city"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Live Hospital Suggestions Dropdown */}
        {hospitalQuery.trim().length >= 2 && hospitalCity.trim() && (
          <HospitalSearchResultsDropdown
            hospitalResults={hospitalResults}
            isSearchingHospitals={isSearchingHospitals}
            hospitalSearchError={hospitalSearchError}
            hasMoreHospitals={hasMoreHospitals}
            isLoadingMoreHospitals={isLoadingMoreHospitals}
            handleSelectHospital={handleSelectHospital}
            handleLoadMoreHospitals={handleLoadMoreHospitals}
          />
        )}
      </div>

      {/* Selected Hospital Display */}
      <SelectedHospitalCard selectedHospital={selectedHospital} />
    </div>
  );
};

export default HospitalInformationSection;
