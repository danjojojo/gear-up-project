import React, { createContext, useEffect, useState } from 'react';
import { login, loginPOS, getMyRole, logoutUser } from '../services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // New loading state
  const [error, setError] = useState(null);  // Error state to handle login errors

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getMyRole();
        setUserRole(role);
        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        setUserRole(null);
        setAuthenticated(false);
      } 
      finally {
        setTimeout(() => setLoading(false), 1000);  // Ensure loading is set to false after fetching role
      }
    };
    fetchRole();
  }, []);  // Ensure this only runs on mount

  const loginAdmin = async (email, password) => {
    try {
      const { message } = await login(email, password);
      if (message === 'Login successful') {
        setError(null);  // Clear previous errors
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
        const role = await getMyRole();
        setUserRole(role);
        setAuthenticated(true);
        window.location.reload();  // Reload the page only on successful login
      }
    } catch (error) {
      setUserRole(null);
      setAuthenticated(false);
      throw error;  // Throw the error so it's caught and handled in the login component
    }
  };


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
        // window.location.reload();  // Reload the page only on successful login
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setUserRole(null);
      setAuthenticated(false);
      setError('Login failed. Please check your credentials.');  // Set error message on failure
    } 
  };

  const logout = async () => {
    try {
      await logoutUser();
      setLoading(true);
      setTimeout(() => {
        setLoading(false)
        setUserRole(null);
        setAuthenticated(false);
      }, 1000);
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1000);  // Reload the page after logout
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, authenticated, loading, error, loginAdmin, loginPOSUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
