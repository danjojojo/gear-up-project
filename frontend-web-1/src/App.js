import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/admin-routes';
import StaffRoutes from './routes/staff-routes';
import Pages from './pages/pages';
import { AuthProvider, AuthContext } from './context/auth-context';
import { checkAdminExists } from './services/authService';

function App() {
  const [adminExists, setAdminExists] = useState(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
      } catch (error) {
        console.error('Failed to check admin existence:', error);
      }
    };

    fetchAdminStatus();
  }, []);

  if (adminExists === null) {
    return <div>Loading...</div>; // Show a loading state while checking the admin status
  }

  return (
    <AuthProvider>
      <Router>
        <AuthRoutes adminExists={adminExists} />
      </Router>
    </AuthProvider>
  );
}

const AuthRoutes = ({ adminExists }) => {
  const { userRole } = useContext(AuthContext);

  return (
    <Routes>
      {adminExists ? (
        <>
          <Route path="login" element={<Pages.Login />} />
          <Route path="login-pos" element={<Pages.LoginPOS />} />
          <Route path="set-up-account" element={<Navigate to="/login" />} />
          <Route path="*" element={
            userRole === 'admin' ? (
              <AdminRoutes />
            ) : userRole === 'staff' ? (
              <StaffRoutes />
            ) : (
              <Navigate to="/login" />
            )
          } />
        </>
      ) : (
        <>
          <Route path="set-up-account" element={<Pages.SetUpAccount />} />
          <Route path="login" element={<Navigate to="/set-up-account" />} />
          <Route path="login-pos" element={<Navigate to="/set-up-account" />} />
          <Route path="*" element={<Navigate to="/set-up-account" />} />
        </>
      )}
      <Route path="*" element={<Pages.NotFound />} />
    </Routes>
  );
};

export default App;