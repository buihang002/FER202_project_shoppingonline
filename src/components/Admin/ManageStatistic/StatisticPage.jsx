import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, Form, Row, Col } from "react-bootstrap";

const Statistic = () => {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [filterUsers, setFilterUsers] = useState({ start: "", end: "" });
  const [filterPayments, setFilterPayments] = useState({ start: "", end: "" });
  const [filterOrders, setFilterOrders] = useState({ start: "", end: "" });

  const [userChart, setUserChart] = useState([]);
  const [paymentChart, setPaymentChart] = useState([]);
  const [orderChart, setOrderChart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:9999/payments").then((res) => setPayments(res.data));
    axios.get("http://localhost:9999/orders").then((res) => setOrders(res.data));
    axios.get("http://localhost:9999/products").then((res) => setProducts(res.data));
  }, []);

  // --- Helper ---
  const groupByDate = (items, key = "createdAt", sumKey = null) => {
    const grouped = {};
    items.forEach((item) => {
      const date = new Date(item[key]);
      const label = date.toLocaleDateString("en-GB");
      const value = sumKey ? item[sumKey] || 0 : 1;
      grouped[label] = (grouped[label] || 0) + value;
    });
    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  };

  const filterByDate = (items, start, end, key = "createdAt") => {
    return items.filter((item) => {
      const date = new Date(item[key]);
      return (!start || date >= new Date(start)) && (!end || date <= new Date(end));
    });
  };

  useEffect(() => {
    setUserChart(groupByDate(filterByDate(users, filterUsers.start, filterUsers.end)));
    setPaymentChart(groupByDate(filterByDate(payments, filterPayments.start, filterPayments.end), "createdAt", "amount"));
    setOrderChart(groupByDate(filterByDate(orders, filterOrders.start, filterOrders.end)));
  }, [users, payments, orders, filterUsers, filterPayments, filterOrders]);

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Statistics Dashboard</h2>

      {/* Users */}
      <h4 className="mb-3">User Registrations</h4>
      <Card className="mb-4 p-3 shadow-sm">
        <Row className="mb-3">
          <Col md={4}>
            <Card className="p-3 mb-3">
              <h5>Total Users</h5>
              <h3 className="fw-bold">{filterByDate(users, filterUsers.start, filterUsers.end).length}</h3>
            </Card>
          </Col>
          <Col md={8}>
            <Form as={Row} className="align-items-end g-2">
              <Col xs="auto">
                <Form.Label>From</Form.Label>
                <Form.Control type="date" value={filterUsers.start} onChange={(e) => setFilterUsers({ ...filterUsers, start: e.target.value })} />
              </Col>
              <Col xs="auto">
                <Form.Label>To</Form.Label>
                <Form.Control type="date" value={filterUsers.end} onChange={(e) => setFilterUsers({ ...filterUsers, end: e.target.value })} />
              </Col>
            </Form>
          </Col>
        </Row>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={userChart}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2196f3" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Payments */}
      <h4 className="mb-3">Revenue</h4>
      <Card className="mb-4 p-3 shadow-sm">
        <Row className="mb-3">
          <Col md={4}>
            <Card className="p-3 mb-3">
              <h5>Total Revenue</h5>
              <h3 className="fw-bold">
                {filterByDate(payments, filterPayments.start, filterPayments.end).reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()} VND
              </h3>
            </Card>
          </Col>
          <Col md={8}>
            <Form as={Row} className="align-items-end g-2">
              <Col xs="auto">
                <Form.Label>From</Form.Label>
                <Form.Control type="date" value={filterPayments.start} onChange={(e) => setFilterPayments({ ...filterPayments, start: e.target.value })} />
              </Col>
              <Col xs="auto">
                <Form.Label>To</Form.Label>
                <Form.Control type="date" value={filterPayments.end} onChange={(e) => setFilterPayments({ ...filterPayments, end: e.target.value })} />
              </Col>
            </Form>
          </Col>
        </Row>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={paymentChart}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4caf50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders */}
      <h4 className="mb-3">Orders</h4>
      <Card className="mb-4 p-3 shadow-sm">
        <Row className="mb-3">
          <Col md={4}>
            <Card className="p-3 mb-3">
              <h5>Total Orders</h5>
              <h3 className="fw-bold">{filterByDate(orders, filterOrders.start, filterOrders.end).length}</h3>
            </Card>
          </Col>
          <Col md={8}>
            <Form as={Row} className="align-items-end g-2">
              <Col xs="auto">
                <Form.Label>From</Form.Label>
                <Form.Control type="date" value={filterOrders.start} onChange={(e) => setFilterOrders({ ...filterOrders, start: e.target.value })} />
              </Col>
              <Col xs="auto">
                <Form.Label>To</Form.Label>
                <Form.Control type="date" value={filterOrders.end} onChange={(e) => setFilterOrders({ ...filterOrders, end: e.target.value })} />
              </Col>
            </Form>
          </Col>
        </Row>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={orderChart}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#ff9800" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Statistic;
