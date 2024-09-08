import React from 'react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SideNav from '../side-nav/side-nav';
import UpperNav from '../upper-nav/upper-nav';
import './staff-wrapper.scss';

const StaffWrapper = () => {
    const [title, setTitle] = useState(localStorage.getItem('pageTitle') || 'Point of Sales');

    const handleNavClick = (newTitle) => {
        setTitle(newTitle);
        localStorage.setItem('pageTitle', newTitle);
    };

    return (
        <div className="staff-wrapper">
            <SideNav isAdmin={false} onNavClick={handleNavClick} />
            <div className="content">
                <UpperNav title={title} />
                <div className='main-content'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StaffWrapper;