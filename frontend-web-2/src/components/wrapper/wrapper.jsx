import "./wrapper.scss"
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../nav-bar/nav-bar";

const Wrapper = () => {

    return (
        <div className="wrapper">
            <Navbar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default Wrapper;