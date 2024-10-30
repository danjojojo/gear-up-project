import React, {useState, useEffect} from 'react'
import './checkout.scss';
import { useCartItems } from "../../utils/cartItems";
import { createCheckoutSession } from "../../services/checkoutService";
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'

const Checkout = () => {
    const { totalPrice, loading, checkedBuItems, checkedBbItems, checkedBuItemsTotal, checkedBbItemsTotal  } = useCartItems();

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    const getLineItems = () => {
        let lineItems = [];
        checkedBuItems.forEach((part) => {
            lineItems = [...lineItems, { id: part.item_id, cart_id: part.id, name: part.item_name, quantity: part.qty, amount: part.item_price * 100, currency: 'PHP', description: 'Test' }];
        });
        checkedBbItems.forEach((part) => {
            lineItems = [...lineItems, { name: part.build_id.toUpperCase(), quantity: 1, amount: part.build_price * 100, currency: 'PHP', description: 'Test' }];
        });
        return lineItems;
    }

    useEffect(() => {
        getLineItems();
    }, [checkedBuItems]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    
    const [bikeBuildDelivery, setBikeBuildDelivery] = useState('');
    const [bikeUpgradeDelivery, setBikeUpgradeDelivery] = useState('');
    
    const isFormIncomplete = 
    checkedBuItems.length + checkedBbItems.length === 0 || 
    name === '' || 
    email === '' || 
    phone.length === 0 || phone.length !== 11 ||
    address === '';
    
    const isDeliveryOptionIncomplete = checkedBuItems.length != 0 && bikeUpgradeDelivery === '' || checkedBbItems.length != 0 && bikeBuildDelivery === '';
    
    useEffect(() => { 
        console.log((checkedBuItems.length + checkedBbItems.length === 0), isFormIncomplete, bikeBuildDelivery, bikeUpgradeDelivery);
    },[name, email, phone, address, bikeBuildDelivery, bikeUpgradeDelivery]);
    
    const proceedToPayment = async () => {
        console.log('Proceed to Payment');
        console.log(name, email, phone, address);
        const retrievedLineItems = getLineItems();
        console.log(retrievedLineItems);
        const checkoutUrl = await createCheckoutSession(name, email, phone, address, retrievedLineItems);
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
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" 
                            value={email}
                            className={email === '' ? 'input-incomplete' : ''}
                            onChange={(e) => setEmail(e.target.value)}
                            // disabled={loading ? true : false}
                            placeholder='Email Address'
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
                    {checkedBbItems.length != 0 && <div className="input-group">
                        <label>Bike Build Delivery Option</label>
                        <div className="btns">
                            <input
                                type="radio"
                                id="bikeBuildPickup"
                                name="bikeBuildDelivery"
                                value="inStore"
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
                    {checkedBuItems.length != 0 && <div className="input-group">
                        <label>Bike Upgrade Delivery Option</label>
                        <div className="btns">
                            <input
                                type="radio"
                                id="bikeUpgradePickup"
                                name="bikeUpgradeDelivery"
                                value="inStore"
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
                                value="homeDelivery"
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
                    {bikeUpgradeDelivery === 'inStore' && <div className="input-group">
                        <label htmlFor="">Store Location</label>
                        <p>123 Main St, Cityville, Province, 12345</p>
                    </div>}
                    {bikeUpgradeDelivery === 'homeDelivery' && <div className="input-group">
                        <label htmlFor="address">Address</label>
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
                    disabled={checkedBuItems.length + checkedBbItems.length === 0}
                    className={
                        (checkedBuItems.length + checkedBbItems.length === 0) ||
                        isFormIncomplete ||
                        isDeliveryOptionIncomplete 
                         ? "disabled" : "enabled"}
                >
                    Proceed to Payment
                </button>
            </div>
            <div className="right">
                <div className="nav">
                    <div className="title">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <h4>Cart Summary</h4>
                    </div>
                    {!loading && <div className="total">
                        <p>Total: {PesoFormat.format(totalPrice)}</p>
                    </div>}
                </div>
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
                                        <h5>Bike Build {part.id}</h5>
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