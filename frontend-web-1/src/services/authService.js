import api from './api';

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

// Check if any pos user exists
export const checkPosExists = async () => {
  try {
    const response = await api.get("/auth/pos-check");
    return response.data;
  } catch (error) {
    console.error("Error checking pos existence:", error);
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
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Login staff
export const loginPOS = async (id, password) => {
  try {
    const response = await api.post('/auth/login-pos', { id, password });
    // Store tokens and role in cookies
    return response.data;
  } catch (error) {
    console.error('Error logging in POS:', error);
    throw error;
  }
};

// Get user role
export const getMyRole = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.role;
  } catch (error) {
    console.error('Error getting role:', error);
    throw error;
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// Get user name
export const getMyName = async () => {
  try {
    const response = await api.get('/auth/my-name');
    return response.data.name;
  } catch (error) {
    console.error('Error getting name:', error);
    throw error;
  }
}


// Refresh the access token
export const refreshToken = async () => {
  try {
    // Calls the /refresh-token endpoint to request a new access token
    const response = await api.post('/auth/refresh-token');
    return response.data; // Return data to indicate refresh success
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Verify OTP
export const verifyOTP = async (otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { otp });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

// Verify admin OTP
export const verifyAdminOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-admin-otp', { email, otp });
    return response.data;
  } catch (error) {
    console.error('Error verifying admin OTP:', error);
    throw error;
  }
}