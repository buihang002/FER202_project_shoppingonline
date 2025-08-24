import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Table,
    Button,
    Badge,
    Spinner,
    Modal,
    Card,
} from "react-bootstrap";
import { CheckCircle, XCircle, EyeFill } from "react-bootstrap-icons";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sellerId = currentUser?.id;

    useEffect(() => {
        if (!sellerId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [orderRes, itemRes, prodRes] = await Promise.all([
                    axios.get("http://localhost:9999/orders"),
                    axios.get("http://localhost:9999/orderItems"),
                    axios.get(`http://localhost:9999/products?sellerId=${sellerId}`),
                ]);

                const sellerProducts = prodRes.data || [];
                const sellerProductIds = sellerProducts.map((p) => p.id);

                const sellerOrderItems = itemRes.data.filter((item) =>
                    sellerProductIds.includes(item.productId)
                );

                const sellerOrderIds = [
                    ...new Set(sellerOrderItems.map((item) => item.orderId)),
                ];

                const sellerOrders = orderRes.data.filter((order) =>
                    sellerOrderIds.includes(order.id)
                );

                setOrders(sellerOrders);
                setOrderItems(sellerOrderItems);
                setProducts(sellerProducts);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sellerId]);

    const getOrderItems = (orderId) => {
        return orderItems.filter((item) => item.orderId === orderId);
    };

    const getProductName = (productId) => {
        return products.find((p) => p.id === productId)?.title || "Unknown Product";
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return <Badge bg="success" pill>Confirmed</Badge>;
            case "shipped":
                return <Badge bg="info" pill>Shipped</Badge>;
            case "cancelled":
                return <Badge bg="danger" pill>Cancelled</Badge>;
            default:
                return <Badge bg="warning" pill>Pending</Badge>;
        }
    };

    const updateOrderItemStatus = async (itemId, status) => {
        let confirmMessage = "";

        if (status === "confirmed") {
            confirmMessage = "Are you sure you want to confirm this order item?";
        } else if (status === "cancelled") {
            confirmMessage = "Are you sure you want to cancel this order item?";
        }

        if (confirmMessage && !window.confirm(confirmMessage)) {
            return;
        }

        try {
            await axios.patch(`http://localhost:9999/orderItems/${itemId}`, { status });
            setOrderItems((prev) =>
                prev.map((item) =>
                    item.id === itemId ? { ...item, status } : item
                )
            );
        } catch (error) {
            console.error("Failed to update order item status", error);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container className="py-4">
            <h3 className="fw-bold mb-4">Manage Orders</h3>

            <Card className="shadow-sm rounded-4 border-0">
                <Card.Body>
                    <Table hover responsive bordered className="align-middle">
                        <thead className="table-dark text-center">
                            <tr>
                                <th style={{ width: "20%" }}>Order ID</th>
                                <th style={{ width: "25%" }}>Products</th>
                                <th style={{ width: "15%" }}>Order Date</th>
                                <th style={{ width: "10%" }}>Total Price</th>
                                <th style={{ width: "10%" }}>Status</th>
                                <th style={{ width: "20%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const items = getOrderItems(order.id);
                                    return (
                                        <tr key={order.id} className="text-center">
                                            <td className="fw-semibold">{order.id}</td>
                                            <td className="text-start">
                                                {items.map((item) => (
                                                    <div key={item.id}>
                                                        • {getProductName(item.productId)}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td className="fw-bold text-success">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td>
                                                {items.some(i => i.status === "confirmed")
                                                    ? getStatusBadge("confirmed")
                                                    : items.every(i => i.status === "cancelled")
                                                        ? getStatusBadge("cancelled")
                                                        : getStatusBadge("pending")
                                                }
                                            </td>
                                            <td className="d-flex justify-content-center gap-2">
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="d-flex align-items-center gap-1"
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                    <EyeFill /> View
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <h5 className="mb-3">Order ID: {selectedOrder.id}</h5>
                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(selectedOrder.orderDate).toLocaleString()}
                            </p>
                            <h6 className="mt-3">Products:</h6>
                            <Table striped bordered hover size="sm" className="mt-2">
                                <thead className="table-light">
                                    <tr className="text-center">
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Subtotal</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getOrderItems(selectedOrder.id).map((item) => (
                                        <tr key={item.id} className="text-center">
                                            <td>{getProductName(item.productId)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.unitPrice.toFixed(2)}</td>
                                            <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                                            <td>{getStatusBadge(item.status)}</td>
                                            <td className="d-flex justify-content-center gap-2">
                                                {item.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateOrderItemStatus(item.id, "confirmed")
                                                            }
                                                        >
                                                            <CheckCircle /> Confirm
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateOrderItemStatus(item.id, "cancelled")
                                                            }
                                                        >
                                                            <XCircle /> Cancel
                                                        </Button>
                                                    </>
                                                )}
                                                {item.status === "confirmed" && (
                                                    <span className="text-success fw-semibold">
                                                        Confirmed ✔
                                                    </span>
                                                )}
                                                {item.status === "cancelled" && (
                                                    <span className="text-danger fw-semibold">
                                                        Cancelled ✘
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
