import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tổng số người dùng
        const usersRes = await axios.get("http://localhost:9999/users");
        const productsRes = await axios.get("http://localhost:9999/products");
        const ordersRes = await axios.get("http://localhost:9999/orders");

        setStats({
          users: usersRes.data.users.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          revenue: ordersRes.data.reduce((total, order) => total + order.totalPrice, 0),
        });

        // 5 người dùng mới nhất
        setLatestUsers(usersRes.data.users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        );

        // 5 sản phẩm mới nhất
        setLatestProducts(productsRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        );

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const cards = [
    { title: "Users", value: stats.users, icon: <FiUsers size={24} />, bg: "#ffb3c1" },
    { title: "Products", value: stats.products, icon: <FiBox size={24} />, bg: "#a8dadc" },
    { title: "Orders", value: stats.orders, icon: <FiShoppingCart size={24} />, bg: "#ffe066" },
    { title: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: <FiDollarSign size={24} />, bg: "#b5ead7" },
  ];

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        {cards.map((card, idx) => (
          <Col md={3} key={idx}>
            <Card className="mb-3 shadow-sm" style={{ borderRadius: "12px", backgroundColor: card.bg }}>
              <Card.Body className="d-flex align-items-center">
                <div className="me-3">{card.icon}</div>
                <div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {card.value}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Quick Links</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Link to="/admin/account">Manage Accounts</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to="/admin/product">Manage Products</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to="/admin/orders">Manage Orders</Link>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Latest Users</Card.Title>
              <ListGroup variant="flush">
                {latestUsers.map((user) => (
                  <ListGroup.Item key={user.id}>{user.fullname}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Latest Products</Card.Title>
              <ListGroup variant="flush">
                {latestProducts.map((product) => (
                  <ListGroup.Item key={product.id}>{product.title}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
