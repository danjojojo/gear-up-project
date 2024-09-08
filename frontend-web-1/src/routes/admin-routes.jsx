import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminWrapper from '../components/admin-wrapper/admin-wrapper.jsx';
import Pages from '../pages/pages.js';

const AdminRoutes = () => (
    <Routes>
        <Route path="/" element={<AdminWrapper />}>
            <Route index element={<Pages.Dashboard />} />
            <Route path="pos-users" element={<Pages.POSUsers />} />
            <Route path="inventory" element={<Pages.Inventory />} />
            <Route path="summaries" element={<Pages.Summaries />} />
            <Route path="reports" element={<Pages.Reports />} />
            <Route path="records" element={<Pages.Records />} />
            <Route path="waitlist" element={<Pages.Waitlist />} />
            <Route path="bike-builder-upgrader" element={<Pages.BikeBuilderUpgrader />} />
            <Route path="orders" element={<Pages.Orders />} />
        </Route>
    </Routes>
);

export default AdminRoutes;