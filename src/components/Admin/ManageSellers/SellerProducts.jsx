import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Image,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SellerProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sellerRes, prodRes, invRes, orderItemRes, reviewRes] =
        await Promise.all([
          axios.get(`http://localhost:9999/users/${id}`),
          axios.get(`http://localhost:9999/products?sellerId=${id}`),
          axios.get("http://localhost:9999/inventories"),
          axios.get("http://localhost:9999/orderItems"),
          axios.get("http://localhost:9999/reviews"),
        ]);

      setSeller(sellerRes.data);
      setProducts(prodRes.data);
      setInventories(invRes.data);
      setOrderItems(orderItemRes.data);
      setReviews(reviewRes.data);

      computeStats(prodRes.data, invRes.data, orderItemRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (products, inventories, orderItems) => {
    const totalProducts = products.length;

    const totalStock = inventories
      .filter((inv) => products.some((p) => p.id === inv.productId))
      .reduce((sum, inv) => sum + inv.quantity, 0);

    const relatedOrderItems = orderItems.filter((oi) =>
      products.some((p) => p.id === oi.productId)
    );
    const totalOrders = relatedOrderItems.length;

    const totalRevenue = relatedOrderItems.reduce(
      (sum, oi) => sum + oi.quantity * oi.unitPrice,
      0
    );

    setStats({ totalProducts, totalStock, totalOrders, totalRevenue });
  };

  const getAverageRating = (productId) => {
    const rvs = reviews.filter((r) => r.productId === productId);
    if (rvs.length === 0) return 0;
    const sum = rvs.reduce((s, r) => s + r.rating, 0);
    return (sum / rvs.length).toFixed(1);
  };

  const revenueByProduct = products.map((p) => {
    const relatedItems = orderItems.filter((oi) => oi.productId === p.id);
    const revenue = relatedItems.reduce(
      (sum, oi) => sum + oi.quantity * oi.unitPrice,
      0
    );
    return { name: p.title, revenue };
  });

  return (
    <Container className="">
      {loading ? (
        <div className="text-center ">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* Back Button */}
          <Button
            variant="secondary"
            className="mb-3"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>

          {/* Seller Info */}
          {seller && (
            <Card className="mb-4 shadow-sm border-0">
              <Card.Body>
                <Row>
                  <Col>
                    <h5 className="mb-1">{seller.fullname}</h5>
                    <p className="mb-1 text-muted">{seller.email}</p>
                    <small className="text-muted">
                      Role: {seller.role} | Status: {seller.status}
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Nếu tài khoản pending, chỉ hiển thị cảnh báo */}
          {seller?.status === "pending" ? (
            <Alert variant="warning" className="text-center shadow-sm">
              Seller's account needs to be approved <br />
              <Link to="/admin/pending-seller" className="btn btn-success">
                Go to Pending Seller page
              </Link>
            </Alert>
          ) : (
            <>
              {/* Stats Cards */}
              <Row className="mb-4 g-3">
                <Col sm={3}>
                  <Card className="shadow-sm border-0 text-center">
                    <Card.Body>
                      <h6 className="text-muted mb-1">Total Products</h6>
                      <h4>{stats.totalProducts}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={3}>
                  <Card className="shadow-sm border-0 text-center">
                    <Card.Body>
                      <h6 className="text-muted mb-1">Total Stock</h6>
                      <h4>{stats.totalStock}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={3}>
                  <Card className="shadow-sm border-0 text-center">
                    <Card.Body>
                      <h6 className="text-muted mb-1">Total Orders</h6>
                      <h4>{stats.totalOrders}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={3}>
                  <Card className="shadow-sm border-0 text-center">
                    <Card.Body>
                      <h6 className="text-muted mb-1">Revenue</h6>
                      <h4>${stats.totalRevenue.toLocaleString()}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Revenue Chart */}
              {products.length > 0 && (
                <Card className="mb-4 shadow-sm border-0">
                  <Card.Body>
                    <h6 className="mb-3">Revenue by Product</h6>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={revenueByProduct}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" hide />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#0d6efd" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              )}
              <h3 className="mb-3">Product</h3>
              {/* Product list */}
              {products.length === 0 ? (
                <Alert variant="info" className="text-center shadow-sm">
                  Seller has no products.
                </Alert>
              ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                  {products.map((p) => (
                    <Col key={p.id}>
                      <Card className="h-100 shadow-sm border-0">
                        <Card.Img
                          variant="top"
                          src={
                            p.image ||
                            "https://via.placeholder.com/300x180?text=No+Image"
                          }
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="fs-6 text-truncate">
                            {p.title}
                          </Card.Title>
                          <Card.Text className="text-muted small mb-1">
                            ${p.price} •{" "}
                            {new Date(p.createdAt).toLocaleDateString()}
                          </Card.Text>
                          <Card.Text className="small text-muted">
                            Avg Rating: {getAverageRating(p.id)} ⭐
                          </Card.Text>
                          <Button
                            variant="primary"
                            size="sm"
                            className="mt-auto"
                            onClick={() => navigate(`/admin/product/${p.id}`)}
                          >
                            Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SellerProducts;
