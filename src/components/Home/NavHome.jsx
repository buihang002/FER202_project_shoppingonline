import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, MessageCircle } from 'lucide-react';

const NavHome = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.location.reload();
    };

    return (
        // Sử dụng class 'sticky-top' của Bootstrap để giữ header luôn ở trên cùng
        <header className="sticky-top shadow-sm bg-white">
            {/* Top Bar */}
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
                                <a href="#" className="btn btn-outline-success btn-sm">Become a Seller</a>
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

            {/* Main Navigation */}
            <div className="bg-white py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="fw-bold fs-3 text-primary">Online Shopping</div>
                    <div className="flex-grow-1 mx-5">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search products..." />
                            <button className="btn btn-outline-secondary" type="button"><Search size={20} /></button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <a href="#" className="nav-link d-flex align-items-center gap-2">
                            <MessageCircle /> <span className="d-none d-lg-inline">Chat</span>
                        </a>
                        <a href="#" className="nav-link d-flex align-items-center gap-2">
                            <User /> <span className="d-none d-lg-inline">Account</span>
                        </a>
                        <a href="#" className="nav-link d-flex align-items-center gap-2">
                            <ShoppingCart /> <span className="d-none d-lg-inline">Cart</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavHome;
