import React, { useEffect, useState } from 'react';
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
        console.log('Admin exists:', exists);
        setAdminExists(exists);
      } catch (error) {
        console.error('Failed to check admin existence:', error);
      }
    };

    fetchAdminStatus();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {adminExists ? (
            <>
              <Route path="login" element={<Pages.Login />} />
              <Route path="login-pos" element={<Pages.LoginPOS />} />
              <Route path="set-up-account" element={<Navigate to="/login" />} />
              <Route path="*" element={
                <AuthContext.Consumer>
                  {({ userRole }) => {
                    if (userRole === 'admin') {
                      return <AdminRoutes />;
                    } else if (userRole === 'staff') {
                      return <StaffRoutes />;
                    } else {
                      return <Navigate to="/login" />;
                    }
                  }}
                </AuthContext.Consumer>
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
      </Router>
    </AuthProvider>
  );
}

export default App;