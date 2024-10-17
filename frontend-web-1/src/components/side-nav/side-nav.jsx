import React from 'react';
import './side-nav.scss'
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SideNav = ({ onNavClick, isAdmin }) => {
    return (
        <div className="side-nav pt-3">
            <div className='mb-2 ms-3 fs-4 fw-bold'>ARONBIKES</div>
            <Nav className="flex-column">
                {isAdmin ? (
                    <>
                        <Nav.Link as={Link} to="/" onClick={() => onNavClick('Dashboard')}>Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/pos-users" onClick={() => onNavClick('POS Users')}>POS Users</Nav.Link>
                        <Nav.Link as={Link} to="/inventory" onClick={() => onNavClick('Inventory')}>Inventory</Nav.Link>
                        <Nav.Link as={Link} to="/mechanics" onClick={() => onNavClick('Mechanics')}>Mechanics</Nav.Link>
                        <Nav.Link as={Link} to="/summaries" onClick={() => onNavClick('Summaries')}>Summaries</Nav.Link>
                        <Nav.Link as={Link} to="/records" onClick={() => onNavClick('Records')}>Records</Nav.Link>
                        <Nav.Link as={Link} to="/receipts" onClick={() => onNavClick('Receipts')}>Receipts</Nav.Link>
                        <Nav.Link as={Link} to="/reports" onClick={() => onNavClick('Reports')}>Reports</Nav.Link>
                        <Nav.Link as={Link} to="/waitlist" onClick={() => onNavClick('Waitlist')}>Waitlist</Nav.Link>
                        <Nav.Link as={Link} to="/bike-builder-upgrader" onClick={() => onNavClick('Bike Builder & Upgrader')}>Bike Builder & Upgrader</Nav.Link>
                        <Nav.Link as={Link} to="/orders" onClick={() => onNavClick('Orders')}>Orders</Nav.Link>
                        <Nav.Link as={Link} to="/preview" onClick={() => onNavClick('Preview')}>Bike Builder Preview</Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to="/point-of-sales" onClick={() => onNavClick('Point of Sales')}>Point of Sales</Nav.Link>
                        <Nav.Link as={Link} to="/expenses" onClick={() => onNavClick('Expenses')}>Expenses</Nav.Link>
                        <Nav.Link as={Link} to="/receipts" onClick={() => onNavClick('Receipts')}>Receipts</Nav.Link>
                        <Nav.Link as={Link} to="/waitlist" onClick={() => onNavClick('Waitlist')}>Waitlist</Nav.Link>
                        <Nav.Link as={Link} to="/bike-builder-upgrader" onClick={() => onNavClick('Bike Builder & Upgrader')}>Bike Builder & Upgrader</Nav.Link>
                        <Nav.Link as={Link} to="/orders" onClick={() => onNavClick('Orders')}>Orders</Nav.Link>
                    </>
                )}
            </Nav>
        </div>
    );
};

export default SideNav;