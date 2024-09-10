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
            <Route path="bike-builder-upgrader">
                <Route index element={<Pages.BikeBuilderUpgrader />} />
                <Route path=":partType" element={<Pages.BikeBuilderUpgrader />} />
            </Route>
            <Route path="orders" element={<Pages.Orders />} />
        </Route>
    </Routes>
);

export default StaffRoutes;