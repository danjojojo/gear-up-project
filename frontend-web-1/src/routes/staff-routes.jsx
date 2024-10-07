import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffWrapper from '../components/staff-wrapper/staff-wrapper';
import Pages from '../pages/pages';

const StaffRoutes = () => (
    <Routes>
        <Route path="/" element={<StaffWrapper />}>
            <Route index element={<Pages.PointOfSales />} />
            <Route path="point-of-sales" element={<Pages.PointOfSales />} />
            <Route path="expenses" element={<Pages.Expenses />} />
            <Route path="receipts" element={<Pages.Receipts />} />
            <Route path="waitlist" element={<Pages.Waitlist />} />
            <Route path="bike-builder-upgrader" element={<Pages.BikeBuilderUpgrader />} />
                <Route path="bike-builder-upgrader/parts/frame" element={<Pages.Frame />} />
                <Route path="bike-builder-upgrader/parts/fork" element={<Pages.Fork />} />
                <Route path="bike-builder-upgrader/parts/groupset" element={<Pages.Groupset />} />
                <Route path="bike-builder-upgrader/parts/wheelset" element={<Pages.Wheelset />} />
                <Route path="bike-builder-upgrader/parts/seat" element={<Pages.Seat />} />
                <Route path="bike-builder-upgrader/parts/cockpit" element={<Pages.Cockpit />} />
                <Route path="bike-builder-upgrader/parts/headset" element={<Pages.Headset />} />
                <Route path="bike-builder-upgrader/parts/handlebar" element={<Pages.Handlebar />} />
                <Route path="bike-builder-upgrader/parts/stem" element={<Pages.Stem />} />
                <Route path="bike-builder-upgrader/parts/hubs" element={<Pages.Hubs />} />
            <Route path="orders" element={<Pages.Orders />} />
        </Route>
    </Routes>
);

export default StaffRoutes;