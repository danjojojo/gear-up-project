import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './upper-nav.scss';

const UpperNav = ({ title }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="upper-nav p-4">
            <div>
                <div className='title m-0 fw-bold'>{title}</div>
            </div>
            <div className='user-profile'>
                <div className='ms-5 me-5'>
                    <div className='username m-0'>Hello, Juan Dela Cruz!</div>
                </div>
                <button className="logout m-0 ms-4" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UpperNav;