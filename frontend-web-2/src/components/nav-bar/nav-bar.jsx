import "./nav-bar.scss"
import React, {useEffect} from "react";
import { NavLink } from "react-router-dom";
import addcart from "../../assets/icons/add-cart.png"
import { useNavigate } from "react-router-dom";
import { useCartItems } from "../../utils/cartItems";

const Navbar = () => {
    // const { bbParts, buParts, totalPrice, loading, fetchCartItems } = useCartItems();

    const navigate = useNavigate();

    // useEffect(() => {
    //     fetchCartItems();
    // },[bbParts, buParts]);

    return (
        <div className="nav-bar">

            <div className="upper-nav">
                <NavLink to="/" end className="nav-link">
                    Home
                </NavLink>
                {/* <NavLink to="/about" className="nav-link">
                    About
                </NavLink>
                <NavLink to="/contact-us" className="nav-link">
                    Contact Us
                </NavLink> */}
            <NavLink to="/help" className="nav-link">
                    Help
                </NavLink> 
            </div>

            <div className="lower-nav">
                <h2>
                    ARONBIKES
                </h2>
                <NavLink to="/bike-builder" className="nav-link">
                    Bike Builder
                </NavLink>
                <NavLink to="/bike-upgrader" className="nav-link">
                    Bike Upgrader
                </NavLink>

                <button className="add-to-cart" onClick={() => navigate('/cart')}>
                    <img src={addcart} alt="add-cart" />
                    {/* {bbParts.length + buParts.length != 0 && <p className="notification-badge">{bbParts.length + buParts.length}</p>} */}
                </button>
            </div>
        </div >
    );
};

export default Navbar;