import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BloodRequestProvider } from './context/BloodRequestContext';
import { CoordinationProvider } from './context/CoordinationContext';
import { NotificationProvider } from './context/NotificationContext';

import LandingPage from './pages/LandingPage';
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
import AppShell from './components/layout/AppShell';
import { ToastContainer } from './components/ui/toast-container';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';

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

                {/* Authentication / Guest Routes (Redirects to /dashboard if logged in) */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />
                </Route>

                {/* Application Core Routes (Requires Authentication) */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/requests" element={<RequestsPage />} />
                    <Route
                      path="/requests/create"
                      element={<CreateRequestPage />}
                    />
                    <Route path="/requests/:id" element={<RequestDetailPage />} />
                    <Route
                      path="/coordination/:requestId"
                      element={<CoordinationRoomPage />}
                    />
                    <Route path="/donors" element={<DonorsPage />} />
                    <Route
                      path="/notifications"
                      element={<NotificationsPage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
            <ToastContainer />
          </NotificationProvider>
        </CoordinationProvider>
      </BloodRequestProvider>
    </AuthProvider>
  );
}

export default App;
