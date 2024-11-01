import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './checkout-success.scss';
import { clearCheckedItemsFromIndexedDB } from '../../utils/cartDB';

const CheckoutSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Parse the query parameters from the URL
        const query = new URLSearchParams(location.search);
        if (query.get('status') === 'success') {
            // Clear the cart in IndexedDB
            clearCheckedItemsFromIndexedDB();
            console.log('Cart cleared');
        } 
        else {
            navigate('/');
        }
    }, [location]);

    const query = new URLSearchParams(location.search);

    if (query.get('status') === 'success') {
        return (
            <div className='success-container'>
                <h1>Thank you for your purchase!</h1>
                <p>Your order was successful. You will receive updates regarding your order via your email or contact number.</p>
                <button onClick={() => navigate('/')}>
                    Let's go back to the home page
                </button>
            </div>
        );
    }
};

export default CheckoutSuccess;
