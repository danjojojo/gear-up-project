import React, { useContext } from 'react';
import './menu-nav.scss'
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';


const MenuNav = ({ onNavClick, isAdmin, setMenuOpen }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="menu-nav pt-3">
            <div className='menu-title-close mb-2 ms-3 fs-4 fw-bold'>
                <p>GearUp</p>
                <p className='menu-close' onClick={()=> setMenuOpen(false)}>x</p>
            </div>
            <Nav className="flex-column" onClick={()=> setMenuOpen(false)}>
                {isAdmin ? (
                    <>
                        <Nav.Link as={Link} to="/" onClick={() => onNavClick('Dashboard')}>Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/pos-users" onClick={() => onNavClick('POS Users')}>POS Users</Nav.Link>
                        <Nav.Link as={Link} to="/inventory" onClick={() => onNavClick('Inventory')}>Inventory</Nav.Link>
                        <Nav.Link as={Link} to="/summaries" onClick={() => onNavClick('Summaries')}>Summaries</Nav.Link>
                        <Nav.Link as={Link} to="/reports" onClick={() => onNavClick('Reports')}>Reports</Nav.Link>
                        <Nav.Link as={Link} to="/records" onClick={() => onNavClick('Records')}>Records</Nav.Link>
                        <Nav.Link as={Link} to="/waitlist" onClick={() => onNavClick('Waitlist')}>Waitlist</Nav.Link>
                        <Nav.Link as={Link} to="/bike-builder-upgrader" onClick={() => onNavClick('Bike Builder & Upgrader')}>Bike Builder & Upgrader</Nav.Link>
                        <Nav.Link as={Link} to="/orders" onClick={() => onNavClick('Orders')}>Orders</Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to="/point-of-sales" onClick={() => onNavClick('Point of Sales')}><i className="fa-solid fa-cash-register"></i>Point of Sales</Nav.Link>
                        <Nav.Link as={Link} to="/expenses" onClick={() => onNavClick('Expenses')}><i className="fa-solid fa-money-bill-1"></i>Expenses</Nav.Link>
                        <Nav.Link as={Link} to="/receipts" onClick={() => onNavClick('Receipts')}><i className="fa-solid fa-receipt"></i>Receipts</Nav.Link>
                        <Nav.Link as={Link} to="/waitlist" onClick={() => onNavClick('Waitlist')}><i className="fa-solid fa-ruler-horizontal"></i>Waitlist</Nav.Link>
                        <Nav.Link as={Link} to="/bike-builder-upgrader" onClick={() => onNavClick('Bike Builder & Upgrader')}><i className="fa-solid fa-bicycle"></i>Bike Builder & Upgrader</Nav.Link>
                        {/* <Nav.Link as={Link} to="/orders" onClick={() => onNavClick('Orders')}><i className="fa-solid fa-cart-shopping"></i>Orders</Nav.Link> */}
                    </>
                )}
            </Nav>
            <div className="logout">
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default MenuNav;