import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pages from './pages/pages';
import Wrapper from "./components/wrapper/wrapper";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./context/auth-context";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Wrapper />}>
              <Route index element={<Pages.LandingPage />} />
              <Route path="about" element={<Pages.About />} />
              <Route path="contact-us" element={<Pages.ContactUs />} />
              <Route path="help" element={<Pages.Help />} />
              <Route path="bike-builder" element={<Pages.BikeBuilder />} />
                <Route path="bike-builder/:typeTag" element={<Pages.BikeBuilder />} />
              <Route path="bike-upgrader" element={<Pages.BikeUpgrader />} />
              <Route path="cart" element={<Pages.Cart />} />
              <Route path="checkout" element={<Pages.Checkout />} />
              <Route path="orders/:orderId" element={<Pages.Order />} />
              <Route path="checkout/success" element={<Pages.CheckoutSuccess />} />
              <Route path="order-history" element={<Pages.OrderHistory />} />
              <Route path="*" element={<Pages.NotFound />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
