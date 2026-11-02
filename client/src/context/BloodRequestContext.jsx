import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCompatibleDonorGroups,
  calculateDistanceKm,
  calculateRankScore,
} from '../utils/compatibility';
import { MOCK_USERS } from '../data/mockData';
import {
  createBloodRequest,
  getMyRequests,
  getAllRequests,
  cancelBloodRequest,
} from '../api/request.api';
import { useAuth } from './AuthContext';

const BloodRequestContext = createContext(null);

export const MOCK_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'City General Hospital',
    city: 'new york',
    area: 'Central Medical District',
    address: '420 1st Avenue, New York, NY 10016',
    phone: '+1 (555) 789-4400',
    coordinates: { lat: 40.7135, lng: -74.005 },
    emergencyContact: 'Emergency Desk Ext. 4',
  },
  {
    id: 'hosp-2',
    name: 'HopeCare Foundation Trauma Center',
    city: 'new york',
    area: 'West Midtown Corridor',
    address: '550 10th Avenue, New York, NY 10018',
    phone: '+1 (555) 890-5500',
    coordinates: { lat: 40.724, lng: -73.998 },
    emergencyContact: 'Trauma Blood Bank Ext. 9',
  },
  {
    id: 'hosp-3',
    name: 'LifeLine Children Hospital',
    city: 'new york',
    area: 'East River Health Campus',
    address: '710 East 34th Street, New York, NY 10016',
    phone: '+1 (555) 901-6600',
    coordinates: { lat: 40.738, lng: -73.985 },
    emergencyContact: 'Pediatric Transfusion Line',
  },
  {
    id: 'hosp-4',
    name: 'RedCross Society Regional Hub',
    city: 'new york',
    area: 'Downtown Dispatch Center',
    address: '150 Water Street, New York, NY 10038',
    phone: '+1 (555) 912-7700',
    coordinates: { lat: 40.707, lng: -74.006 },
    emergencyContact: 'Blood Dispatch Lead',
  },
  {
    id: 'hosp-5',
    name: 'CareWell Community Hospital',
    city: 'new york',
    area: 'Upper Manhattan District',
    address: '1280 Amsterdam Ave, New York, NY 10027',
    phone: '+1 (555) 923-8800',
    coordinates: { lat: 40.812, lng: -73.96 },
    emergencyContact: 'Ward Coordinator',
  },
];

