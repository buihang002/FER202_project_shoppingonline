import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, MessageCircle, Clock, Home as HomeIcon, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const NavHome = () => {
    const { itemCount, currentUser, logout } = useCart(); // Lấy state và hàm từ context
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout(); // Gọi hàm logout từ context
        window.location.href = '/login';
    };

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <header className="sticky-top shadow-sm bg-white">
            <div className="border-bottom py-2">
                <div className="container d-flex justify-content-between align-items-center">
                    <Link className="navbar-brand fw-bold fs-4" to="/">SHOPII</Link>
                    <nav className="d-none d-lg-flex gap-4">
                        <Link className="nav-link text-gray-600 hover:text-blue-600" to="/">Home</Link>
                        <a className="nav-link text-gray-600 hover:text-blue-600" href="#">Shop</a>
                        <a className="nav-link text-gray-600 hover:text-blue-600" href="#">About</a>
                        <a className="nav-link text-gray-600 hover:text-blue-600" href="#">Contact</a>
                        <a className="nav-link text-gray-600 hover:text-blue-600" href="#">Journal</a>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        {currentUser ? (
                            <>
                                <span className="text-sm">Hello, {currentUser.fullname}</span>
                                {currentUser.role === 'buyer' && (
                                    <Link to="/become-seller" className="btn btn-outline-success btn-sm">Become a Seller</Link>
                                )}
                                <button onClick={handleLogout} className="btn btn-primary btn-sm">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-primary btn-sm">Sign In</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-white py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="fw-bold fs-3 text-primary">SHOPPING ONLINE</div>
                    <div className="flex-grow-1 mx-5">{/* Search bar */}</div>
                    <div className="d-flex align-items-center gap-4">
                        <a href="#" className="nav-link d-flex align-items-center gap-2"><MessageCircle /> <span className="d-none d-lg-inline">Chat</span></a>
                        <div className="position-relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="nav-link d-flex align-items-center gap-2 btn btn-link">
                                <User /> <span className="d-none d-lg-inline">Account</span>
                            </button>
                            {dropdownOpen && currentUser && (
                                <div className="dropdown-menu d-block position-absolute end-0 shadow-lg border-0" style={{ marginTop: '0.5rem' }}>
                                    <Link to="/order-history" className="dropdown-item d-flex align-items-center"><Clock size={16} className="me-2" /> Order History</Link>
                                    <Link to="/profile" className="dropdown-item d-flex align-items-center"><User size={16} className="me-2" /> Profile</Link>
                                    <Link to="/addresses" className="dropdown-item d-flex align-items-center"><HomeIcon size={16} className="me-2" /> Addresses</Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item d-flex align-items-center text-danger"><LogOut size={16} className="me-2" /> Logout</button>
                                </div>
                            )}
                        </div>
                        <Link to="/cart" className="nav-link d-flex align-items-center gap-2 position-relative">
                            <ShoppingCart /> 
                            <span className="d-none d-lg-inline">Cart</span>
                            {itemCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{itemCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavHome;
