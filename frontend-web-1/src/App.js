import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/admin-routes';
import StaffRoutes from './routes/staff-routes';
import Pages from './pages/pages';
import { AuthProvider, AuthContext } from './context/auth-context';
import { checkAdminExists } from './services/authService';
import LoadingPage from './components/loading-page/loading-page';
import 'react-image-crop/src/ReactCrop.scss';

function App() {
  const [adminExists, setAdminExists] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
        setLoading(false);
      } catch (error) {
        console.error('Failed to check admin existence:', error);
        setLoading(true);
      }
    };
    fetchAdminStatus();
  }, []);

  if (loading) return <LoadingPage classStyle="loading-screen" />

  return (
    <AuthProvider>
      <Router>
        <AuthRoutes adminExists={adminExists} />
      </Router>
    </AuthProvider>
  );
}

const AuthRoutes = ({ adminExists }) => {
  const { userRole, authenticated, loading } = useContext(AuthContext);
  console.log(authenticated);
  if (loading) return <LoadingPage classStyle="loading-screen" />

  return (
    <Routes>
      {adminExists ? (
        <>
          <Route
            path="login"
            element={authenticated && userRole === "admin" ? <Navigate to="/" /> : <Pages.Login />}
          />
          <Route
            path="login-pos"
            element={authenticated && userRole === "staff" ? <Navigate to="/" /> : <Pages.LoginPOS />}
          />
          <Route path="set-up-account" element={<Navigate to="/login" />} />
          <Route path="reset-password" element={<Pages.ResetPassword/>} />
          <Route path="*" element={
            authenticated && userRole === 'admin' ? (
              <AdminRoutes />
            ) : authenticated && userRole === 'staff' ? (
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
          <Route path="forgot-password" element={<Navigate to="/set-up-account" />} />
          <Route path="*" element={<Navigate to="/set-up-account" />} />
        </>
      )}
      <Route path="*" element={<Pages.NotFound />} />
    </Routes>
  );
};

export default App;