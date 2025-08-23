import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const PendingSellers = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc: mới nhất

  useEffect(() => {
    fetchPendingSellers();
  }, [sortOrder]);

  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/users?role=seller&status=pending");
      let data = res.data;

      // Sắp xếp theo ngày tạo
      data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );

      setPendingSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:9999/users/${id}`, { status: "approved" });
      fetchPendingSellers();
    } catch (error) {
      console.error("Error approving seller:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:9999/users/${id}`);
      fetchPendingSellers();
    } catch (error) {
      console.error("Error rejecting seller:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Pending Sellers</h2>

      {/* Thanh search và sort */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="secondary" onClick={fetchPendingSellers}>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Bảng hiển thị */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingSellers
            .filter(
              (seller) =>
                seller.fullname.toLowerCase().includes(search.toLowerCase()) ||
                seller.email.toLowerCase().includes(search.toLowerCase())
            )
            .map((seller, index) => (
              <tr key={seller.id}>
                <td>{index + 1}</td>
                <td>{seller.fullname}</td>
                <td>{seller.email}</td>
                <td>{new Date(seller.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleApprove(seller.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(seller.id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PendingSellers;
