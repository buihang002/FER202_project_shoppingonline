import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Container, Alert, Row, Col, InputGroup } from "react-bootstrap";

const API_URL = "http://localhost:9999/users";

const initialForm = {
  id: null,
  username: "",
  fullname: "",
  email: "",
  password: "",
  role: "",
  avatarURL: "",
  action: "unlock",
  createdAt: "",
  updatedAt: "",
};

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null); // "create" | "details"
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterAction, setFilterAction] = useState("all");

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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.username || !form.fullname || !form.email || !form.password || !form.role) {
      return "Vui lòng nhập đầy đủ thông tin bắt buộc.";
    }
    const duplicate = users.find(
      (u) =>
        (u.username === form.username ||
          u.fullname === form.fullname ||
          u.email === form.email ||
          u.avatarURL === form.avatarURL) &&
        u.id !== form.id
    );
    if (duplicate) return "Thông tin bị trùng với người dùng khác.";
    return "";
  };

  const handleCreate = async () => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    const now = new Date().toISOString();
    const generatedId =
      form.id ?? (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());

    const newUser = { ...form, id: generatedId, createdAt: now, updatedAt: now, action: form.action || "unlock" };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Create user error:", err);
    }
  };

  const handleUpdate = async () => {
    if (!form.id) return;
    const payload = { ...form, updatedAt: new Date().toISOString() };
    try {
      await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Update user error:", err);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await fetch(`${API_URL}/${form.id}`, { method: "DELETE" });
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchText.toLowerCase()) ||
      u.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesAction = filterAction === "all" || u.action === filterAction;
    return matchesSearch && matchesRole && matchesAction;
  });

  return (
    <Container className="mt-1">
      <h2 className="mb-4 text-primary">Account Management</h2>

      <Row className="mb-4 g-3 align-items-center">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by username, fullname, email..."
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
          <Form.Select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="all">All Actions</option>
            <option value="unlock">Unlock</option>
            <option value="lock">Lock</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button className="w-100" variant="primary" onClick={openAddModal}>
            + Add User
          </Button>
        </Col>
      </Row>

      <Table bordered hover responsive className="shadow-sm bg-white rounded">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, idx) => (
            <tr key={u.id}>
              <td>{idx + 1}</td>
              <td>{u.username}</td>
              <td>{u.fullname}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${u.role === "admin" ? "bg-danger" : u.role === "seller" ? "bg-warning" : "bg-success"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                <span className={u.action === "unlock" ? "text-success fw-bold" : "text-danger fw-bold"}>
                  {u.action}
                </span>
              </td>
              <td>
                <Button variant="outline-secondary" size="sm" onClick={() => openDetailsModal(u)}>
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isCreate ? "Thêm User mới" : isEdit ? "Chỉnh sửa User" : "Chi tiết User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={form.username} onChange={handleChange} disabled={!isCreate} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fullname</Form.Label>
                  <Form.Control type="text" name="fullname" value={form.fullname} onChange={handleChange} disabled={isView} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} disabled={!isCreate} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  {isCreate ? (
                    <Form.Select name="role" value={form.role} onChange={handleChange}>
                      <option value="">-- Chọn role --</option>
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                      <option value="buyer">Buyer</option>
                    </Form.Select>
                  ) : (
                    <Form.Control type="text" value={form.role} disabled />
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* <Row className="mb-3">
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Avatar URL</Form.Label>
                  <Form.Control type="text" name="avatarURL" value={form.avatarURL} onChange={handleChange} disabled={isView} />
                </Form.Group>
              </Col>
            </Row> */}

            <Form.Group className="mb-3">
              <Form.Label>Action</Form.Label>
              <Form.Select name="action" value={form.action} onChange={handleChange} disabled={isView}>
                <option value="unlock">Unlock</option>
                <option value="lock">Lock</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isCreate ? (
            <>
              <Button variant="secondary" onClick={closeModal}>
                Hủy
              </Button>
              <Button variant="success" onClick={handleCreate}>
                Thêm mới
              </Button>
            </>
          ) : isView ? (
            <>
              <Button variant="warning" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={closeModal}>
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Hủy chỉnh sửa
              </Button>
              <Button variant="warning" onClick={handleUpdate}>
                Lưu thay đổi
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageAccount;