const INITIAL_REQUESTS = [
  {
    _id: 'req-1',
    patientBloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalId: 'hosp-1',
    hospitalName: 'City General Hospital',
    hospitalAddress: '420 1st Avenue, New York, NY 10016',
    hospitalCoordinates: { lat: 40.7135, lng: -74.005 },
    urgency: 'CRITICAL',
    status: 'ACTIVE',
    neededBy: 'Immediate / Next 45 mins',
    patientCondition:
      'Emergency ICU Surgery following motor accident trauma. Low haemoglobin levels.',
    hospitalDocument: 'admission_slip_7721.pdf',
    createdBy: {
      _id: 'user-sarah',
      name: 'Sarah Jenkins',
      phone: '+1 (555) 234-5678',
      email: 'sarah.jenkins@example.com',
      avatarType: 'sarah',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    responses: [
      {
        _id: 'resp-1',
        requestId: 'req-1',
        donorId: 'user-alex',
        status: 'ACCEPTED',
        estimatedDistanceKm: 1.8,
        eta: '8 mins',
        locationAtResponse: { lat: 40.715, lng: -74.002 },
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
      {
        _id: 'resp-2',
        requestId: 'req-1',
        donorId: 'user-david',
        status: 'PENDING',
        estimatedDistanceKm: 3.2,
        eta: '15 mins',
        locationAtResponse: { lat: 40.728, lng: -73.995 },
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ],
  },
  {
    _id: 'req-2',
    patientBloodGroup: 'A+',
    unitsNeeded: 3,
    hospitalId: 'hosp-2',
    hospitalName: 'HopeCare Foundation Trauma Center',
    hospitalAddress: '550 10th Avenue, New York, NY 10018',
    hospitalCoordinates: { lat: 40.724, lng: -73.998 },
    urgency: 'HIGH',
    status: 'ACTIVE',
    neededBy: 'Within 3 hours',
    patientCondition:
      'Cardiac bypass operation preparation scheduled for afternoon ward.',
    hospitalDocument: 'doctor_order_cardiac.pdf',
    createdBy: {
      _id: 'user-elena',
      name: 'Elena Rostova',
      phone: '+1 (555) 912-3344',
      email: 'elena.rostova@example.com',
      avatarType: 'elena',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    responses: [],
  },
  {
    _id: 'req-3',
    patientBloodGroup: 'B-',
    unitsNeeded: 1,
    hospitalId: 'hosp-3',
    hospitalName: 'LifeLine Children Hospital',
    hospitalAddress: '710 East 34th Street, New York, NY 10016',
    hospitalCoordinates: { lat: 40.738, lng: -73.985 },
    urgency: 'CRITICAL',
    status: 'ACTIVE',
    neededBy: 'Within 90 mins',
    patientCondition: 'Pediatric urgent blood count stabilization.',
    hospitalDocument: 'pediatric_requisition_402.pdf',
    createdBy: {
      _id: 'user-michael',
      name: 'Michael Vance',
      phone: '+1 (555) 443-8899',
      email: 'm.vance@example.com',
      avatarType: 'alex',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    responses: [],
  },
];

export const BloodRequestProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [myPagination, setMyPagination] = useState({ page: 1, limit: 10, total: 0, hasMore: false });
  const [networkPagination, setNetworkPagination] = useState({ page: 1, limit: 10, total: 0, hasMore: false });

  const [myRequests, setMyRequests] = useState([]);
  const [networkRequests, setNetworkRequests] = useState([]);

  // Compute unified requests for any legacy consumers
  const requests = useMemo(() => {
    const map = new Map();
    networkRequests.forEach((req) => {
      if (req?._id) map.set(req._id.toString(), req);
    });
    myRequests.forEach((req) => {
      if (req?._id) map.set(req._id.toString(), req);
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [myRequests, networkRequests]);

  const fetchMyRequests = useCallback(async (filters = {}, isAppend = false) => {
    const token = localStorage.getItem('bloodweb_token');
    if (!token) return;

    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const page = isAppend ? (myPagination.page || 1) + 1 : 1;
      const res = await getMyRequests({
        page,
        limit: 10,
        status: filters.status,
        bloodGroup: filters.bloodGroup,
        search: filters.search,
      });

      const newRequests = res.requests || [];
      const newPagination = res.pagination || { page, limit: 10, total: newRequests.length, hasMore: false };

      setMyRequests((prev) => {
        if (!isAppend) return newRequests;
        const existingIds = new Set(prev.map(r => r._id?.toString()));
        const unique = newRequests.filter(r => !existingIds.has(r._id?.toString()));
        return [...prev, ...unique];
      });

      setMyPagination(newPagination);
      return res;
    } catch (err) {
      console.error('Failed to fetch my requests:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load my requests');
      throw err;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [myPagination.page]);

  const fetchNetworkRequests = useCallback(async (filters = {}, isAppend = false) => {
    const token = localStorage.getItem('bloodweb_token');
    if (!token) return;

    // Fast-path guard: unconfigured or unavailable donors do not receive incoming network requests
    if (!currentUser?.availability || !currentUser?.bloodGroup) {
      setNetworkRequests([]);
      setNetworkPagination({ page: 1, limit: 10, total: 0, hasMore: false });
      return { requests: [], pagination: { page: 1, limit: 10, total: 0, hasMore: false } };
    }

    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const page = isAppend ? (networkPagination.page || 1) + 1 : 1;
      const res = await getAllRequests({
        page,
        limit: 10,
        status: filters.status,
        bloodGroup: filters.bloodGroup,
        search: filters.search,
        excludeUser: (currentUser?._id || currentUser?.id)?.toString(),
        donorBloodGroup: currentUser?.bloodGroup,
      });

      const newRequests = res.requests || [];
      const newPagination = res.pagination || { page, limit: 10, total: newRequests.length, hasMore: false };

      setNetworkRequests((prev) => {
        if (!isAppend) return newRequests;
        const existingIds = new Set(prev.map(r => r._id?.toString()));
        const unique = newRequests.filter(r => !existingIds.has(r._id?.toString()));
        return [...prev, ...unique];
      });

      setNetworkPagination(newPagination);
      return res;
    } catch (err) {
      console.error('Failed to fetch network requests:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load network requests');
      throw err;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [networkPagination.page, currentUser]);

  const refreshRequests = useCallback(async (filters = {}) => {
    const token = localStorage.getItem('bloodweb_token');
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      await Promise.allSettled([
        fetchMyRequests(filters, false),
        fetchNetworkRequests(filters, false),
      ]);
    } catch (err) {
      console.error('Failed to refresh blood requests:', err);
      setError(err.message || 'Failed to refresh blood requests');
    } finally {
      setLoading(false);
    }
  }, [fetchMyRequests, fetchNetworkRequests]);

  const loadMoreMyRequests = useCallback(async (filters = {}) => {
    if (!myPagination.hasMore || loadingMore) return;
    return fetchMyRequests(filters, true);
  }, [fetchMyRequests, myPagination.hasMore, loadingMore]);

  const loadMoreNetworkRequests = useCallback(async (filters = {}) => {
    if (!networkPagination.hasMore || loadingMore) return;
    return fetchNetworkRequests(filters, true);
  }, [fetchNetworkRequests, networkPagination.hasMore, loadingMore]);

  useEffect(() => {
    if (isAuthenticated || currentUser) {
      refreshRequests();
    }
  }, [isAuthenticated, currentUser, refreshRequests]);

  const createRequest = async (requestData) => {
    try {
      const newRequest = await createBloodRequest(requestData);
      setMyRequests((prev) => [newRequest, ...prev.filter((r) => r._id !== newRequest._id)]);
      setMyPagination((prev) => ({
        ...prev,
        total: (prev.total || 0) + 1,
      }));
      return newRequest;
    } catch (error) {
      console.error("Failed to create request:", error);
      throw error;
    }
  };

  const volunteerForRequest = (requestId, donorUser) => {
    const target = myRequests.find((r) => r._id === requestId) || networkRequests.find((r) => r._id === requestId);
    if (!target) return null;

    const alreadyVolunteered = target.responses?.some(
      (resp) => resp.donorId === donorUser._id
    );
    if (alreadyVolunteered) return target;

    const hospitalCoords = target.hospitalCoordinates || {
      lat: 40.7135,
      lng: -74.005,
    };
    const donorCoords = donorUser.location?.coordinates || {
      lat: 40.715,
      lng: -74.002,
    };
    const distanceKm =
      Math.round(
        calculateDistanceKm(
          hospitalCoords.lat,
          hospitalCoords.lng,
          donorCoords.lat,
          donorCoords.lng
        ) * 10
      ) / 10;
    const etaMinutes = Math.max(5, Math.round(distanceKm * 4));

    const newResponse = {
      _id: `resp-${Date.now()}`,
      requestId,
      donorId: donorUser._id,
      donor: donorUser,
      status: 'PENDING',
      estimatedDistanceKm: distanceKm,
      eta: `${etaMinutes} mins`,
      locationAtResponse: donorCoords,
      createdAt: new Date().toISOString(),
    };

    const updater = (req) => {
      if (req._id === requestId) {
        return {
          ...req,
          responses: [...(req.responses || []), newResponse],
        };
      }
      return req;
    };

    setMyRequests((prev) => prev.map(updater));
    setNetworkRequests((prev) => prev.map(updater));
    return newResponse;
  };

  const updateVolunteerStatus = (requestId, responseId, newStatus) => {
    const updater = (req) => {
      if (req._id === requestId) {
        const updatedResponses = (req.responses || []).map((resp) => {
          if (resp._id === responseId) {
            return { ...resp, status: newStatus };
          }
          return resp;
        });

        const acceptedCount = updatedResponses.filter(
          (r) => r.status === 'ACCEPTED'
        ).length;
        let nextReqStatus = req.status;
        if (acceptedCount >= req.unitsNeeded && req.status === 'ACTIVE') {
          nextReqStatus = 'PARTIALLY_FULFILLED';
        }

        return {
          ...req,
          responses: updatedResponses,
          status: nextReqStatus,
        };
      }
      return req;
    };

    setMyRequests((prev) => prev.map(updater));
    setNetworkRequests((prev) => prev.map(updater));
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    let backendResult = null;
    if (newStatus === 'CANCELLED') {
      backendResult = await cancelBloodRequest(requestId);
    }

    const updater = (req) => {
      if (req._id === requestId) {
        return backendResult ? { ...req, ...backendResult, status: newStatus } : { ...req, status: newStatus };
      }
      return req;
    };

    setMyRequests((prev) => prev.map(updater));
    setNetworkRequests((prev) => prev.map(updater));
    return backendResult;
  };

  const getMatchingDonorsForRequest = (request) => {
    if (!request) return [];
    const eligibleGroups = getCompatibleDonorGroups(request.patientBloodGroup);
    const hospitalCoords = request.hospitalCoordinates || {
      lat: 40.7135,
      lng: -74.005,
    };

    return MOCK_USERS.filter((user) => {
      const isEligible = eligibleGroups.includes(user.bloodGroup);
      const isAvailable = user.availability;
      const notRequester = user._id !== request.createdBy?._id;
      return isEligible && isAvailable && notRequester;
    })
      .map((donor) => {
        const donorCoords = donor.location?.coordinates || {
          lat: 40.715,
          lng: -74.002,
        };
        const distanceKm =
          Math.round(
            calculateDistanceKm(
              hospitalCoords.lat,
              hospitalCoords.lng,
              donorCoords.lat,
              donorCoords.lng
            ) * 10
          ) / 10;
        const rankScore = calculateRankScore(
          distanceKm,
          donor.totalVolunteers,
          donor.successfulDonations
        );
        return {
          ...donor,
          distanceKm,
          rankScore,
        };
      })
      .sort((a, b) => b.rankScore - a.rankScore);
  };

  const getRequestById = (id) => {
    return requests.find((r) => r._id === id);
  };

  return (
    <BloodRequestContext.Provider
      value={{
        requests,
        myRequests,
        networkRequests,
        loading,
        loadingMore,
        error,
        myPagination,
        networkPagination,
        fetchMyRequests,
        fetchNetworkRequests,
        loadMoreMyRequests,
        loadMoreNetworkRequests,
        refreshRequests,
        hospitals: MOCK_HOSPITALS,
        createRequest,
        volunteerForRequest,
        updateVolunteerStatus,
        updateRequestStatus,
        getMatchingDonorsForRequest,
        getRequestById,
      }}
    >
      {children}
    </BloodRequestContext.Provider>
  );
};

export const useBloodRequests = () => {
  const context = useContext(BloodRequestContext);
  if (!context) {
    throw new Error(
      'useBloodRequests must be used within a BloodRequestProvider'
    );
  }
  return context;
};

export default BloodRequestContext;
