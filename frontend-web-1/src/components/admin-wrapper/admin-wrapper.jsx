import React from 'react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SideNav from '../side-nav/side-nav';
import UpperNav from '../upper-nav/upper-nav';
import './admin-wrapper.scss';

const AdminWrapper = () => {
    const [title, setTitle] = useState(localStorage.getItem('pageTitle') || 'Dashboard');

    const handleNavClick = (newTitle) => {
        setTitle(newTitle);
        localStorage.setItem('pageTitle', newTitle);
    };

    return (
        <div className="admin-wrapper">
            <SideNav isAdmin={true} onNavClick={handleNavClick} />
            <div className="content">
                <UpperNav title={title} />
                <div className='main-content'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminWrapper;