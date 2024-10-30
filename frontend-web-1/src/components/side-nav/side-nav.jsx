import React, { useContext } from 'react';
import './side-nav.scss'
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

const SideNav = ({ onNavClick, isAdmin }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <div className="side-nav-bg">
            <div className="side-nav pt-3">
                <div className='title mb-2 ms-3'>GearUp</div>
                <Nav className="flex-column">
                    {isAdmin ? (
                        <>
                            <Nav.Link as={Link} to="/" onClick={() => onNavClick('Dashboard')}><i className="fa-solid fa-border-all"></i>Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/pos-users" onClick={() => onNavClick('POS Users')}><i className="fa-solid fa-users"></i>POS Users</Nav.Link>
                            <Nav.Link as={Link} to="/inventory" onClick={() => onNavClick('Inventory')}><i className="fa-solid fa-cubes"></i>Inventory</Nav.Link>
                            <Nav.Link as={Link} to="/mechanics" onClick={() => onNavClick('Mechanics')}><i className="fa-solid fa-wrench"></i>Mechanics</Nav.Link>
                            <Nav.Link as={Link} to="/summaries" onClick={() => onNavClick('Summaries')}><i className="fa-solid fa-book"></i>Summaries</Nav.Link>
                            <Nav.Link as={Link} to="/records" onClick={() => onNavClick('Records')}><i className="fa-regular fa-file-lines"></i>Records</Nav.Link>
                            <Nav.Link as={Link} to="/receipts" onClick={() => onNavClick('Receipts')}><i className="fa-solid fa-receipt"></i>Receipts</Nav.Link>
                            <Nav.Link as={Link} to="/reports" onClick={() => onNavClick('Reports')}><i className="fa-solid fa-file-export"></i>Reports</Nav.Link>
                            <Nav.Link as={Link} to="/waitlist" onClick={() => onNavClick('Waitlist')}><i className="fa-solid fa-ruler-horizontal"></i>Waitlist</Nav.Link>
                            <Nav.Link as={Link} to="/bike-builder-upgrader" onClick={() => onNavClick('Bike Builder & Upgrader')}><i className="fa-solid fa-bicycle"></i>Bike Builder & Upgrader</Nav.Link>
                            <Nav.Link as={Link} to="/orders" onClick={() => onNavClick('Orders')}><i className="fa-solid fa-cart-shopping"></i>Orders</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/point-of-sales" onClick={() => onNavClick('Point of Sales')}><i className="fa-solid fa-cash-register"></i>Point of Sales</Nav.Link>
                            <Nav.Link as={Link} to="/expenses" onClick={() => onNavClick('Expenses')}><i className="fa-solid fa-money-bill-1"></i>Expenses</Nav.Link>
                            <Nav.Link as={Link} to="/receipts" onClick={() => onNavClick('Receipts')}><i className="fa-solid fa-receipt"></i>Receipts</Nav.Link>
                            <Nav.Link as={Link} to="/waitlist" onClick={() => onNavClick('Waitlist')}><i className="fa-solid fa-ruler-horizontal"></i>Waitlist</Nav.Link>
                            <Nav.Link as={Link} to="/bike-builder-upgrader" onClick={() => onNavClick('Bike Builder & Upgrader')}><i className="fa-solid fa-bicycle"></i>Bike Builder & Upgrader</Nav.Link>
                            <Nav.Link as={Link} to="/orders" onClick={() => onNavClick('Orders')}><i className="fa-solid fa-cart-shopping"></i>Orders</Nav.Link>
                        </>
                    )}
                </Nav>
                <div className="logout">
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideNav;