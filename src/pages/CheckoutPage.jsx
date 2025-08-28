import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavHome from '../components/Home/NavHome';
import Footer from '../components/Home/Footer';
import { useCart } from '../context/CartContext';
import { Truck, CreditCard, Landmark, Wallet } from 'lucide-react';

const CheckoutPage = () => {
    const { orderSummary, cartDetails, selectedItems, clearCart } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    // Lấy currentUser một lần và lưu vào state để tránh re-render không cần thiết
    const [currentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!currentUser) {
                console.error("User not logged in.");
                return;
            }
            try {
                const res = await fetch(`http://localhost:9999/addresses?userId=${currentUser.id}`);
                const data = await res.json();
                setAddresses(data);
                
                const defaultAddress = data.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                } else if (data.length > 0) {
                    setSelectedAddressId(data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            }
        };
        fetchAddresses();
    }, [currentUser?.id]); // THAY ĐỔI Ở ĐÂY: Chỉ chạy lại khi ID người dùng thay đổi

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert('Please select a shipping address.');
            return;
        }

        const newOrder = {
            id: `order-${Date.now()}`,
            buyerId: currentUser.id,
            addressId: selectedAddressId,
            orderDate: new Date().toISOString(),
            totalPrice: orderSummary.total,
            status: 'pending',
            paymentMethod: paymentMethod
        };

        const newOrderItems = cartDetails
            .filter(item => selectedItems.includes(item.id))
            .map(item => ({
                id: `item-${item.id}-${Date.now()}`,
                orderId: newOrder.id,
                productId: item.id,
                status: 'pending',
                quantity: item.quantity,
                unitPrice: item.price
            }));

        try {
            await fetch('http://localhost:9999/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });

            await Promise.all(newOrderItems.map(item => 
                fetch('http://localhost:9999/orderItems', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                })
            ));

            clearCart(selectedItems.map(itemId => cartDetails.find(item => item.id === itemId)?.productId).filter(Boolean));
            alert('Order placed successfully!');
            navigate('/order-history');

        } catch (error) {
            console.error("Failed to place order:", error);
            alert('There was an error placing your order.');
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <h1 className="fw-bold mb-4">Checkout</h1>
                <div className="row g-5">
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-3"><Truck size={20} className="me-2" />Shipping Address</h5>
                                {addresses.length > 0 ? addresses.map(addr => (
                                    <div key={addr.id} className={`border p-3 rounded mb-2 ${selectedAddressId === addr.id ? 'border-primary border-2' : ''}`}>
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="shippingAddress" 
                                                id={`addr-${addr.id}`} 
                                                checked={selectedAddressId === addr.id}
                                                onChange={() => setSelectedAddressId(addr.id)}
                                            />
                                            <label className="form-check-label w-100" htmlFor={`addr-${addr.id}`}>
                                                <div className="d-flex justify-content-between">
                                                    <strong>{addr.fullName}</strong>
                                                    {addr.isDefault && <span className="badge bg-primary">Default</span>}
                                                </div>
                                                <p className="text-muted mb-0">{addr.phone}</p>
                                                <p className="text-muted mb-0">{`${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`}</p>
                                            </label>
                                        </div>
                                    </div>
                                )) : <p className="text-muted">No addresses found. Please add an address.</p>}
                                <Link to="/addresses" className="btn btn-outline-primary btn-sm mt-2">
                                    + Manage Addresses
                                </Link>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-3"><CreditCard size={20} className="me-2" />Payment Method</h5>
                                <div className="border p-3 rounded mb-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} />
                                        <label className="form-check-label" htmlFor="cod">
                                            <Wallet size={16} className="me-2" /> Thanh toán khi nhận hàng (COD)
                                        </label>
                                    </div>
                                </div>
                                <div className="border p-3 rounded">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="vnpay" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={e => setPaymentMethod(e.target.value)} />
                                        <label className="form-check-label" htmlFor="vnpay">
                                            <Landmark size={16} className="me-2" /> Thanh toán online qua VNPAY
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 position-sticky" style={{ top: '8rem' }}>
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-4">Order Summary</h5>
                                {cartDetails.filter(item => selectedItems.includes(item.id)).map(item => (
                                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} alt={item.title} className="rounded" width="60" />
                                            <div className="ms-3">
                                                <p className="fw-bold mb-0">{item.title}</p>
                                                <p className="text-muted small mb-0">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="fw-bold mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex justify-content-between my-2">
                                    <span className="text-muted">Subtotal:</span>
                                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold fs-5 my-3">
                                    <span>Total:</span>
                                    <span className="text-primary">${orderSummary.total.toFixed(2)}</span>
                                </div>
                                <div className="d-grid">
                                    <button onClick={handlePlaceOrder} className="btn btn-primary btn-lg" disabled={orderSummary.selectedCount === 0 || !selectedAddressId}>
                                        PLACE ORDER
                                    </button>
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

export default CheckoutPage;
