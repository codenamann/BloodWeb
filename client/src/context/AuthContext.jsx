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

      try {
        const profileRes = await getUserProfile();

        if (profileRes.status === 'success' && profileRes.data?.user) {
          setCurrentUser(profileRes.data.user);
        } else {
          localStorage.removeItem('bloodweb_token');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        localStorage.removeItem('bloodweb_token');
        setCurrentUser(null);
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
      setCurrentUser(response.data.user);
    }

    getUserProfile()
      .then((profileRes) => {
        console.dir(profileRes);
        if (profileRes.status === 'success' && profileRes.data.user) {
          setCurrentUser(profileRes.data.user);
        }
      })
      .catch((err) => {
        console.error('Failed to restore session', err);
        localStorage.removeItem('bloodweb_token');
        setCurrentUser(null);
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
      if (response.data.token) {
        localStorage.setItem('bloodweb_token', response.data.token);
      }
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('bloodweb_token');
    disconnectSocket();
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
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
