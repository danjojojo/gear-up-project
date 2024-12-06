import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth-context';
import { useNavigate } from 'react-router-dom';
import './upper-nav.scss';
import {Modal, Button} from 'react-bootstrap';

const UpperNav = ({ onNavClick, title }) => {
    const { userName, userRole } = useContext(AuthContext);
    const [newTitle, setTitle] = useState(title);
    const navigate = useNavigate();

    const goToSettings = () => {
        onNavClick('Settings');
        navigate('/settings');
    }

    return (
        <div className="upper-nav p-4">
            <div>
                <div className='title m-0'>{title}</div>
            </div>
            <div className='user-profile'>
                <div className='ms-5'>
                    <div className='username m-0' onClick={() => {
                        if(userRole === 'admin'){
                            goToSettings();
                        }
                    }}>
                        {userRole === 'admin' && <i className='fa-solid fa-circle-user '></i>}
                        <p>{userName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpperNav;