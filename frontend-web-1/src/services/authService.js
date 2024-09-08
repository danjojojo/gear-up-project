import api from './api';
import Cookies from 'js-cookie';

// Check if admin exists
export const checkAdminExists = async () => {
  try {
    const response = await api.get('/auth/admin-check');
    return response.data.exists;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    throw error;
  }
};

// Register user
export const register = async (email, password) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// Login admin
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Store tokens and role in cookies
    Cookies.set('token', response.data.token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    Cookies.set('userRole', response.data.role, { httpOnly: true, secure: true, sameSite: 'Strict' });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Login staff
export const loginPOS = async (password) => {
  try {
    const response = await api.post('/auth/login-pos', { password });
    // Store tokens and role in cookies
    Cookies.set('pos_token', response.data.token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    Cookies.set('userRole', response.data.role, { httpOnly: true, secure: true, sameSite: 'Strict' });
    return response.data;
  } catch (error) {
    console.error('Error logging in POS:', error);
    throw error;
  }
};