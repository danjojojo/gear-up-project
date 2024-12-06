import React, { useState, useContext, useEffect } from 'react';
import './order-history.scss';
import { getOrderHistory } from '../../services/userService';
import { AuthContext } from '../../context/auth-context';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const { loggedIn, profile } = useContext(AuthContext);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetOrderHistory = async () => {
        setLoading(true);
        try {
            const { orders } = await getOrderHistory();
            setUserOrders(orders);
            setLoading(false);
        }
        catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    const viewOrder = (orderId) => {
        console.log('View Order');
        navigate('/orders/' + orderId);
    }

    useEffect(() => {
        if (loggedIn) {
            handleGetOrderHistory();
        }
    }, [loggedIn]);
    
    return (
        <div className='order-history'>
            <h3>Order History</h3>

            {loading && (
                <div className='loading'>
                    <i className="fa-solid fa-gear fa-spin"></i>
                </div>
            )}

            {!loading && !loggedIn && !profile && (
                <div className='not-logged-in'>
                    <p>Please login to view your order history.</p>
                </div>
            )}

            {!loading && loggedIn && profile && (
                <div className='content'>
                    {/* Replace this with actual order history */}
                    <p>Welcome, {profile.name}. Here's your order history:</p>

                    {userOrders.length > 0 ? 
                    <div className="list">
                        {userOrders.map((order, index) => (
                            <div className="order" key={index}>
                                <div className="top">
                                    <p className='name'>{order.order_name}</p>
                                    <p>{moment(order.date_created).format("LLL")}</p>
                                </div>
                                <p className='amount'>Paid {PesoFormat.format(order.order_amount)} via  <span>{order.payment_type}</span></p>
                                <div className="bottom">
                                    <p className={'status ' + order.order_status}>STATUS {order.order_status}</p>
                                    <button className='view-order' onClick={() => viewOrder(order.order_name)}>View Order &rarr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <p>No orders found.</p>
                    }
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
