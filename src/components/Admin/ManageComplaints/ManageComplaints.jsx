import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Badge, Spinner, Row, Col, Card } from "react-bootstrap";

const API_URL_COMPLAINTS = "http://localhost:9999/complaints";
const API_URL_USERS = "http://localhost:9999/users";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(API_URL_COMPLAINTS).then((res) => res.json()),
      fetch(API_URL_USERS).then((res) => res.json()),
    ])
      .then(([complaintsData, usersData]) => {
        setComplaints(complaintsData);
        setUsers(usersData);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const getUserName = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.fullname || user.username : "Unknown User";
  };

  const filteredComplaints =
    filterStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const handleOpenModal = (complaint) => {
    setSelectedComplaint({ ...complaint });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const handleUpdateComplaint = () => {
    fetch(`${API_URL_COMPLAINTS}/${selectedComplaint.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedComplaint),
    })
      .then((res) => res.json())
      .then((updated) => {
        setComplaints((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        handleCloseModal();
      })
      .catch((err) => console.error("Error updating complaint:", err));
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "resolved":
        return <Badge bg="success">Resolved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Thống kê số liệu
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const rejectedCount = complaints.filter((c) => c.status === "rejected").length;

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <div className="container ">
      <h2 className="mb-3 fw-bold">Complaints Management</h2>

      {/* Thống kê card */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Complaints</Card.Title>
              <Card.Text className="fs-3 fw-bold">{totalComplaints}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Pending</Card.Title>
              <Card.Text className="fs-3 fw-bold text-warning">{pendingCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Resolved</Card.Title>
              <Card.Text className="fs-3 fw-bold text-success">{resolvedCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Rejected</Card.Title>
              <Card.Text className="fs-3 fw-bold text-danger">{rejectedCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc trạng thái */}
      <div className="mb-3 d-flex justify-content-between">
        <Form.Select
          style={{ width: "200px" }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </Form.Select>
      </div>

      {/* Bảng complaints */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Raised By</th>
            <th>Description</th>
            <th>Status</th>
            <th>Resolution</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td>{getUserName(c.raisedBy)}</td>
              <td>{c.description}</td>
              <td>{renderStatusBadge(c.status)}</td>
              <td>{c.resolution || "—"}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleOpenModal(c)}
                >
                  View / Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Complaint */}
      {selectedComplaint && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Complaint</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Raised By:</strong> {getUserName(selectedComplaint.raisedBy)}
            </p>
            <p>
              <strong>Description:</strong> {selectedComplaint.description}
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={selectedComplaint.status}
                onChange={(e) =>
                  setSelectedComplaint({
                    ...selectedComplaint,
                    status: e.target.value,
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Resolution</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter resolution details"
                value={selectedComplaint.resolution || ""}
                onChange={(e) =>
                  setSelectedComplaint({
                    ...selectedComplaint,
                    resolution: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleUpdateComplaint}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ComplaintPage;
