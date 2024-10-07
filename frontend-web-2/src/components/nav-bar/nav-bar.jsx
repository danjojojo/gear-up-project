import "./nav-bar.scss"
import React from "react";
import { NavLink } from "react-router-dom";
import addcart from "../../assets/icons/add-cart.png"
const Navbar = () => {

    return (
        <div className="nav-bar">

            <div className="upper-nav">
                <NavLink to="/" end className="nav-link">
                    Home
                </NavLink>
                <NavLink to="/about" className="nav-link">
                    About
                </NavLink>
                <NavLink to="/contact-us" className="nav-link">
                    Contact Us
                </NavLink>
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

                <button className="add-to-cart">
                    <img src={addcart} alt="add-cart"/>
                </button>
            </div>
        </div >
    );
};

export default Navbar;