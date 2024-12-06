import './orders.scss'
import PageLayout from '../../components/page-layout/page-layout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import SearchBar from '../../components/search-bar/search-bar';
import React, { useState, forwardRef, useEffect } from 'react';
import {Modal, Button} from 'react-bootstrap';
import { 
    getOrders,
    getOrdersItems,
    updateOrderStatus,
    updateOrderShipping,
    deductStockForCompletedOrder,
    getOrderDates,
    getOrderStatistics,
    deleteExpiredOrder
} from '../../services/orderService';

import LoadingPage from '../../components/loading-page/loading-page';

const Orders = () => {
    const todayDate = new Date();
    const nowDate = moment(todayDate).format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [allOrders, setAllOrders] = useState([]);
    const [retrievedOrders, setRetrievedOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [orderBUItems, setOrderBUItems] = useState([]);
    const [orderBBItems, setOrderBBItems] = useState([]);
    const [groupedBBItems, setGroupedBBItems] = useState([]);
    const [totalBBPrice, setTotalBBPrice] = useState(0);
    const [totalBUPrice, setTotalBUPrice] = useState(0);
    
    const [ordersView, setOrdersView] = useState(true);
    const [openOrderView, setOpenOrderView] = useState(false);

    const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
    const [changeStatusTo, setChangeStatusTo] = useState('');
    const [showEmailResponse, setShowEmailResponse] = useState(false);
    const [showNoStockResponse, setShowNoStockResponse] = useState(false);
    const [noStockMessage, setNoStockMessage] = useState('');
    const [showDeleteExpiredOrderModal, setShowDeleteExpiredOrderModal] = useState(false);

    const [showMessage, setShowMessage] = useState(false);
    const [courier, setCourier] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [orderStats, setOrderStats] = useState({});

    const [orderDates, setOrderDates] = useState([]);

    const [loading, setLoading] = useState(true);

    const [disableButton, setDisableButton] = useState(false);

    const link = 'https://gearupbuilder.vercel.app/orders/';
    
    const DisabledDateInput = forwardRef(
      ({ value, onClick, className }, ref) => (
        <h4 className={className} onClick={onClick} ref={ref}>
          {value}
        </h4>
      )
    );

    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    function ChangeStatusConfirmation({ onHide, onConfirm, ...props }) {
      return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {changeStatusTo === 'in-process' && <div>
              <p>Are you sure you want to mark this order in process?</p>
              <ul>
                <li>Customer will be able to receive an email that you processed this order.</li>
                <li>Order items will be deducted from inventory.</li>
              </ul>
            </div>}
            {changeStatusTo === 'ready-pickup' && <div>
              <p>Are you sure you want to mark this order ready for pickup?</p>
              <ul>
                <li>Customer will be able to receive an email that this order is ready for pickup.</li>
              </ul>
            </div>}
            {changeStatusTo === 'ready-shipped' && <div>
              <p>Are you sure you want to mark this order shipped?</p>
              <ul>
                <li>Customer will be able to receive an email that this order is shipped.</li>
              </ul>
            </div>}
            {changeStatusTo === 'completed' && <div>
              <p>Are you sure you want to mark this order completed?</p>
              <ul>
                <li>Customer will be able to receive an email that this order is completed.</li>
                <li>Order has been received by customer.</li>
              </ul>
            </div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
                onHide();
              }}>
              Cancel
            </Button>
            <Button variant="primary" disabled={disableButton === true ? true : false} onClick={() => {
                onConfirm();
            }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    function DeleteExpiredOrderConfirmation({ onHide, onConfirm, ...props }) {
      return (
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You are about to delete an expired order. Do you confirm this?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" disabled={disableButton === true ? true : false} onClick={() => {
                onConfirm();
            }}>
              Confirm
            </Button>
            <Button variant="danger" onClick={() => {
                onHide();
              }}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    function EmailResponse({ onHide, ...props }) {
        return (
            <Modal

                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={onHide}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Email Response
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Email sent successfully!</p>
                </Modal.Body>
            </Modal>
        );
    }

    function NoStockResponse({ onHide, ...props }) {
        return (
            <Modal

                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={onHide}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Oops!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You cannot mark this order as in-process because some of your order items are in no stock.</p>
                </Modal.Body>
            </Modal>
        );
    }

    const getAllOrders = async (paymentStatus = '', orderStatus = '', searchTerm = '', startDate) => {
        try {
            const { orders } = await getOrders(startDate);

            // Filter orders based on payment status, order status, and search term
            const filteredOrders = orders.filter(order => {
                const paymentMatch = paymentStatus ? order.payment_status === paymentStatus : true;
                const orderMatch = orderStatus ? order.order_status === orderStatus : true;
                const searchMatch = order.order_name.toLowerCase().includes(searchTerm.toLowerCase());
                return paymentMatch && orderMatch && searchMatch;
            });

            setAllOrders(filteredOrders);
            setRetrievedOrders(filteredOrders);
            setCourier('');
            setTrackingNumber('');
            setTimeout(()=> {
                setLoading(false);
            }, 500); 
            console.log(filteredOrders);
        } catch (error) {
            console.error('Error getting orders:', error.message);
        }
    };

    const getAllOrderDates = async () => {
        try {
            const { dates } = await getOrderDates();
            const formattedDates = dates.map((date, index) => 
				moment(date.date_created).toDate()
			);
            setOrderDates(formattedDates);
            console.log(dates);
        } catch (error) {
            console.error('Error getting order dates:', error.message);
        }
    };

    const getAllOrderStatistics = async (startDate) => {
        try {
            const { stats } = await getOrderStatistics(startDate);
            setOrderStats(stats);
        }
        catch(error){
            console.error('Error getting order statistics:', error.message);
        }
    }

    useEffect(() => {
        getAllOrderDates();
    },[]);

    useEffect(() => {
        getAllOrderStatistics(startDate);
    },[startDate]);

    useEffect(() => {
        getAllOrders(selectedPaymentStatus, selectedOrderStatus, searchTerm, startDate);
    }, [selectedPaymentStatus, selectedOrderStatus, searchTerm, startDate]);

    const handlePaymentFilterChange = (e) => {
        setSelectedPaymentStatus(e.target.value);
        getAllOrders(e.target.value, selectedOrderStatus, searchTerm);
    };

    const handleOrderFilterChange = (e) => {
        setSelectedOrderStatus(e.target.value);
        getAllOrders(selectedPaymentStatus, e.target.value, searchTerm);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        getAllOrders(selectedPaymentStatus, selectedOrderStatus, e.target.value);
    };

    const getOrderItems = async (orderId) => {
        try {
            setShowMessage(false);
            const { items } = await getOrdersItems(orderId);
            setOrderItems(items);
            // get items with Bike Upgrader type
            const buItems = items.filter(item => item.part_type === 'Bike Upgrader');
            setOrderBUItems(buItems);

            // get items with Bike Builder type
            const bbItems = items.filter(item => item.part_type === 'Bike Builder');
            setOrderBBItems(bbItems);

            // Group items by build_id and calculate total price for each group
            const bbItemsGroupedWithTotal = bbItems.reduce((acc, item) => {
                if (!acc[item.build_id]) {
                    acc[item.build_id] = { items: [], totalPrice: 0 };
                }

                // Add item to the items array for this build_id
                acc[item.build_id].items.push(item);

                // Increment the total price for this build_id
                acc[item.build_id].totalPrice += item.item_price * item.item_qty;

                return acc;
            }, {});

            setGroupedBBItems(bbItemsGroupedWithTotal);

            const combinedTotalBBPrice = Object.values(bbItemsGroupedWithTotal).reduce(
                (total, group) => total + group.totalPrice,
                0
            );

            const combinedTotalBUPrice = buItems.reduce((acc,item) => acc + Number(item.item_price) * Number(item.item_qty), 0);

            setTotalBBPrice(combinedTotalBBPrice);
            setTotalBUPrice(combinedTotalBUPrice);

            console.log(items);
        } catch (error) {
            console.error('Error getting order items:', error.message);
        }
    }

    const handleUpdateOrderStatus = async (statusTo) => {
        try {
            setDisableButton(true);

            const { message } = await updateOrderStatus(selectedOrder.order_id, statusTo, selectedOrder.order_name, selectedOrder.email);


            if(message === 'no-stock'){
                setShowChangeStatusModal(false);
                setShowNoStockResponse(true);
                setDisableButton(false);
                return;
            } else {
                if(statusTo === 'in-process') {
                    await deductStockForCompletedOrder(selectedOrder.order_id);
                }

                if(statusTo.includes('ready')) {
                    if(selectedOrder.bu_option === 'deliver-home'){
                        await updateOrderShipping(selectedOrder.order_id, trackingNumber, courier);
                    }
                }
            }

            setShowChangeStatusModal(false);
            setShowEmailResponse(true);
            setDisableButton(false);
            const { orders } = await getOrders(startDate);
            const orderBySelectedID = orders.filter(order => order.order_id === selectedOrder.order_id);
            getOrderItems(selectedOrder.order_id);
            setSelectedOrder(orderBySelectedID[0]);
        } catch (error) {
            console.error('Error updating order status:', error.message);
        }
    }

    const handleDeleteExpiredOrder = async (orderId) => {
        try {
            await deleteExpiredOrder(orderId);
            setShowDeleteExpiredOrderModal(false);
            handleCloseOrder();
        } catch (error) {
            console.error('Error deleting expired order:', error.message);
        }
    }

    const handleOpenOrder = (order) => {
        setOrdersView(false);
        setOpenOrderView(true);
        getOrderItems(order.order_id);
        setSelectedOrder(order);
    }

    const handleCloseOrder = () => {
        getAllOrders(selectedPaymentStatus, selectedOrderStatus, searchTerm, startDate);
        setOrdersView(true);
        setOpenOrderView(false);
    }

    const handleChangeStatus = (status) => {
        setShowChangeStatusModal(true);
        setChangeStatusTo(status);
    }

    const handleSetShippingDetails = (status) => {
        console.log(selectedOrder.bu_option);
        if(selectedOrder.bu_option === 'deliver-home' && (courier === '' || trackingNumber === '')){ 
            setShowMessage(true);
            setShowChangeStatusModal(false);
            return;
        } else {
            setShowMessage(false);
            setShowChangeStatusModal(true);
            setChangeStatusTo(status);
        }
    }

    const statusDates = [
        { label: 'Processed on', date: selectedOrder.processed_at },
        { label: 'Ready for Pickup on', date: selectedOrder.pickup_ready_date },
        { label: 'Shipped on', date: selectedOrder.shipped_at }
    ];

    const sortedStatusDates = statusDates
    .filter(status => status.date) // Remove entries with null/undefined dates
    .sort((a, b) => new Date(a.date) - new Date(b.date)); 

    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>

    return (
        <div className='orders p-3'>
            <PageLayout
                leftContent={
                <div className='orders-container'>
                    <ChangeStatusConfirmation
                        show={showChangeStatusModal}
                        onHide={() => setShowChangeStatusModal(false)}
                        onConfirm={() => handleUpdateOrderStatus(changeStatusTo)}
                    />
                    <EmailResponse
                        show={showEmailResponse}
                        onHide={() => setShowEmailResponse(false)}
                    />
                    <NoStockResponse
                        show={showNoStockResponse}
                        onHide={() => setShowNoStockResponse(false)}
                    />
                    <DeleteExpiredOrderConfirmation
                        show={showDeleteExpiredOrderModal}
                        onHide={() => setShowDeleteExpiredOrderModal(false)}
                        onConfirm={() => handleDeleteExpiredOrder(selectedOrder.order_id)}
                    />
                    {ordersView && <>
                            <div className="nav">
                                <DatePicker
                                    selected={startDate ? new Date(startDate) : null}
                                    onChange={(date) => {
                                        const formattedDate = moment(date).format("YYYY-MM-DD");
                                        setStartDate(formattedDate);
                                        getAllOrders(selectedPaymentStatus, selectedOrderStatus, searchTerm, formattedDate);
                                    }}
                                    dateFormat="MMMM d, yyyy"
                                    maxDate={new Date()}
                                    isClearable={false}
                                    todayButton="Today"
                                    scrollableYearDropdown={true}
                                    highlightDates={orderDates}
                                    customInput={<DisabledDateInput className="date-picker" />}
                                />
                                <div className="search-sorting">
                                    <SearchBar 
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder={'Search order name'}
                                    />
                                    <div className="filter">
                                        <select name="payment" id="paymentFilter" onChange={handlePaymentFilterChange} defaultValue="">
                                            <option value="">All Payment</option>
                                            <option value="paid">Paid</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                        <select name="order" id="orderFilter" onChange={handleOrderFilterChange} defaultValue="">
                                            <option value="">All Order</option>
                                            <option value="pending">Pending</option>
                                            <option value="in-process">In Process</option>
                                            <option value="completed">Completed</option>
                                            <option value="expired">Expired</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="list">
                                {retrievedOrders.map((order, index) => (
                                    <div className="order" key={index} onClick={() => handleOpenOrder(order)}>
                                        <div className="order-top">
                                            <div className="left">
                                                <i className="fa-solid fa-bag-shopping"></i>
                                                <p className="order-id">{order.order_name.toUpperCase()}</p>
                                            </div>
                                            <p className="time">{moment(order.date_created).format("LT")}</p>
                                        </div>
                                        <div className="order-mid">
                                            <p className="name">{order.cust_name}</p>
                                            <p className="amount">{PesoFormat.format(order.order_amount)}</p>
                                        </div>
                                        <div className="order-bottom">
                                            <div className='payment'>
                                                <p className={"pstatus " + order.payment_status}>{order.payment_status}</p>
                                                {order.payment_status === 'paid' && <p className={"payment-type " + order.payment_type}>{order.payment_type}</p>}
                                            </div>
                                            <p className={"ostatus " + order.order_status}>ORDER {order.order_status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {retrievedOrders.length === 0 &&
                                <div className="no-order">
                                    <p>No orders.</p>
                                </div>
                            }
                    </>}
                    {openOrderView && <>
                            <div className="nav">
                                <button
                                    onClick={handleCloseOrder}
                                    className="back"
                                ><i className="fa-solid fa-arrow-left"></i></button>
                            </div>
                            <div className="order-details">
                                <div className="order-header">
                                    <div className="left">
                                        <h4>{selectedOrder.order_name.toUpperCase()}</h4>
                                        <p>Payment ID: {selectedOrder.payment_id.toUpperCase()}</p>
                                    </div>
                                    <div className="right">
                                        <p>Order placed on {moment(selectedOrder.date_created).format("LL")}</p>
                                        <p>{moment(selectedOrder.date_created).format("LT")}</p>
                                    </div>
                                </div>
                                {selectedOrder.expires_at && moment(selectedOrder.expires_at).isAfter(moment()) && (
                                    <p className="expired-message">
                                       This order's payment is pending. It will expire on {moment(selectedOrder.expires_at).format("LLL")}.
                                    </p>
                                )}
                                {selectedOrder.expires_at && moment(selectedOrder.expires_at).isBefore(moment()) && (
                                    <p className="expired-message">
                                        This order has expired on {moment(selectedOrder.expires_at).format("LLL")}.
                                    </p>
                                )}
                                <div className="payment-details">
                                    <div className="left">
                                        <h5>{PesoFormat.format(selectedOrder.order_amount)}</h5>
                                        <p>Order Amount</p>
                                    </div>
                                    {selectedOrder.payment_status === 'paid' && <div className="mid">
                                        <h5>Paid via <span>{selectedOrder.payment_type.toUpperCase()}</span></h5>
                                        <p>Payment Status</p>
                                    </div>}
                                    {(selectedOrder.payment_status === 'pending') && <div className="mid">
                                        <h5>Pending</h5>
                                        <p>Payment Status</p>
                                    </div>}
                                    <div className="right">
                                        <h5 className={'ostatus ' + selectedOrder.order_status}>{selectedOrder.order_status}</h5>
                                        <p>Order Status</p>
                                    </div>
                                </div>
                                {selectedOrder.bb_option !== 'n/a' && <div className="order-items-container">
                                    <div className="header">
                                        <div className="left">
                                            <h4>Bike Builder</h4>
                                        </div>
                                        <div className="right">
                                            <h5>{PesoFormat.format(totalBBPrice)}</h5>
                                            <p>Subtotal</p>
                                        </div>
                                    </div>
                                    <div className="build">
                                        <div className="order-items">
                                            {Object.keys(groupedBBItems).map((buildId, index) => (
                                                <div key={index} className="build-group">
                                                    <h5>{buildId}</h5>
                                                    <p>Total Price: {PesoFormat.format(groupedBBItems[buildId].totalPrice)}</p>
                                                    <div className="order-items">
                                                        {groupedBBItems[buildId].items.map((item, itemIndex) => (
                                                            <div className="order-item" key={itemIndex}>
                                                                <img
                                                                    src={`data:image/jpeg;base64,${item.image}`}
                                                                    alt="Item"
                                                                />
                                                                <p className='item-name'>{item.item_name}</p>
                                                                <p>{PesoFormat.format(item.item_price)}</p>
                                                                <p>Qty: {item.item_qty}</p>
                                                                <p>Stock: {item.stock_count}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>}
                                {selectedOrder.bu_option !== 'n/a' && <div className="order-items-container">
                                    <div className="header">
                                        <div className="left">
                                            <h4>Bike Upgrader</h4>
                                        </div>
                                        <div className="right">
                                            <h5>{PesoFormat.format(totalBUPrice)}</h5>
                                            <p>Subtotal</p>
                                        </div>
                                    </div>
                                        <p>{orderBUItems.length} items</p>
                                    <div className="order-items">
                                        {orderBUItems.map((item, index) => (
                                            <div className="order-item" key={index}>
                                                <img
                                                    src={`data:image/jpeg;base64,${item.image}`}
                                                    alt="Item"
                                                />
                                                <p className='item-name'>{item.item_name}</p>
                                                <p>{PesoFormat.format(item.item_price)}</p>
                                                <p>Qty: {item.item_qty}</p>
                                                <p>Stock: {item.stock_count}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                            </div>
                    </>}
                </div>
                }

                rightContent=
                {
                <div className='dashboard-container'> 
                    {ordersView && <>
                        <div className="container-content">
                            <div className="main-content">
                                <div className="number">{orderStats.orders_today}</div>
                                <div className="title">
                                   <p>Orders <span>{startDate === nowDate ? "Today" : "this day"}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="container-content">
                            <div className="main-content">
                                <div className="number">{PesoFormat.format(orderStats.total_sales_today)}</div>
                                <div className="title">
                                    <p>Order Sales <span>{startDate === nowDate ? "Today" : "this day"}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="container-content">
                            <div className="main-content">
                                <div className="number">{orderStats.total_orders}</div>
                                <div className="title">Total Orders</div>
                            </div>
                        </div>

                        <div className="container-content">
                            <div className="main-content">
                                <div className="number">{PesoFormat.format(orderStats.total_sales)}</div>
                                <div className="title">Total Order Sales</div>
                            </div>
                        </div>
                    </>}
                    {openOrderView && <>
                        {(selectedOrder.order_status === 'pending' && selectedOrder.payment_status === 'paid') && <div className="order-content">
                            <div className="main-content">
                                <h5>Order Status</h5>
                                <div className="inner-details">
                                    <button className='process' onClick={() => handleChangeStatus('in-process')}>Mark as In Process</button>
                                </div>
                            </div>
                        </div>}

                        {(selectedOrder.order_status === 'expired') && <div className="order-content">
                            <div className="main-content">
                                <h5>Order Status</h5>
                                <div className="inner-details">
                                    <button className='cancel' onClick={()=> setShowDeleteExpiredOrderModal(true)}>Cancel Order</button>
                                </div>
                            </div>
                        </div>}
                        
                        {selectedOrder.order_status === 'in-process' && (
                            <div className="order-content">
                                <div className="main-content">
                                    <h5>Order Status</h5>
                                    {sortedStatusDates.map((status, index) => (
                                        <p key={index} className="time">
                                            {status.label} <span>{moment(status.date).format("LLL")}</span>
                                        </p>
                                    ))}

                                    {showMessage && <p className='message'> Fill up the tracking details below.</p>}

                                    {/* Scenario 1, 2, and 3: Show "Mark as Ready for Pickup" if pickup-store is set for bb_option or bu_option */}
                                    {((selectedOrder.bb_option === 'pickup-store' || selectedOrder.bu_option === 'pickup-store') && 
                                    !selectedOrder.pickup_ready_date) && (
                                        <div className="inner-details">
                                            <button
                                                className='ready-shipped'
                                                onClick={() => handleSetShippingDetails('ready-pickup')}
                                            >
                                                Mark as Ready for Pickup
                                            </button>
                                        </div>
                                    )}

                                    {/* Scenario 4 and 5: Show "Mark as Shipped" if bu_option is deliver-home and shipped_at is not set */}
                                    {(selectedOrder.bu_option === 'deliver-home' && !selectedOrder.shipped_at) && (
                                        <div className="inner-details">
                                            <button
                                                className='ready-shipped'
                                                onClick={() => handleSetShippingDetails('ready-shipped')}
                                            >
                                                Mark as Shipped
                                            </button>
                                        </div>
                                    )}

                                    {/* Show Completed button based on the scenarios */}
                                    {(
                                        // Scenario 1, 2, and 3: Show Completed when Ready for Pickup is set and only for pickup-store options
                                        ((selectedOrder.bb_option === 'pickup-store' && selectedOrder.bu_option === 'n/a' && selectedOrder.pickup_ready_date) ||
                                        (selectedOrder.bu_option === 'pickup-store' && selectedOrder.bb_option === 'n/a' && selectedOrder.pickup_ready_date) ||
                                        (selectedOrder.bb_option === 'pickup-store' && selectedOrder.bu_option === 'pickup-store' && selectedOrder.pickup_ready_date)) ||

                                        // Scenario 4: Show Completed when both Ready for Pickup and Shipped are set
                                        (selectedOrder.bb_option === 'pickup-store' && selectedOrder.bu_option === 'deliver-home' &&
                                        selectedOrder.pickup_ready_date && selectedOrder.shipped_at) ||

                                        // Scenario 5: Show Completed only if Shipped is set for bu_option = deliver-home and bb_option = n/a
                                        (selectedOrder.bu_option === 'deliver-home' && selectedOrder.bb_option === 'n/a' && selectedOrder.shipped_at)
                                    ) && (
                                        <div className="inner-details">
                                            <button
                                                className='ready-shipped'
                                                onClick={() => handleChangeStatus('completed')}
                                            >
                                                Completed
                                            </button>
                                        </div>
                                    )}

                                    
                                </div>
                            </div>
                        )}

                        {(selectedOrder.order_status === 'completed') && <div className="order-content">
                            <div className="main-content">
                                <h5>Order Status</h5>
                                {sortedStatusDates.map((status, index) => (
                                    <p key={index} className="time">
                                        {status.label} <span>{moment(status.date).format("LLL")}</span>
                                    </p>
                                ))}
                                <p className='time'>Completed on <span>{moment(selectedOrder.completed_at).format("LLL")}</span></p>
                            </div>
                        </div>}

                        {selectedOrder.payment_status === 'paid' && <div className="order-content">
                            <div className="main-content">
                                <h5>Order Link</h5>
                                <div className="inner-details">
                                    <div className="name">
                                        <i className="fa-solid fa-link"></i>
                                        <p>{link + selectedOrder.order_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {selectedOrder.payment_status === 'paid' && <div className="order-content">
                            <div className="main-content">
                                <h5>Customer Details</h5>
                                <div className="inner-details">
                                    <div className="name">
                                        <i className="fa-solid fa-user"></i>
                                        <p>{selectedOrder.cust_name}</p>
                                    </div>
                                    <div className="contact">
                                        <i className="fa-solid fa-phone"></i>
                                        <p>{selectedOrder.phone}</p>
                                    </div>
                                    <div className="email">
                                        <i className="fa-solid fa-envelope"></i>
                                        <p>{selectedOrder.email}</p>
                                    </div>
                                    {(selectedOrder.bu_option === 'deliver-home' || selectedOrder.bb_option === 'deliver-home') && <div className="address">
                                        <i className="fa-solid fa-location"></i>
                                        <p>{selectedOrder.cust_address}</p>
                                    </div>}
                                </div>
                            </div>
                        </div>}
                        <div className="order-content">
                            <div className="main-content">
                                <div className="delivery-options">
                                    <h5>Delivery Options Selected</h5>
                                    {selectedOrder.bu_option !== 'n/a' && <div className="option">
                                        <h6>Bike Upgrader</h6>
                                        <div className={selectedOrder.bu_option === 'deliver-home' ? "delivery" : "pickup"}>
                                            <i className={selectedOrder.bu_option === 'deliver-home' ? "fa-solid fa-truck" : "fa-solid fa-store"}></i>
                                            <p>{selectedOrder.bu_option === 'deliver-home' ? "Home Delivery" : "In Store Pickup"}</p>
                                        </div>
                                    </div>}
                                    {selectedOrder.bb_option !== 'n/a' && <div className="option">
                                        <h6>Bike Builder</h6>
                                        <div className={selectedOrder.bb_option === 'deliver-home' ? "delivery" : "pickup"}>
                                            <i className={selectedOrder.bb_option === 'deliver-home' ? "fa-solid fa-truck" : "fa-solid fa-store"}></i>
                                            <p>{selectedOrder.bb_option === 'deliver-home' ? "Home Delivery" : "In Store Pickup"}</p>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {(selectedOrder.order_status === 'in-process' && selectedOrder.bu_option === 'deliver-home') && !selectedOrder.shipped_at && <div className="order-content">
                            <div className="main-content">
                                <h5>Tracking Details</h5>
                                <div className="inner-details">
                                    <div className="input-group">
                                        <label htmlFor="courier">Courier</label>
                                        <input type="text" id="courier" placeholder='Enter courier name' onChange={(e) => setCourier(e.target.value)}/>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="tracking">Tracking Number</label>
                                        <input type="text" id="tracking" placeholder='Enter tracking number' onChange={(e) => setTrackingNumber(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {((selectedOrder.order_status === 'in-process' || selectedOrder.order_status === 'completed') && selectedOrder.bu_option === 'deliver-home') && selectedOrder.shipped_at && <div className="order-content">
                            <div className="main-content">
                                <h5>Tracking Details</h5>
                                <div className="inner-details">
                                    <div className="input-group">
                                        <label htmlFor="courier">Courier</label>
                                        <input disabled type="text" id="courier" placeholder='Enter courier name' value={selectedOrder.courier}/>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="tracking">Tracking Number</label>
                                        <input disabled type="text" id="tracking" placeholder='Enter tracking number' value={selectedOrder.tracking_number}/>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </>}
                </div>
                }
            />
        </div>
    );
};

export default Orders;