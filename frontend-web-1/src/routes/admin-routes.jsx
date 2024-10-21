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
            <Route path="mechanics" element={<Pages.Mechanics />} />
            <Route path="summaries" element={<Pages.Summaries />} />
            <Route path="reports" element={<Pages.Reports />} />
            <Route path="receipts" element={<Pages.Receipts />} />
            <Route path="records">
                <Route index element={<Pages.Records />} />
                <Route path=":recordType" element={<Pages.Records />} />
            </Route>
            <Route path="waitlist" element={<Pages.Waitlist />} />
            <Route path="bike-builder-upgrader" element={<Pages.BikeBuilderUpgrader />} />
                <Route path="bike-builder-upgrader/parts/frame" element={<Pages.Frame />} />
                <Route path="bike-builder-upgrader/parts/fork" element={<Pages.Fork />} />
                <Route path="bike-builder-upgrader/parts/groupset" element={<Pages.Groupset />} />
                <Route path="bike-builder-upgrader/parts/wheelset" element={<Pages.Wheelset />} />
                <Route path="bike-builder-upgrader/parts/seat" element={<Pages.Seat />} />
                <Route path="bike-builder-upgrader/parts/cockpit" element={<Pages.Cockpit />} />
            <Route path="orders" element={<Pages.Orders />} />
        </Route>
        <Route path="*" element={<Pages.NotFound />} />
    </Routes >
);

export default AdminRoutes;