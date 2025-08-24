import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, InputGroup, FormControl } from "react-bootstrap";

const REVIEW_API = "http://localhost:9999/reviews";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch(REVIEW_API)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  const handleView = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleUpdateStatus = (id, status) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
    setShowModal(false);
  };

  const filteredReviews = reviews.filter(r =>
    (r.raisedBy || "").toLowerCase().includes(searchText.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Quản lý Review</h3>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Tìm kiếm theo người đánh giá hoặc mô tả..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </InputGroup>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredReviews.map(review => (
          <Col key={review.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{review.raisedBy || "Không rõ"}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Order Item ID: {review.orderItemId || "N/A"}
                </Card.Subtitle>
                <Card.Text>{review.description || "Không có mô tả"}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <span className={`badge ${
                  review.status === "approved" ? "bg-success" :
                  review.status === "rejected" ? "bg-danger" : "bg-warning text-dark"
                }`}>
                  {review.status || "pending"}
                </span>
                <Button variant="primary" size="sm" onClick={() => handleView(review)}>Chi tiết</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <>
              <p><strong>ID:</strong> {selectedReview.id}</p>
              <p><strong>Người đánh giá:</strong> {selectedReview.raisedBy || "Không rõ"}</p>
              <p><strong>Order Item:</strong> {selectedReview.orderItemId || "N/A"}</p>
              <p><strong>Mô tả:</strong> {selectedReview.description || "Không có mô tả"}</p>
              <p><strong>Trạng thái:</strong> {selectedReview.status || "pending"}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handleUpdateStatus(selectedReview.id, "approved")}>Duyệt</Button>
          <Button variant="danger" onClick={() => handleUpdateStatus(selectedReview.id, "rejected")}>Từ chối</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReviewManagement;
