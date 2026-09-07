import React, { createContext, useContext, useState } from 'react';
import {
  getCompatibleDonorGroups,
  calculateDistanceKm,
  calculateRankScore,
} from '../utils/compatibility';
import { MOCK_USERS } from '../data/mockData';

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
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('bloodweb_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REQUESTS;
      }
    }
    return INITIAL_REQUESTS;
  });

  const saveRequests = (updated) => {
    setRequests(updated);
    localStorage.setItem('bloodweb_requests', JSON.stringify(updated));
  };

  const createRequest = (requestData, creatorUser) => {
    const hospital =
      MOCK_HOSPITALS.find((h) => h.id === requestData.hospitalId) ||
      MOCK_HOSPITALS[0];
    const newRequest = {
      _id: `req-${Date.now()}`,
      patientBloodGroup: requestData.patientBloodGroup,
      unitsNeeded: Number(requestData.unitsNeeded) || 1,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      hospitalCoordinates: hospital.coordinates,
      urgency: requestData.urgency || 'NORMAL',
      status: 'ACTIVE',
      neededBy: requestData.neededBy || 'As soon as possible',
      patientCondition:
        requestData.patientCondition || 'Emergency blood requirement',
      hospitalDocument: requestData.hospitalDocument || null,
      createdBy: {
        _id: creatorUser._id,
        name: creatorUser.name,
        phone: creatorUser.phone,
        email: creatorUser.email,
        avatarType: creatorUser.avatarType || 'alex',
      },
      createdAt: new Date().toISOString(),
      responses: [],
    };

    const updated = [newRequest, ...requests];
    saveRequests(updated);
    return newRequest;
  };

  const volunteerForRequest = (requestId, donorUser) => {
    const target = requests.find((r) => r._id === requestId);
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

    const updatedRequests = requests.map((req) => {
      if (req._id === requestId) {
        return {
          ...req,
          responses: [...(req.responses || []), newResponse],
        };
      }
      return req;
    });

    saveRequests(updatedRequests);
    return newResponse;
  };

  const updateVolunteerStatus = (requestId, responseId, newStatus) => {
    const updatedRequests = requests.map((req) => {
      if (req._id === requestId) {
        const updatedResponses = req.responses.map((resp) => {
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
    });

    saveRequests(updatedRequests);
  };

  const updateRequestStatus = (requestId, newStatus) => {
    const updatedRequests = requests.map((req) => {
      if (req._id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    saveRequests(updatedRequests);
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
