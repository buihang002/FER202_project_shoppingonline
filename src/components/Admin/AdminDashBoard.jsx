import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Table, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiTag,
  FiMessageSquare,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    complaints: 0,
  });
  const [latestUsers, setLatestUsers] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes, paymentsRes, complaintsRes] = await Promise.all([
          axios.get("http://localhost:9999/users"),
          axios.get("http://localhost:9999/products"),
          axios.get("http://localhost:9999/orders"),
          axios.get("http://localhost:9999/payments"),
          axios.get("http://localhost:9999/complaints"),
        ]);

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          revenue: paymentsRes.data.reduce((sum, p) => sum + (p.amount || 0), 0),
          complaints: complaintsRes.data.length,
        });

        setLatestUsers(usersRes.data.slice(-5).reverse());

        // Lọc complaint có status = pending
        const pending = complaintsRes.data.filter((c) => c.status === "pending");
        setPendingComplaints(pending);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiUsers size={32} className="mb-2 text-primary" />
              <Card.Title>{stats.users}</Card.Title>
              <Card.Text>Total Users</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiBox size={32} className="mb-2 text-success" />
              <Card.Title>{stats.products}</Card.Title>
              <Card.Text>Total Products</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiShoppingCart size={32} className="mb-2 text-warning" />
              <Card.Title>{stats.orders}</Card.Title>
              <Card.Text>Total Orders</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiDollarSign size={32} className="mb-2 text-danger" />
              <Card.Title>${stats.revenue.toLocaleString()}</Card.Title>
              <Card.Text>Total Revenue</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiAlertCircle size={32} className="mb-2 text-secondary" />
              <Card.Title>{stats.complaints}</Card.Title>
              <Card.Text>Complaints</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Latest Users */}
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Latest 5 Users</Card.Title>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Links */}
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Quick Links</Card.Title>
              <ListGroup variant="flush" className="mt-2">
                <ListGroup.Item>
                  <FiUsers className="me-2" />
                  <Link to="/admin/account">Manage Accounts</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiBox className="me-2" />
                  <Link to="/admin/product">Manage Products</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiShoppingCart className="me-2" />
                  <Link to="/admin/orders">Manage Orders</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiTruck className="me-2" />
                  <Link to="/admin/inventory">Manage Inventory</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiTag className="me-2" />
                  <Link to="/admin/coupons">Manage Coupons</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiMessageSquare className="me-2" />
                  <Link to="/admin/complaints">View Complaints</Link>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Complaints */}
      <Row>
        <Col>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Pending Complaints</Card.Title>
              {pendingComplaints.length > 0 ? (
                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Raised By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingComplaints.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.description}</td>
                        <td>
                          <Badge bg="warning">{c.status}</Badge>
                        </td>
                        <td>{c.raisedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mt-2">No pending complaints 🎉</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
