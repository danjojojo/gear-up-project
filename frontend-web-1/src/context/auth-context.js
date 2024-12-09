import React, { createContext, useEffect, useState } from 'react';
import { login, loginPOS, getMyRole, logoutUser, getMyName, refreshToken, verifyAdminOTP } from '../services/authService';
import { getSettings } from '../services/settingsService';
// import { setupAxiosInterceptors } from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [otpRequired, setOtpRequired] = useState(false);

  const [displayExpenses, setDisplayExpenses] = useState(false);

  const handleTokenRefresh = async () => {
    try {
      await refreshToken(); // Call to refresh the token
      const role = await getMyRole(); // Retry fetching the role after refresh
      setUserRole(role);
      setAuthenticated(true);
      window.location.reload();  // Reload the page only on successful token refresh
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const fetchRole = async () => {
    try {
      const role = await getMyRole();
      const name = await getMyName();
      setUserRole(role);
      setUserName(name);
      setAuthenticated(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If access token expired, attempt to refresh the token
        await handleTokenRefresh();
      } 
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { settings } = await getSettings();
      let retrievedCurrentValue = settings.filter(setting => setting.setting_key === 'display_expenses');
      setDisplayExpenses(retrievedCurrentValue[0].setting_value === 'yes' ? true : false);
    } catch (error) {
      setDisplayExpenses(false);
    }
  }

  useEffect(() => {
    fetchRole();
    fetchSettings();
    // Periodic token refresh (e.g., every 50 minutes)
    const interval = setInterval(() => handleTokenRefresh(), 60 * 1000 * 40);
    return () => clearInterval(interval); 
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const { message } = await login(email, password);
      if (message === 'Login successful') {
        setOtpRequired(true);
        setError(null);  // Clear previous errors
      }
    } catch (error) {
      setUserRole(null);
      setAuthenticated(false);
      throw error;  // Throw the error so it's caught and handled in the login component
    }
  };

  const handleVerifyAdminOTP = async (email, otp) => {
    try {
      const { message } = await verifyAdminOTP(email, otp);
      if(message === 'OTP verified') { 
        setError(null);
        setOtpRequired(false);
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
        const role = await getMyRole();
        setUserRole(role);
        setAuthenticated(true);
        window.location.reload();  // Reload the page only on successful login
      } else {
        setOtpRequired(true);
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  }

  const loginPOSUser = async (id, password) => {
    try {
      const { message } = await loginPOS(id, password);
      if (message === 'Login successful') {
        setError(null);  // Clear previous errors
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
        const role = await getMyRole();
        setUserRole(role);
        setAuthenticated(true);
        window.location.reload();  // Reload the page only on successful login
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setUserRole(null);
      setAuthenticated(false);
      setError('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setUserRole(null);
        setAuthenticated(false);
        setUserName(null);
      }, 1000);
      localStorage.removeItem("pageTitle");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, authenticated, loading, error, loginAdmin, handleVerifyAdminOTP, loginPOSUser, logout, userName, displayExpenses }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
