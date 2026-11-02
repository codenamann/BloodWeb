import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyEmail } from '../api/auth.api';
import {
  getUserProfile,
  updatePhone as updatePhoneApi,
  updateBloodGroup as updateBloodGroupApi,
  updateDob as updateDobApi,
  toggleAvailability as toggleAvailabilityApi,
} from '../api/profile.api';
import { disconnectSocket } from '../services/socket.js';
import { toast } from '../components/ui/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] =
    useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('bloodweb_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      // Restore cached profile immediately to prevent premature logout or UI flicker
      const cachedUserStr = localStorage.getItem('bloodweb_user');
      if (cachedUserStr) {
        try {
          setCurrentUser(JSON.parse(cachedUserStr));
        } catch (_) {}
      }

      try {
        const profileRes = await getUserProfile();

        if (profileRes.status === 'success' && profileRes.data?.user) {
          setCurrentUser(profileRes.data.user);
          localStorage.setItem('bloodweb_user', JSON.stringify(profileRes.data.user));
        } else {
          localStorage.removeItem('bloodweb_token');
          localStorage.removeItem('bloodweb_user');
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Failed to fetch profile during session restore:', err);
        // Only wipe token if the server explicitly rejected the token (401) or user was removed (404)
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.removeItem('bloodweb_token');
          localStorage.removeItem('bloodweb_user');
          setCurrentUser(null);
        }
        // Transient network drops, laptop wake-up, or temporary server reboots DO NOT wipe the token!
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    if (
      response.status === 'success' &&
      response.data.token &&
      response.data.user
    ) {
      localStorage.setItem('bloodweb_token', response.data.token);
      localStorage.setItem('bloodweb_user', JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);
    }

    getUserProfile()
      .then((profileRes) => {
        if (profileRes.status === 'success' && profileRes.data.user) {
          setCurrentUser(profileRes.data.user);
          localStorage.setItem('bloodweb_user', JSON.stringify(profileRes.data.user));
        }
      })
      .catch((err) => {
        console.warn('Failed to refresh profile after login:', err);
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.removeItem('bloodweb_token');
          localStorage.removeItem('bloodweb_user');
          setCurrentUser(null);
        }
      });

    return response;
  };

  const register = async ({ name, email, password }) => {
    const response = await registerUser({ name, email, password });
    if (response.status === 'success') {
      setPendingVerificationEmail(email);
    }
    return response;
  };

  const verifyOtp = async (email, otp) => {
    const response = await verifyEmail(email, otp);

    if (response.status === 'success') {
      setCurrentUser(response.data.user);
      if (response.data.user) {
        localStorage.setItem('bloodweb_user', JSON.stringify(response.data.user));
      }
      if (response.data.token) {
        localStorage.setItem('bloodweb_token', response.data.token);
      }
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('bloodweb_token');
    localStorage.removeItem('bloodweb_user');
    disconnectSocket();
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem('bloodweb_user', JSON.stringify(userData));
    }
  };

  const updatePhone = async (phone) => {
    try {
      const res = await updatePhoneApi(phone);
      if (res.status === 'success') {
        setCurrentUser(res.data.user);
        return res;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateBloodGroup = async (bloodGroup) => {
    try {
      const res = await updateBloodGroupApi(bloodGroup);
      if (res.status === 'success') {
        setCurrentUser(res.data.user);
        return res;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateDob = async (dob) => {
    try {
      const res = await updateDobApi(dob);
      if (res.status === 'success') {
        setCurrentUser(res.data.user);
        return res;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const toggleAvailability = async () => {
    if (!currentUser?.availability && !currentUser?.bloodGroup) {
      toast.error(
        'Blood Group Required',
        'Please set up your verified blood group in your profile before enabling availability.'
      );
      const err = new Error('Blood group is required before enabling availability.');
      err.response = { data: { message: 'Please set up your verified blood group first.' } };
      throw err;
    }
    try {
      const res = await toggleAvailabilityApi();
      if (res.status === 'success') {
        setCurrentUser((prev) => ({
          ...prev,
          availability: res.data.availability,
        }));
        return res;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    try {
      const profileRes = await getUserProfile();
      if (profileRes.status === 'success' && profileRes.data?.user) {
        setCurrentUser(profileRes.data.user);
        return profileRes.data.user;
      }
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        authLoading,
        login,
        register,
        verifyOtp,
        logout,
        pendingVerificationEmail,
        updateUser,
        refreshProfile,
        updatePhone,
        updateBloodGroup,
        updateDob,
        toggleAvailability,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
