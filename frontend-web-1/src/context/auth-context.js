import React, { createContext, useState, useEffect } from 'react';
import { login, loginPOS } from '../services/authService';
import Cookies from 'js-cookie'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(Cookies.get('userRole') || null);
  const [token, setToken] = useState(Cookies.get('token') || null);
  const [posToken, setPosToken] = useState(Cookies.get('pos_token') || null);

  useEffect(() => {
    const storedRole = Cookies.get('userRole');
    const storedToken = Cookies.get('token');
    const storedPosToken = Cookies.get('pos_token');
    setUserRole(storedRole);
    setToken(storedToken);
    setPosToken(storedPosToken);
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const data = await login(email, password);
      Cookies.set('token', data.token, { secure: true, sameSite: 'Strict' });
      Cookies.set('userRole', data.role, {secure: true, sameSite: 'Strict' });
      setToken(data.token);
      setUserRole(data.role);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const loginPOSUser = async (password) => {
    try {
      const data = await loginPOS(password);
      Cookies.set('pos_token', data.token, { secure: true, sameSite: 'Strict' });
      Cookies.set('userRole', data.role, { secure: true, sameSite: 'Strict' });
      setPosToken(data.token);
      setUserRole(data.role);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userRole');
    Cookies.remove('pos_token');
    localStorage.removeItem('pageTitle')
    setToken(null);
    setUserRole(null);
    setPosToken(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, token, posToken, loginAdmin, loginPOSUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };