import React, { useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SideNav from '../side-nav/side-nav';
import UpperNav from '../upper-nav/upper-nav';
import './admin-wrapper.scss';
import SessionExpiredModal from '../session-expired-modal/session-expired-modal';
import { setupAxiosInterceptors } from '../../services/api';
import { AuthContext } from '../../context/auth-context';

const AdminWrapper = () => {
    const [title, setTitle] = useState(localStorage.getItem('pageTitle') || 'Dashboard');
    const [showModal, setShowModal] = useState(false);
    const { logout } = useContext(AuthContext);

    const handleNavClick = (newTitle) => {
        setTitle(newTitle);
        localStorage.setItem('pageTitle', newTitle);
    };

    useEffect(() => {
        setupAxiosInterceptors(setShowModal);
    },[])

    const handleClose = () => {
        setShowModal(false);
        logout();
    };

    return (
        <div className="admin-wrapper">
            <SessionExpiredModal show={showModal} handleClose={handleClose} />
            <SideNav isAdmin={true} onNavClick={handleNavClick} />
            <div className="content">
                <UpperNav title={title} onNavClick={handleNavClick}/>
                <div className='main-content'>
                    <Outlet context={{ handleNavClick }} />
                </div>
            </div>
        </div>
    );
};

export default AdminWrapper;