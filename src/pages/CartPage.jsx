import React from 'react';
import { useCart } from '../context/CartContext';
import NavHome from '../components/Home/NavHome';
import Footer from '../components/Home/Footer';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

// Component con cho từng sản phẩm trong giỏ hàng
const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart, toggleItemSelected, selectedItems } = useCart();

    return (
        <div className="card mb-3 border-0 border-bottom rounded-0">
            <div className="card-body d-flex align-items-center">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelected(item.id)}
                    />
                </div>
                <img src={item.image} alt={item.title} className="img-fluid rounded mx-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{item.title}</h6>
                    <p className="small text-muted mb-1">Unit Price: ${item.price.toFixed(2)}</p>
                    <p className="small text-muted mb-0">Available: 99 in stock</p>
                </div>
                <div className="d-flex align-items-center">
                    <div className="input-group" style={{ width: '120px' }}>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <input type="text" className="form-control form-control-sm text-center" value={item.quantity} readOnly />
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <h6 className="fw-bold text-primary mx-4" style={{ width: '100px', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</h6>
                    <button className="btn btn-link text-danger" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component chính của trang giỏ hàng
const CartPage = () => {
    const { cartDetails, loading, toggleSelectAll, isAllSelected, clearCart, orderSummary } = useCart();

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <div className="d-flex align-items-center mb-4">
                    <ShoppingCart className="text-primary me-2" />
                    <h1 className="fw-bold mb-0">Shopping Cart</h1>
                </div>
                
                <div className="row g-4">
                    {/* Cột bên trái: Danh sách sản phẩm */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="selectAll"
                                        checked={isAllSelected}
                                        onChange={toggleSelectAll}
                                    />
                                    <label className="form-check-label" htmlFor="selectAll">
                                        Select All ({cartDetails.length} items)
                                    </label>
                                </div>
                                <button className="btn btn-link text-danger" onClick={clearCart}>
                                    <Trash2 size={16} className="me-1" /> CLEAR CART
                                </button>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center"><div className="spinner-border" /></div>
                                ) : cartDetails.length === 0 ? (
                                    <div className="text-center p-5">
                                        <p>Your cart is empty.</p>
                                        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                                    </div>
                                ) : (
                                    cartDetails.map(item => <CartItem key={item.id} item={item} />)
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cột bên phải: Tóm tắt đơn hàng */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 position-sticky" style={{ top: '8rem' }}>
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-4">Order Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Selected Items:</span>
                                    <span>{orderSummary.selectedCount}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Subtotal:</span>
                                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold fs-5 my-3">
                                    <span>Total:</span>
                                    <span className="text-primary">${orderSummary.total.toFixed(2)}</span>
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-primary btn-lg" disabled={orderSummary.selectedCount === 0}>
                                        PROCEED TO CHECKOUT <ArrowRight size={16} />
                                    </button>
                                </div>
                                <div className="text-center mt-3">
                                    <Link to="/" className="btn btn-link text-primary">
                                        <ArrowLeft size={16} /> CONTINUE SHOPPING
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
