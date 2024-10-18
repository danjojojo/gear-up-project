import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pages from './pages/pages';
import Wrapper from "./components/wrapper/wrapper";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Wrapper />}>
            <Route index element={<Pages.LandingPage />} />
            <Route path="about" element={<Pages.About />} />
            <Route path="contact-us" element={<Pages.ContactUs />} />
            <Route path="help" element={<Pages.Help />} />
            <Route path="bike-builder" element={<Pages.BikeBuilder />} />
            <Route path="bike-upgrader" element={<Pages.BikeUpgrader />} />
            <Route path="bike-upgrader/headset" element={<Pages.Headset />} />
            <Route path="cart" element={<Pages.Cart />} />
            <Route path="*" element={<Pages.NotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
