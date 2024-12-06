import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffWrapper from '../components/staff-wrapper/staff-wrapper';
import Pages from '../pages/pages';
import { AuthContext } from '../context/auth-context';

const StaffRoutes = () => {
    const { displayExpenses } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<StaffWrapper />}>
                <Route index element={<Pages.PointOfSales />} />
                <Route path="point-of-sales" element={<Pages.PointOfSales />} />
                {displayExpenses && <Route path="expenses" element={<Pages.Expenses />} />}
                <Route path="receipts" element={<Pages.Receipts />} />
                <Route path="waitlist" element={<Pages.Waitlist />} />
                <Route path="bike-builder-upgrader" element={<Pages.BikeBuilderUpgrader />} />
                    <Route path="bike-builder-upgrader/:type" element={<Pages.BikeType />} />
                        <Route path="bike-builder-upgrader/:type/parts/frame" element={<Pages.Frame />} />
                        <Route path="bike-builder-upgrader/:type/parts/fork" element={<Pages.Fork />} />
                        <Route path="bike-builder-upgrader/:type/parts/groupset" element={<Pages.Groupset />} />
                        <Route path="bike-builder-upgrader/:type/parts/wheelset" element={<Pages.Wheelset />} />
                        <Route path="bike-builder-upgrader/:type/parts/seat" element={<Pages.Seat />} />
                        <Route path="bike-builder-upgrader/:type/parts/cockpit" element={<Pages.Cockpit />} />
                {/* <Route path="orders" element={<Pages.Orders />} /> */}
            </Route>
                <Route path="*" element={<Pages.NotFound />} />
        </Routes>

    )
};

export default StaffRoutes;