import { useEffect, useState } from "react";
import {
    Table,
    Form,
    InputGroup,
    Card,
    Row,
    Col,
    Spinner,
} from "react-bootstrap";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InventoryReport() {
    const [inventories, setInventories] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // Lấy seller từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sellerId = currentUser?.id;

    useEffect(() => {
        if (!sellerId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Lọc products theo sellerId trước
                const [invenRes, prodRes] = await Promise.all([
                    axios.get("http://localhost:9999/inventories"),
                    axios.get(`http://localhost:9999/products?sellerId=${sellerId}`),
                ]);

                const sellerProducts = prodRes.data || [];
                const sellerProductIds = sellerProducts.map((p) => p.id);

                // Lọc tồn kho chỉ theo các product của seller hiện tại
                const sellerInventories = invenRes.data.filter((inv) =>
                    sellerProductIds.includes(inv.productId)
                );

                setInventories(sellerInventories);
                setProducts(sellerProducts);
            } catch (err) {
                console.error("Failed to fetch inventories or products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sellerId]);

    const getProductInfo = (productId) => {
        return products.find((p) => p.id === productId) || {};
    };

    // Filter theo search
    const filteredInventories = inventories.filter((inv) => {
        const product = getProductInfo(inv.productId);
        return product.title?.toLowerCase().includes(search.toLowerCase());
    });

    // Tính thống kê
    const totalProducts = filteredInventories.length;
    const totalQuantity = filteredInventories.reduce(
        (sum, inv) => sum + inv.quantity,
        0
    );
    const totalValue = filteredInventories.reduce((sum, inv) => {
        const product = getProductInfo(inv.productId);
        return sum + (product.price || 0) * inv.quantity;
    }, 0);
    const lowStockCount = filteredInventories.filter((inv) => inv.quantity < 10).length;

    // Dữ liệu biểu đồ top tồn kho cao nhất
    const sortedByQuantity = [...filteredInventories].sort(
        (a, b) => b.quantity - a.quantity
    );
    const topProducts = sortedByQuantity.slice(0, 5);
    const chartData = {
        labels: topProducts.map(
            (inv) => getProductInfo(inv.productId).title || "Unknown"
        ),
        datasets: [
            {
                label: "Số lượng tồn kho",
                data: topProducts.map((inv) => inv.quantity),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Inventory Report</h3>

            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "300px" }}
                >
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card className="p-3 shadow-sm text-center bg-light">
                                <h5>Total Products</h5>
                                <h4>{totalProducts}</h4>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="p-3 shadow-sm text-center bg-light">
                                <h5>Total Quantity</h5>
                                <h4>{totalQuantity}</h4>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="p-3 shadow-sm text-center bg-light">
                                <h5>Total Value</h5>
                                <h4>{totalValue.toLocaleString()} ₫</h4>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="p-3 shadow-sm text-center bg-light">
                                <h5>Low Stock Items</h5>
                                <h4 style={{ color: "red" }}>{lowStockCount}</h4>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="p-3 mb-4 shadow-sm">
                        <h5 className="mb-3">Top 5 Products with Highest Stock</h5>
                        <Bar data={chartData} />
                    </Card>

                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Search product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>

                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Image</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventories.length > 0 ? (
                                filteredInventories.map((inv, index) => {
                                    const product = getProductInfo(inv.productId);
                                    return (
                                        <tr key={inv.id}>
                                            <td>{index + 1}</td>
                                            <td>{product.title}</td>
                                            <td>
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            </td>
                                            <td>{product.price?.toLocaleString()} ₫</td>
                                            <td
                                                style={{
                                                    color:
                                                        inv.quantity === 0
                                                            ? "red"
                                                            : inv.quantity < 10
                                                                ? "orange"
                                                                : "green",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {inv.quantity}
                                            </td>
                                            <td>{new Date(inv.lastUpdated).toLocaleString()}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
}
