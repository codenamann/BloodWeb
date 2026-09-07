import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyEmail } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bloodweb_current_user');
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch (err) {
      console.error('Error parsing saved user:', err);
      return null;
    }
  });

  const [pendingVerificationEmail, setPendingVerificationEmail] =
    useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        'bloodweb_current_user',
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem('bloodweb_current_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    if (response.status === 'success') {
      setCurrentUser(response.data.user);
      if (response.data.token) {
        localStorage.setItem('bloodweb_token', response.data.token);
      }
    }
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
    setCurrentUser(null);
  };

  // Toggle donor availability
  const toggleAvailability = (forcedValue) => {
    if (!currentUser) return;
    if (!currentUser.bloodGroup || !currentUser.location) {
      alert(
        'You must set your blood group and location before enabling availability.'
      );
      return;
    }
    const nextVal =
      typeof forcedValue === 'boolean'
        ? forcedValue
        : !currentUser.availability;
    const updated = { ...currentUser, availability: nextVal };
    setCurrentUser(updated);
  };

  // Update profile
  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        verifyOtp,
        logout,
        toggleAvailability,
        updateProfile,
        pendingVerificationEmail,
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
