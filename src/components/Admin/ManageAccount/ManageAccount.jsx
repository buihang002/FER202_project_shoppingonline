import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Alert,
  Row,
  Col,
  InputGroup,
  Card,
} from "react-bootstrap";
import { FiSearch } from "react-icons/fi";

const API_URL = "http://localhost:9999/users";

const initialForm = {
  id: null,
  username: "",
  fullname: "",
  email: "",
  password: "",
  role: "",
  avatarURL: "",
  status: "",
  action: "inactive",
  createdAt: "",
  updatedAt: "",
};

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [alertMsg, setAlertMsg] = useState({ type: "", text: "", time: "2" });
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [emailError, setEmailError] = useState("");

  const isCreate = modalMode === "create";
  const isView = modalMode === "details" && !isEditing;
  const isEdit = modalMode === "details" && isEditing;

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setForm({ ...initialForm });
    setModalMode("create");
    setIsEditing(false);
    setError("");
    setShowModal(true);
  };

  const openDetailsModal = (user) => {
    setForm({ ...user, password: "" });
    setModalMode("details");
    setIsEditing(false);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setModalMode(null);
    setForm({ ...initialForm });
    setError("");
    setEmailError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      if (!value.trim()) setEmailError("Email cannot be empty.");
      else if (!/\S+@\S+\.\S+/.test(value)) setEmailError("Invalid email format.");
      else {
        const isDuplicate = users.some(
          (u) => u.email.toLowerCase() === value.toLowerCase() && u.id !== form.id
        );
        setEmailError(isDuplicate ? "Email already exists." : "");
      }
    }
  };

  const validateForm = () => {
    if (!form.fullname.trim()) return "Fullname cannot be empty.";
    if (!form.email.trim()) return "Email cannot be empty.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format.";
    const isDuplicate = users.some(
      (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== form.id
    );
    if (isDuplicate) return "Email already exists.";
    if (isCreate && !form.password.trim()) return "Password cannot be empty.";
    if (isCreate && form.password.length < 6) return "Password must be at least 6 characters.";
    if (!form.role) return "Please select a role.";
    return "";
  };

  const handleCreate = async () => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    if (emailError) {
      setError(emailError);
      return;
    }

    const now = new Date().toISOString();
    const generatedId =
      form.id ??
      (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());

    let status = "pending";
    let action = "inactive";
    if (form.role === "buyer" || form.role === "admin") {
      status = "approved";
      action = "active";
    }

    const newUser = {
      ...form,
      id: generatedId,
      createdAt: now,
      updatedAt: now,
      status,
      action,
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      setAlertMsg({ type: "success", text: "User added successfully!" });
      closeModal();
      fetchUsers();
    } catch (err) {
      setAlertMsg({ type: "danger", text: "Error while adding user." });
      console.error("Create user error:", err);
    }
  };

  const handleUpdate = async () => {
    if (!form.id) return;
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    if (emailError) {
      setError(emailError);
      return;
    }

    const payload = { ...form, updatedAt: new Date().toISOString() };
    if (payload.role === "seller" && payload.status === "pending") {
      payload.action = "inactive";
    }

    try {
      await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setAlertMsg({ type: "success", text: "User updated successfully!" });
      closeModal();
      fetchUsers();
    } catch (err) {
      setAlertMsg({ type: "danger", text: "Error while updating user." });
      console.error("Update user error:", err);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${API_URL}/${form.id}`, { method: "DELETE" });
      setAlertMsg({ type: "warning", text: "User deleted." });
      closeModal();
      fetchUsers();
    } catch (err) {
      setAlertMsg({ type: "danger", text: "Error while deleting user." });
      console.error("Delete user error:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalSellers = users.filter((u) => u.role === "seller").length;
  const totalBuyers = users.filter((u) => u.role === "buyer").length;
  const activeUsers = users.filter((u) => u.action === "active").length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const approvedUsers = users.filter((u) => u.status === "approved").length;
  const rejectedUsers = users.filter((u) => u.status === "rejected").length;

  return (
    <Container className="position-relative">
      <h2 className="mb-3 fw-bold">Account Management</h2>

      {alertMsg.text && (
        <Alert
          variant={alertMsg.type}
          onClose={() => setAlertMsg({ type: "", text: "" })}
          dismissible
          className="position-absolute top-0 end-0 m-3 shadow"
          style={{ zIndex: 9999, minWidth: "250px" }}
        >
          {alertMsg.text}
        </Alert>
      )}

      {/* Statistics cards */}
      <Row className="mb-4 g-3">
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Active Users</Card.Title>
              <Card.Text>{activeUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Pending</Card.Title>
              <Card.Text>{pendingUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Approved</Card.Title>
              <Card.Text>{approvedUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Rejected</Card.Title>
              <Card.Text>{rejectedUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search + Filters */}
      <Row className="mb-4 g-3 align-items-center">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by fullname, email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button className="w-100" variant="primary" onClick={openAddModal}>
            + Add User
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table bordered hover responsive className="shadow-sm bg-white rounded text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, idx) => (
            <tr key={u.id}>
              <td>{idx + 1}</td>
              <td>
                <img
                  src={u.avatarURL || "https://via.placeholder.com/40"}
                  alt="avatar"
                  width="40"
                  height="40"
                  className="rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              </td>
              <td>{u.fullname}</td>
              <td>{u.email}</td>
              <td>
                <span
                  className={`badge ${
                    u.role === "admin"
                      ? "bg-danger"
                      : u.role === "seller"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    u.status === "pending"
                      ? "bg-warning text-dark"
                      : u.status === "approved"
                      ? "bg-info"
                      : "bg-danger"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    u.action === "active" ? "bg-success" : "bg-warning text-dark"
                  }`}
                >
                  {u.action}
                </span>
              </td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => openDetailsModal(u)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isCreate ? "Add User" : isView ? "View User" : isEdit ? "Edit User" : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                disabled={isView}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setForm((prev) => ({ ...prev, avatarURL: reader.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Form.Group>
            {form.avatarURL && (
              <div className="mb-3 text-center">
                <img
                  src={form.avatarURL}
                  alt="avatar preview"
                  width="80"
                  height="80"
                  className="rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                disabled={isView}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={isView}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>
            {isCreate && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={form.role} onChange={handleChange} disabled={isView}>
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </Form.Select>
            </Form.Group>
            {!isCreate && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange} disabled={isView}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Action</Form.Label>
                  <Form.Select
                    name="action"
                    value={form.action}
                    onChange={handleChange}
                    disabled={isView || (form.role === "seller" && form.status === "pending")}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isView && <Button variant="warning" onClick={() => setIsEditing(true)}>Edit</Button>}
          {isEdit && <Button variant="primary" onClick={handleUpdate}>Save</Button>}
          {isCreate && <Button variant="success" onClick={handleCreate}>Add</Button>}
          {!isCreate && <Button variant="danger" onClick={handleDelete}>Delete</Button>}
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageAccount;
