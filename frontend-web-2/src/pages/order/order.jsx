import React, { useContext } from 'react'
import {  useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    getOrder
} from '../../services/orderService';
import {
    getSettings
} from '../../services/checkoutService';
import './order.scss';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import ReviewModal from '../../components/review-modal/review-modal';
import { Rating } from 'react-simple-star-rating';

const Order = () => {
    const { orderId } = useParams(); // Get orderId from URL path parameters
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewItems, setReviewItems] = useState([]);
    const [canUserReview, setCanUserReview] = useState(false);
    const navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);
    const [tabView, setTabView] = useState('o');

    const [storeAddress, setStoreAddress] = useState('');

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedItemIdForReview, setSelectedItemIdForReview] = useState('');
    const [selectedItemNameForReview, setSelectedItemNameForReview] = useState('');
    const [selectedItemImageForReview, setSelectedItemImageForReview] = useState('');
    const [selectedItemDescriptionForReview, setSelectedItemDescriptionForReview] = useState('');

    const [submittedReviewId, setSubmittedReviewId] = useState(null);
    const [submittedReviewRating, setSubmittedReviewRating] = useState(1);
    const [submittedReviewText, setSubmittedReviewText] = useState('');
    const [submittedReviewImage, setSubmittedReviewImage] = useState(null);
    const [submittedReviewDate, setSubmittedReviewDate] = useState(null);

    const fetchOrderDetails = async () => {
        try {
            const { order, items, reviews, allowedToReview } = await getOrder(orderId);
            const { settings } = await getSettings();
            setStoreAddress(settings.find(setting => setting.setting_key === 'store_address').setting_value);
            setOrderDetails(order);
            setOrderItems(items);
            setReviewItems(reviews);
            setCanUserReview(allowedToReview);
            console.log("Items:", items);
            console.log("Reviews:", reviews);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        } catch (err) {
            setError("Order not found or an error occurred.");
        }
    };

    const goBackToOrdersHistory = () => {
        navigate('/order-history');
    }

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    useEffect(() => {
        if(orderId) {
            setTabView('o');
            fetchOrderDetails();
        }
    }, [loggedIn]);

    useEffect(() => {
        if (orderId && reviewItems.length > 0) {
            setTabView('r');
            fetchOrderDetails();
        }
    }, [showReviewModal]);


    const handleReviewModal = (reviewItem) => {
        setSelectedItemIdForReview(reviewItem.item_id);
        setSelectedItemNameForReview(reviewItem.item_name);
        setSelectedItemImageForReview(reviewItem.image);
        setSelectedItemDescriptionForReview(reviewItem.description);

        setSubmittedReviewId(reviewItem.review_id || null);
        setSubmittedReviewRating(reviewItem.rating || 1);
        setSubmittedReviewText(reviewItem.comment || '');
        setSubmittedReviewImage(reviewItem.review_image || null);
        setSubmittedReviewDate(reviewItem.review_date || null);

        setShowReviewModal(true);
    }

    if(loading) return <div className='loading'><i className="fa-solid fa-gear fa-spin"></i></div>
    
    return (
        <div className='order'>
            <ReviewModal
                show={showReviewModal}
                onHide={() => setShowReviewModal(false)}
                itemName={selectedItemNameForReview}
                itemPicture={selectedItemImageForReview}
                itemId={selectedItemIdForReview}
                itemDescription={selectedItemDescriptionForReview}
                setShowReviewModal={setShowReviewModal}
                submittedReviewRating={submittedReviewRating}
                submittedReviewText={submittedReviewText}
                submittedReviewImage={submittedReviewImage}
                submittedReviewId={submittedReviewId}
                submittedReviewDate={submittedReviewDate}
            />
            {orderDetails && (
                <>
                    <div className='inner-order'>
                        <div className="header">
                            {(loggedIn && canUserReview) && <p onClick={goBackToOrdersHistory}>&larr; Go back</p>}
                            <h2>{(loggedIn && canUserReview) && 'Your'} Order Details</h2>
                        </div>

                        <div className="order-id">
                            <p>{orderDetails.order_name}</p>
                        </div>

                        <div className="order-status">
                            <h4>Order Status</h4>
                            <h4>Recipient: {orderDetails.cust_name}</h4>
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
                                    <p>{storeAddress}</p>
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
                            <div className="tab">
                                <h2 onClick={()=> setTabView('o')} className={tabView === 'o' ? 'active' : ''}>Order Items</h2>
                                {(loggedIn && canUserReview) && <h2 onClick={()=> setTabView('r')} className={tabView === 'r' ? 'active' : ''}>To Review</h2>}
                            </div>
                            <h2>Total: {PesoFormat.format(orderDetails.order_amount)}</h2>
                        </div>
                        <div className="items">
                            {tabView === 'o' && orderItems.map((item, index) => (
                                <div key={index} className="item">
                                    <div className="top">
                                        <p>{item.item_name}</p>
                                        <p>{item.item_qty} x {PesoFormat.format(item.item_price)}
                                        </p>
                                    </div>
                                    <div className="bottom">
                                        <p className={item.part_type}>{item.part_type === "TR" ? 'To Deliver' : 'To Pickup'}</p>
                                        <p>{PesoFormat.format(item.item_price * item.item_qty)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(tabView === 'r' && orderDetails.order_status === 'completed') && 
                                reviewItems.map((item, index) => (
                                    <div key={index} className="item">
                                        <div className="top">
                                            <p>{item.item_name}</p>
                                        </div>
                                        <div className="bottom">
                                            {item.review_id === null && 
                                                <>  
                                                    <p>Rating: N/A</p>
                                                    <button className='rate' onClick={() => handleReviewModal(item)}>Rate</button>
                                                </>
                                            }
                                            {item.review_id && 
                                                <>
                                                    <p>Rating:</p>
                                                    <Rating
                                                        readonly={true}
                                                        initialValue={item.rating}
                                                        iconsCount={5}
                                                        size={30}
                                                        fillColor='#F9961F'
                                                        emptyColor='#CCC'
                                                    />
                                                    <button className='rate' onClick={() => handleReviewModal(item)}>View Review</button>
                                                </>
                                            }
                                        </div>
                                    </div>
                            ))}
                            {(tabView === 'r' && orderDetails.order_status !== 'completed') && 
                                <p className='not-completed'>You can only review items from completed orders.</p>
                            }
                        </div>
                    </div>
                </>
            )}
            {orderItems.length === 0 && <p className='error'>Order not found.</p>}
        </div>
  );
}

export default Order;