import "./landing-page.scss"
import React from "react";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="content">
                <div className="text">
                    <h1> To keep your balance, <br /> you must keep moving.<br /> </h1>
                    <p className="mt-4">
                        Welcome! This is your ultimate destination for custom bike builds and quality upgrade parts. Whether you're building from scratch or enhancing your current ride, we've got everything you need to hit the road with confidence and style. Start your biking journey with us today!
                    </p>
                </div>
                <div className="btns">
                    <button className="btn-1">
                        <NavLink to="/bike-builder" className="nav-link">
                            Build Your Bike
                        </NavLink>
                    </button>
                    <button className="btn-2">
                        <NavLink to="/bike-upgrader" className="nav-link">
                            Upgrade Your Bike
                        </NavLink>
                    </button>
                </div>
            </div>
            <div className="end">
                <p>&copy; 2024 GearUp. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LandingPage;