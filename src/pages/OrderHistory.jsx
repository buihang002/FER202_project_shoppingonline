import React, { useState, useEffect } from 'react';
import NavHome from '../components/Home/NavHome';
import Footer from '../components/Home/Footer';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, Info, XCircle } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const fetchOrders = async () => {
        if (!currentUser) {
            setLoading(false);
            setError("Please log in to view your order history.");
            return;
        }
        try {
            const ordersRes = await fetch(`http://localhost:9999/orders?buyerId=${currentUser.id}`);
            if (!ordersRes.ok) throw new Error("Failed to fetch orders.");
            const ordersData = await ordersRes.json();

            const ordersWithDetails = await Promise.all(
                ordersData.map(async (order) => {
                    const itemsRes = await fetch(`http://localhost:9999/orderItems?orderId=${order.id}`);
                    const itemsData = await itemsRes.json();
                    
                    const itemsWithProductInfo = await Promise.all(
                        itemsData.map(async (item) => {
                            const productRes = await fetch(`http://localhost:9999/products/${item.productId}`);
                            const productData = await productRes.json();
                            return { ...item, product: productData };
                        })
                    );
                    return { ...order, items: itemsWithProductInfo };
                })
            );
            
            setOrders(ordersWithDetails.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                const response = await fetch(`http://localhost:9999/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' })
                });
                if (!response.ok) throw new Error('Failed to cancel order.');
                // Tải lại danh sách đơn hàng để cập nhật trạng thái
                fetchOrders();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-warning text-dark';
            case 'confirmed': return 'bg-info text-dark';
            case 'shipped': return 'bg-primary';
            case 'delivered': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <h1 className="fw-bold mb-4">Order History</h1>
                {loading && <div className="text-center p-5"><div className="spinner-border text-primary" /></div>}
                {error && <div className="alert alert-danger">{error}</div>}
                
                {!loading && !error && (
                    orders.length > 0 ? (
                        orders.map(order => (
                            <div className="card shadow-sm border-0 mb-4" key={order.id}>
                                <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
                                    <div className="d-flex align-items-center me-3 mb-2 mb-md-0">
                                        <Package size={18} className="me-2 text-muted" />
                                        <span className="fw-bold">Order #{order.id}</span>
                                    </div>
                                    <div className="d-flex align-items-center me-3 mb-2 mb-md-0">
                                        <Calendar size={18} className="me-2 text-muted" />
                                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex align-items-center me-3 mb-2 mb-md-0">
                                        <DollarSign size={18} className="me-2 text-muted" />
                                        <span className="fw-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Info size={18} className="me-2 text-muted" />
                                        <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {order.items.map(item => (
                                        <div key={item.id} className="d-flex align-items-center mb-3">
                                            <img src={item.product.image} alt={item.product.title} className="rounded" width="60" height="60" style={{ objectFit: 'cover' }} />
                                            <div className="ms-3 flex-grow-1">
                                                <p className="fw-bold mb-0">{item.product.title}</p>
                                                <p className="text-muted small mb-0">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="fw-bold mb-0">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                {order.status === 'pending' && (
                                    <div className="card-footer bg-white text-end">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelOrder(order.id)}>
                                            <XCircle size={16} className="me-1" /> Cancel Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center p-5">
                                <p>You have no orders yet.</p>
                                <Link to="/" className="btn btn-primary">Start Shopping</Link>
                            </div>
                        </div>
                    )
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrderHistory;
