import "./nav-bar.scss"
import React, {useEffect, useState, useContext} from "react";
import { NavLink } from "react-router-dom";
import addcart from "../../assets/icons/add-cart.png"
import { useNavigate } from "react-router-dom";
import { useCartItems } from "../../utils/cartItems";
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import {
    loginUser,
    logoutUser,
    getProfile
} from '../../services/userService';
import { AuthContext } from "../../context/auth-context";

const Navbar = () => {
    // const { bbParts, buParts, totalPrice, loading, fetchCartItems } = useCartItems();

    const navigate = useNavigate();

    const { profile, loggedIn, login, logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            setLoading(true);
            try {
                const { user } = await loginUser(response);  
                login(user);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }, 
        onError: () => console.log("Login Failed"),
    });

    const logOut = async () => {
        await logoutUser();
        googleLogout();
        logout(); 
    };

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const {user} = await getProfile();
            login(user); 
            setLoading(false);
        } catch (error) {
            setLoading(false);
            return console.error(error.message);
        }
    }

    useEffect(() => {
        if (!loggedIn) {
            fetchProfile();
        }
    }, [loggedIn]);

    // useEffect(() => {
    //     fetchCartItems();
    // },[bbParts, buParts]);

    return (
        <div className="nav-bar">

            <div className="upper-nav">
                <div className="left">
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
                    <NavLink to="/order-history" className="nav-link">
                        Order History
                    </NavLink> 
                </div>
                {!loggedIn && 
                    <button className="login" onClick={() => {
                            if(loading) return;
                            googleLogin();
                        }}>
                        <span><i className="fa-brands fa-google"></i></span>{loading ?  'Loading...' : 'Login with Google'}
                    </button>
                }
                {loggedIn && profile && (
                    <div className="profile">
                        {!loading && (
                            <>
                                <img src={profile.profile_picture} alt="profile" />
                                <p>{profile.name}</p>
                                <button onClick={logOut} className="logout">
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="lower-nav">
                <h2>
                    GearUp
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