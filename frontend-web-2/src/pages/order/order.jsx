import React from 'react'
import {  useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    getOrder
} from '../../services/orderService';
import './order.scss';
import moment from 'moment-timezone';;

const Order = () => {
    const { orderId } = useParams(); // Get orderId from URL path parameters
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const { order, items } = await getOrder(orderId);
            setOrderDetails(order);
            setOrderItems(items);
            console.log(items);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        } catch (err) {
            setError("Order not found or an error occurred.");
        }
    };

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    useEffect(() => {
        console.log('orderId:', orderId);
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if(loading) return <div className='loading'><i className="fa-solid fa-gear fa-spin"></i></div>
    
    return (
        <div className='order'>
            {orderDetails && (
                <>
                    <div className='inner-order'>
                        <div className="header">
                            <h2>Your Order Details</h2>
                        </div>

                        <div className="order-id">
                            <p>{orderDetails.order_name}</p>
                        </div>

                        <div className="order-status">
                            <h4>Order Status</h4>
                        </div>

                        <div className="statuses">
                            <div className="status active" >
                                <p>Placed</p>
                                <p>{moment(orderDetails.date_created).format("LLL")}</p>
                            </div>

                            <div className={orderDetails.processed_at ? "status active" : "status"}>
                                <p>In Process</p>
                                {orderDetails.processed_at && <p>{moment(orderDetails.processed_at).format("LLL")}</p>}
                            </div>

                            {orderDetails.shipped_at && <div className="status active">
                                <p>Shipped</p>
                                <p>{moment(orderDetails.shipped_at).format("LLL")}</p>
                            </div>}

                            {orderDetails.pickup_ready_date && <div className="status active">
                                <p>Ready for Pickup</p>
                                <p>{moment(orderDetails.pickup_ready_date).format("LLL")}</p>
                            </div>}

                            <div className={orderDetails.order_status === 'completed' ? "status active" : "status"}>
                                <p>Completed</p>
                                {orderDetails.completed_at && <p>{moment(orderDetails.completed_at).format("LLL")}</p>}
                            </div>
                        </div>

                        <div className="pickup-shipping-details">
                            {orderDetails.pickup_ready_date && <div className="pickup-details">
                                <div className="order-status">
                                    <h4>Pickup Details</h4>
                                </div>

                                <div className="courier">
                                    <p>Store Address</p>
                                    <p>1234 Store Address, Store City, Store Province</p>
                                </div>
                            </div>}

                            {orderDetails.shipped_at && <div className="tracking-details">
                                <div className="order-status">
                                    <h4>Delivery Details</h4>
                                </div>

                                <div className="courier">
                                    <p>Courier</p>
                                    <p>{orderDetails.courier}</p>
                                </div>

                                <div className="tracking-number">
                                    <p>Tracking Number</p>
                                    <p>{orderDetails.tracking_number}</p>
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="order-items">
                        <div className="header">
                            <h2>Order Items</h2>
                            <h2>Total: {PesoFormat.format(orderDetails.order_amount)}</h2>
                        </div>
                        <div className="items">
                            {orderItems.map((item, index) => (
                                <div key={index} className="item">
                                    <div className="left">
                                        <p>{item.item_name}</p>
                                        <p className={item.part_type}>{item.part_type === "TR" ? 'To Deliver' : 'To Pickup'}</p>
                                    </div>
                                    <div className="right">
                                        <p>{item.item_qty} x {PesoFormat.format(item.item_price)}
                                        </p>
                                        <p>{PesoFormat.format(item.item_price * item.item_qty)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {orderItems.length === 0 && <p className='error'>Order not found.</p>
            }
        </div>
  );
}

export default Order;