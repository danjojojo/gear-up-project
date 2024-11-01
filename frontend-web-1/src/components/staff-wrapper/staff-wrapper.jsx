import React from 'react';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import SideNav from '../side-nav/side-nav';
import MenuNav from '../menu-nav/menu-jav';
import UpperNav from '../upper-nav/upper-nav';
import './staff-wrapper.scss';
import SessionExpiredModal from '../session-expired-modal/session-expired-modal';
import { setupAxiosInterceptors } from '../../services/api';
import { AuthContext } from '../../context/auth-context';

const StaffWrapper = () => {
    const [title, setTitle] = useState(localStorage.getItem('pageTitle') || 'Point of Sales');
    const [showModal, setShowModal] = useState(false);
    const { logout } = useContext(AuthContext);

    const handleNavClick = (newTitle) => {
        setTitle(newTitle);
        localStorage.setItem('pageTitle', newTitle);
    };

    useEffect(() => {
        setupAxiosInterceptors(setShowModal);
        console.log('Test 3');
    }, []);

    const handleClose = () => {
        setShowModal(false);
        logout();
    };

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="staff-wrapper">
            <SessionExpiredModal show={showModal} handleClose={handleClose} />
            <SideNav isAdmin={false} onNavClick={handleNavClick} />
            <div className="content">
                <div className="nav">
                    <div className="menu-button" onClick={() => setMenuOpen(true)}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    {menuOpen && <MenuNav isAdmin={false} onNavClick={handleNavClick} setMenuOpen={setMenuOpen}/>}
                    <UpperNav title={title} />
                </div>
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StaffWrapper;