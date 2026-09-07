import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BloodRequestProvider } from './context/BloodRequestContext';
import { CoordinationProvider } from './context/CoordinationContext';
import { NotificationProvider } from './context/NotificationContext';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import VerifyOtpPage from './pages/Auth/VerifyOtpPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import RequestsPage from './pages/Requests/RequestsPage';
import CreateRequestPage from './pages/Requests/CreateRequestPage';
import RequestDetailPage from './pages/Requests/RequestDetailPage';
import CoordinationRoomPage from './pages/Coordination/CoordinationRoomPage';
import DonorsPage from './pages/Donors/DonorsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BloodRequestProvider>
        <CoordinationProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />

                {/* Application Core Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/requests/create" element={<CreateRequestPage />} />
                <Route path="/requests/:id" element={<RequestDetailPage />} />
                <Route path="/coordination/:requestId" element={<CoordinationRoomPage />} />
                <Route path="/donors" element={<DonorsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </CoordinationProvider>
      </BloodRequestProvider>
    </AuthProvider>
  );
}

export default App;