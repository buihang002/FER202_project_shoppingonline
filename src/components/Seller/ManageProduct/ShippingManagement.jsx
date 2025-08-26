import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Badge, Spinner, Card } from "react-bootstrap";

export default function ShippingManagement() {
    const [orderItems, setOrderItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [shippings, setShippings] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sellerId = currentUser?.id;

    useEffect(() => {
        if (!sellerId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [itemRes, prodRes, shippingRes] = await Promise.all([
                    axios.get("http://localhost:9999/orderItems"),
                    axios.get(`http://localhost:9999/products?sellerId=${sellerId}`),
                    axios.get("http://localhost:9999/shippings"),
                ]);

                const sellerProducts = prodRes?.data || [];
                const sellerProductIds = sellerProducts.map((p) => p.id);

                // Lọc ra orderItems của seller
                const sellerOrderItems = itemRes.data.filter((item) =>
                    sellerProductIds.includes(item?.productId)
                );

                // Chỉ lấy những orderItems đã confirmed
                const confirmedItems = sellerOrderItems.filter(
                    (item) => item?.status === "confirmed"
                );

                setOrderItems(confirmedItems);
                setProducts(sellerProducts);
                setShippings(shippingRes.data || []);
            } catch (error) {
                console.error("Failed to fetch shipping data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sellerId]);

    const getProductName = (productId) => {
        return products.find((p) => p.id === productId)?.title || "Unknown Product";
    };

    const getShippingInfo = (orderItemId) => {
        return shippings.find((s) => s.orderItemId === orderItemId);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "shipped":
                return <Badge bg="success" pill>Shipped</Badge>;
            case "pending":
                return <Badge bg="warning" pill>Pending</Badge>;
            default:
                return <Badge bg="secondary" pill>Unknown</Badge>;
        }
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
            <h3 className="fw-bold mb-4">Shipping Management</h3>

            <Card className="shadow-sm rounded-4 border-0">
                <Card.Body>
                    <Table hover responsive bordered className="align-middle">
                        <thead className="table-dark text-center">
                            <tr>
                                <th style={{ width: "20%" }}>Order Item ID</th>
                                <th style={{ width: "25%" }}>Product</th>
                                <th style={{ width: "10%" }}>Quantity</th>
                                <th style={{ width: "15%" }}>Unit Price</th>
                                <th style={{ width: "20%" }}>Shipping Info</th>
                                <th style={{ width: "10%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No items ready for shipping
                                    </td>
                                </tr>
                            ) : (
                                orderItems.map((item) => {
                                    const shipping = getShippingInfo(item.orderId);
                                    return (
                                        <tr key={item.id} className="text-center">
                                            <td>{item.id}</td>
                                            <td className="text-start">
                                                {getProductName(item.productId)}
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>${item.unitPrice.toFixed(2)}</td>
                                            <td className="text-start">
                                                {shipping ? (
                                                    <>
                                                        <div><strong>Carrier:</strong> {shipping.carrier}</div>
                                                        <div><strong>Tracking:</strong> {shipping.trackingNumber}</div>
                                                        <div>
                                                            <strong>ETA:</strong>{" "}
                                                            {new Date(shipping.estimatedArrival).toLocaleDateString()}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-muted">Not Assigned</span>
                                                )}
                                            </td>
                                            <td>
                                                {getStatusBadge(shipping?.status || "pending")}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}
