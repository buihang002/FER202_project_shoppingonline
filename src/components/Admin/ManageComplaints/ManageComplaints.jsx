import React, { useEffect, useState } from "react";
import { Container, Accordion, Button, InputGroup, FormControl } from "react-bootstrap";

const COMPLAINT_API = "http://localhost:9999/complaints";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch(COMPLAINT_API)
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error(err));
  }, []);

  const filteredComplaints = complaints.filter(c =>
    (c.productName || "").toLowerCase().includes(searchText.toLowerCase()) ||
    (c.raisedBy || "").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Quản lý Complaints</h3>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Tìm kiếm theo sản phẩm hoặc người khiếu nại..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </InputGroup>

      <Accordion defaultActiveKey="0">
        {filteredComplaints.map((c, index) => (
          <Accordion.Item eventKey={index.toString()} key={c.id}>
            <Accordion.Header>
              {c.productName || "Sản phẩm không rõ"} - {c.raisedBy || "Người khiếu nại không rõ"}
            </Accordion.Header>
            <Accordion.Body>
              <p><strong>ID khiếu nại:</strong> {c.id}</p>
              <p><strong>Mô tả:</strong> {c.description || "Không có mô tả"}</p>
              <p><strong>Trạng thái:</strong> {c.status || "pending"}</p>
              <Button variant="success" size="sm" className="me-2" onClick={() => alert("Duyệt")}>Duyệt</Button>
              <Button variant="danger" size="sm" onClick={() => alert("Từ chối")}>Từ chối</Button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default ComplaintManagement;
