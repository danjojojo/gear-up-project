import React, {useState, useEffect, useContext} from 'react'
import './checkout.scss';
import {useNavigate} from 'react-router-dom';
import { useCartItems } from "../../utils/cartItems";
import { createCheckoutSession, createOrder, getStoreAddress } from "../../services/checkoutService";
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import compressBase64Image from '../../utils/compressImage';
import {
    getProfile
} from '../../services/userService';
import { AuthContext } from '../../context/auth-context';

const Checkout = () => {
    const { totalPrice, loading, checkedBuItems, checkedBbItems, checkedBuItemsTotal, checkedBbItemsTotal  } = useCartItems();

    const { loggedIn } = useContext(AuthContext);

    const [storeAddress, setStoreAddress] = useState('');

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    const getCurrentSettings = async () => {
        try {
            const { storeAddress } = await getStoreAddress();
            let retrievedStoreAddress = storeAddress.setting_value;
            setStoreAddress(retrievedStoreAddress);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCurrentSettings();
    }, []);

    const getLineItems = () => {
        let lineItems = [];
        checkedBuItems.forEach((part) => {
            lineItems = [...lineItems, 
                { 
                    name: part.item_name, 
                    quantity: part.qty, 
                    amount: part.item_price * 100, 
                    currency: 'PHP', 
                    description: 'Bike upgrader',
                }];
        });
        checkedBbItems.forEach((part) => {
            lineItems = [...lineItems, 
                { 
                    name: part.build_id.toUpperCase(),
                    quantity: 1, 
                    amount: part.build_price * 100, 
                    currency: 'PHP', 
                    description: 'Bike builder' ,
                }];
        });
        return lineItems;
    }

    useEffect(() => {
        getLineItems();
        if(checkedBuItems.length === 0) {
            setBikeUpgradeDelivery('n/a');
        }
        checkedBbItems.length > 0 ? setBikeBuildDelivery('pickup-store') : setBikeBuildDelivery('n/a');
    }, [checkedBuItems, checkedBbItems]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();
    
    const [bikeUpgradeDelivery, setBikeUpgradeDelivery] = useState('');
    const [bikeBuildDelivery, setBikeBuildDelivery] = useState('');

    const isFormIncomplete = 
        (checkedBuItems.length + checkedBbItems.length === 0) || 
        (name === '') || 
        (email === '') || 
        (phone.length === 0 || phone.length !== 11) ||
        (bikeUpgradeDelivery === 'deliver-home' && address === "");
    
    const isDeliveryOptionIncomplete = 
        (checkedBuItems.length !== 0 && bikeUpgradeDelivery === 'n/a') || 
        (checkedBbItems.length !== 0 && bikeBuildDelivery === 'n/a');

    const prepareOrderDetails = async (checkedBbItems) => {
        const orderBbDetails = await Promise.all(
            checkedBbItems.map(async (part) => ({
                build_name: part.build_id,
                build_price: part.build_price,
                image: await compressBase64Image(part.image, 800, 800, 0.7),
            }))
        );
        return orderBbDetails;
    };
    
    const proceedToPayment = async () => {
        const retrievedLineItems = getLineItems();
        
        let sessionOrder = [{
            name: name,
            email: email,
            phone: phone,
            address: address,
            bikeBuildDelivery: bikeBuildDelivery,
            bikeUpgradeDelivery: bikeUpgradeDelivery,
            amount: totalPrice
        }];

        const orderBuItems = checkedBuItems.map((part) => ({
            id: part.item_id,
            name: part.item_name,
            quantity: part.qty,
            amount: part.item_price,
            type: 'Bike Upgrader',
            build_id: 'n/a',
            part: part.bike_parts,
        })); 

        const orderBbItems = checkedBbItems.flatMap((part) => 
            Object.entries(part.parts).map(([key, value]) => ({
                id: value.item_id,
                name: value.item_name,
                quantity: 1,
                amount: value.item_price,
                type: 'Bike Builder',
                build_id: part.build_id,
                part: value.bike_parts,
            }))
        );  

        const orderBbDetails = await prepareOrderDetails(checkedBbItems);

        const orderItems = [...orderBuItems, ...orderBbItems];

        const {checkoutUrl, checkoutSessionId } = await createCheckoutSession(name, email, phone, address, retrievedLineItems, sessionOrder, orderItems);

        sessionOrder[0].checkoutSessionId = checkoutSessionId;
        await createOrder(sessionOrder, orderBbDetails, orderItems);

        sessionOrder = [...sessionOrder, {checkoutSessionId: checkoutSessionId}];
        sessionStorage.setItem('sessionOrder', JSON.stringify(sessionOrder));
        sessionStorage.setItem('sessionOrderId', checkoutSessionId);
        sessionStorage.setItem('orderItems', JSON.stringify(orderItems));
        window.location.href = checkoutUrl;
    }

    // Retrieve name, email, phone, address from local storage
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');
        const storedPhone = localStorage.getItem('phone');
        const storedAddress = localStorage.getItem('address');

        if (storedName) {
            setName(storedName);
        }
        if (storedEmail) {
            setEmail(storedEmail);
        }
        if (storedPhone) {
            setPhone(storedPhone);
        }
        if (storedAddress) {
            setAddress(storedAddress);
        }
    }, []);

    // Store name, email, phone, address in local storage
    useEffect(() => {
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        localStorage.setItem('address', address);
    }, [name, email, phone, address]);

    return (
        <div className='checkout'>
            <div className="left">
                <div className="title">
                    <h4>Checkout</h4>
                </div>
                <div className="billing-details">
                    <div className="title">
                        <h5>Billing Information</h5>
                    </div>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="" id="" 
                            value={name}
                            className={name === '' ? 'input-incomplete' : ''}
                            onChange={(e) => setName(e.target.value)}
                            // disabled={loading ? true : false}
                            placeholder='First name, Surname'
                        />
                    </div>
                    <div className="input-group">
                        <label 
                            htmlFor="email"
                        >Email</label>
                        <input type="email" id="email" 
                            value={email}
                            className={email === '' ? 'input-incomplete' : ''}
                            onChange={(e) => setEmail(e.target.value)}
                            // disabled={loading ? true : false}
                            placeholder='Email Address'
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Use an email address where we can contact you."
                            data-tooltip-place="right"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" id="phone" 
                            value={phone}
                            className={(phone.length === 0 || phone.length !== 11) ? 'input-incomplete' : ''}
                            onChange={(e) => setPhone(e.target.value)}
                            // disabled={loading ? true : false}
                            // get the length of the phone number
                            placeholder='09xxxxxxxxx' 
                        />
                    </div>
                    {checkedBbItems.length !== 0 && <div className="input-group">
                        <label>Bike Build Delivery Option</label>
                        <div className="btns">
                            <input
                                type="radio"
                                id="bikeBuildPickup"
                                name="bikeBuildDelivery"
                                value="pickup-store"
                                onChange={(e) => {
                                    setBikeBuildDelivery(e.target.value);
                                    setAddress(address);
                                }}
                                defaultChecked
                            />
                            <label 
                                htmlFor="bikeBuildPickup" 
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="We recommend in-store pick up for bike builds."
                                data-tooltip-place="right"
                            >
                                In Store Pick Up
                            </label>
                        </div>
                    </div>}
                    {checkedBuItems.length !== 0 && <div className="input-group">
                        <label>Bike Upgrade Delivery Option</label>
                        <div className="btns">
                            <input
                                type="radio"
                                id="bikeUpgradePickup"
                                name="bikeUpgradeDelivery"
                                value="pickup-store"
                                onClick={(e) => {
                                    setBikeUpgradeDelivery(e.target.value);
                                    setAddress(address);
                                }}
                            />
                            <label 
                                htmlFor="bikeUpgradePickup"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="You can pick up your bike upgrades in store."
                                data-tooltip-place="right"
                            >
                                In Store Pick Up
                            </label>

                            <input
                                type="radio"
                                id="bikeUpgradeDelivery"
                                name="bikeUpgradeDelivery"
                                value="deliver-home"
                                onClick={(e) => {
                                    setBikeUpgradeDelivery(e.target.value);
                                    setAddress(address);
                                }}
                            />
                            <label 
                                htmlFor="bikeUpgradeDelivery"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Upgrade parts are delivered to your address."
                                data-tooltip-place="right"
                            >
                                Home Delivery
                            </label>
                        </div>
                    </div>}
                    {(bikeUpgradeDelivery === 'pickup-store' || bikeBuildDelivery === 'pickup-store') && <div className="input-group">
                        <label htmlFor="">Store Location</label>
                        <p>{storeAddress}</p>
                    </div>}
                    {bikeUpgradeDelivery === 'deliver-home' && <div className="input-group">
                        <label htmlFor="address">Your Address</label>
                        <input type="text" id="address" 
                            value={address}
                            className={address === '' ? 'input-incomplete' : ''}
                            onChange={(e) => setAddress(e.target.value)}
                            // disabled={loading ? true : false}
                            placeholder='Street, City, Province, Zip Code'
                        />
                    </div>}
                    <Tooltip id="my-tooltip" />
                </div>
                {/* save information next time */}
                {!loading && <div className="total">
                    <p>Bike Builder: <span>{PesoFormat.format(checkedBbItemsTotal)}</span></p>
                    <p>Bike Upgrader: <span>{PesoFormat.format(checkedBuItemsTotal)}</span></p>
                    <p>Total: <span>{PesoFormat.format(totalPrice)}</span></p>
                </div>}
                {loading && <div className="loading-total">
                    <i className="fa-solid fa-gear fa-spin"></i>
                    <p>Calculating your cart items...</p>
                </div>}
                <button
                    onClick={proceedToPayment}
                    disabled={
                        (checkedBuItems.length + checkedBbItems.length === 0) ||
                        (isFormIncomplete ||
                        isDeliveryOptionIncomplete) }
                    className={
                        (checkedBuItems.length + checkedBbItems.length === 0) ||
                        (isFormIncomplete ||
                        isDeliveryOptionIncomplete) 
                         ? "disabled" : "enabled"}
                >
                    Proceed to Payment
                </button>
            </div>
            <div className="right">
                 <div className="message-3">
                    <i className="fa-solid fa-info"></i>
                    <p>Make sure to double check your billing information before proceeding to payment.</p>
                </div>
                <div className="nav">
                    <div className="title">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <h4>Cart Summary</h4>
                        <p className='edit-cart' onClick={() => navigate('/cart')}>Edit Cart</p>
                    </div>
                    {!loading && <div className="total">
                        <p>Total: {PesoFormat.format(totalPrice)}</p>
                    </div>}
                </div>
                { !loggedIn && 
                    <div className="message-1">
                        <i className="fa-regular fa-lightbulb"></i>
                        <p>You can log in to save your order to your Order History page.</p>           
                    </div>
                }
                { loggedIn && 
                    <div className="message-2">
                        <i className="fa-regular fa-bookmark"></i>
                        <p>This order will be saved to your Order History page.</p>           
                    </div>
                }
                {loading && <div className="loading">
                    <i className="fa-solid fa-gear fa-spin"></i>
                    <p>Getting your cart items...</p>
                </div>}
                {!loading && <div className="cart-items">
                    {checkedBbItems.map((part, index) => 
                        <div className="item" key={index}>
                            <div className="left-item-content">
                                <div className="img-container">
                                    <img 
                                        src={part.image}
                                        style={{objectFit: "cover", paddingLeft: "auto"}}
                                        alt="part" 
                                    />
                                </div>
                            </div>
                            <div className="right-item-content">
                                <div className="top">
                                    <div className="top-nav">
                                        <h5>Bike Build</h5>
                                    </div>
                                    <p className="subtitle">{part.build_id}</p>
                                    <p>Qty: 1</p>
                                </div>
                                <div className="bottom">
                                    <p>{PesoFormat.format(part.build_price)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {checkedBuItems.map((part, index) => 
                            <div className="item" key={index}>
                                <div className="left-item-content">
                                    <div className="img-container">
                                        <img 
                                            src={`data:image/jpeg;base64,${part.item_image}`}
                                            alt="part" 
                                        />
                                    </div>
                                </div>
                                <div className="right-item-content">
                                    <div className="top">
                                        <div className="top-nav">
                                            <h5>{part.item_name}</h5>
                                        </div>
                                        <p>{part.bike_parts}</p>
                                        <p>Qty: {part.qty}</p>
                                    </div>
                                    <div className="bottom">
                                        <p>{PesoFormat.format(part.item_price * part.qty)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>}    
            </div>
            
        </div>
    )
}

export default Checkout;