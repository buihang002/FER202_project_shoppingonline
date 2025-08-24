// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Badge } from "react-bootstrap";

// const API_URL_COMPLAINTS = "http://localhost:9999/complaints";
// const API_URL_USERS = "http://localhost:9999/users";

// function ComplaintManagement() {
//   const [complaints, setComplaints] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [updatedResolution, setUpdatedResolution] = useState("");

//   // Fetch complaints + users song song
//   useEffect(() => {
//     Promise.all([
//       fetch(API_URL_COMPLAINTS).then((res) => res.json()),
//       fetch(API_URL_USERS).then((res) => res.json()),
//     ])
//       .then(([complaintsData, usersData]) => {
//         setComplaints(complaintsData);
//         setUsers(usersData);
//       })
//       .catch((err) => console.error("Error fetching data:", err));
//   }, []);

//   // Tìm tên user từ ID
//   const getUserName = (userId) => {
//     const user = users.find((u) => u.id === userId);
//     return user ? user.fullname || user.username : "Unknown User";
//   };

//   // Open modal
//   const handleOpen = (complaint) => {
//     setSelectedComplaint(complaint);
//     setUpdatedResolution(complaint.resolution || "");
//     setShowModal(true);
//   };

//   // Close modal
//   const handleClose = () => {
//     setSelectedComplaint(null);
//     setShowModal(false);
//   };

//   // Update complaint
//   const handleUpdate = () => {
//     if (!selectedComplaint) return;

//     const updatedComplaint = {
//       ...selectedComplaint,
//       resolution: updatedResolution,
//       status: "resolved",
//       updatedAt: new Date().toISOString(),
//     };

//     fetch(`${API_URL_COMPLAINTS}/${selectedComplaint.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedComplaint),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setComplaints((prev) =>
//           prev.map((c) => (c.id === data.id ? data : c))
//         );
//         handleClose();
//       })
//       .catch((err) => console.error("Error updating complaint:", err));
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">Complaint Management</h2>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Raised By</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>Created At</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {complaints.length > 0 ? (
//             complaints.map((c, index) => (
//               <tr key={c.id}>
//                 <td>{index + 1}</td>
//                 <td>{getUserName(c.raisedBy)}</td>
//                 <td>{c.description}</td>
//                 <td>
//                   <Badge
//                     bg={
//                       c.status === "resolved"
//                         ? "success"
//                         : c.status === "pending"
//                         ? "warning"
//                         : "secondary"
//                     }
//                   >
//                     {c.status}
//                   </Badge>
//                 </td>
//                 <td>{new Date(c.createdAt).toLocaleDateString()}</td>
//                 <td>
//                   <Button
//                     variant="info"
//                     size="sm"
//                     onClick={() => handleOpen(c)}
//                   >
//                     View / Update
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center">
//                 No complaints found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       {/* Modal View/Update */}
//       <Modal show={showModal} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Complaint Details</Modal.Title>
//         </Modal.Header>
//         {selectedComplaint && (
//           <Modal.Body>
//             <p>
//               <strong>Raised By:</strong>{" "}
//               {getUserName(selectedComplaint.raisedBy)}
//             </p>
//             <p>
//               <strong>Description:</strong> {selectedComplaint.description}
//             </p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <Badge
//                 bg={
//                   selectedComplaint.status === "resolved"
//                     ? "success"
//                     : "warning"
//                 }
//               >
//                 {selectedComplaint.status}
//               </Badge>
//             </p>
//             <Form.Group className="mt-3">
//               <Form.Label>Resolution</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={updatedResolution}
//                 onChange={(e) => setUpdatedResolution(e.target.value)}
//                 placeholder="Enter resolution..."
//               />
//             </Form.Group>
//           </Modal.Body>
//         )}
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdate}>
//             Save Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default ComplaintManagement;
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";

const API_URL_COMPLAINTS = "http://localhost:9999/complaints";
const API_URL_USERS = "http://localhost:9999/users";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu complaints + users
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

  // Map ID sang tên user
  const getUserName = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.fullname || user.username : "Unknown User";
  };

  // Lọc complaints theo status
  const filteredComplaints =
    filterStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  // Mở popup
  const handleOpenModal = (complaint) => {
    setSelectedComplaint({ ...complaint });
    setShowModal(true);
  };

  // Đóng popup
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  // Update complaint
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

  // Hiển thị badge theo trạng thái
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

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📋 Complaints Management</h2>

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
              <td>{getUserName(c.raisedBy)}</td> {/* 👈 Hiển thị tên thay vì ID */}
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

      {/* Popup Complaint */}
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
