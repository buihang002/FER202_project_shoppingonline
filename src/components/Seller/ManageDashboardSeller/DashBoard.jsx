import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Badge,
} from "react-bootstrap";

export default function DashboardOverview() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "" });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const sellerId = currentUser?.id;

  // Load store + orders + inventories
  useEffect(() => {
    if (!sellerId) return;

    axios
      .get(`http://localhost:9999/stores?sellerId=${sellerId}`)
      .then((res) => {
        if (res.data.length > 0) {
          const myStore = res.data[0];
          setStore(myStore);

          // Load orders + inventories
          axios.get("http://localhost:9999/orders").then((orderRes) => {
            setOrders(orderRes.data.filter((o) => o.storeId === myStore.id));
          });

          axios.get("http://localhost:9999/inventories").then((invRes) => {
            setInventories(invRes.data.filter((i) => i.storeId === myStore.id));
          });
        }
      })
      .catch((err) => console.error("Error loading store", err));
  }, [sellerId]);

  // Filter orders theo ngày
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (filters.from && filters.to) {
      const fromDate = new Date(filters.from);
      const toDate = new Date(filters.to);
      filtered = filtered.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= fromDate && d <= toDate;
      });
    }
    return filtered;
  }, [orders, filters]);

  // Tính toán thống kê
  const totalInventory = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  const pendingOrders = filteredOrders.filter((o) => o.status === "pending").length;
  const processedOrders = filteredOrders.filter((o) => o.status === "processed").length;
  const totalRevenue = filteredOrders
    .filter((o) => o.status === "processed")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <Container fluid className="py-4" style={{ background: "#f8f9fa" }}>
      <h3 className="mb-4">Dashboard Overview</h3>

      {/* Bộ lọc ngày */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label>From</Form.Label>
            <Form.Control
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label>To</Form.Label>
            <Form.Control
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Thống kê */}
      <Row className="g-4">
        <Col xs={12} md={6} lg={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center p-3">
            <Card.Body>
              <h5>Hàng tồn kho</h5>
              <h3>
                <Badge bg="secondary">{totalInventory}</Badge>
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center p-3">
            <Card.Body>
              <h5>Orders Pending</h5>
              <h3>
                <Badge bg="warning" text="dark">{pendingOrders}</Badge>
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center p-3">
            <Card.Body>
              <h5>Orders Processed</h5>
              <h3>
                <Badge bg="success">{processedOrders}</Badge>
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center p-3">
            <Card.Body>
              <h5>Tổng doanh thu</h5>
              <h3 className="text-success">${totalRevenue}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {!store && <p className="mt-4 text-muted">⏳ Loading store...</p>}
    </Container>
  );
}
