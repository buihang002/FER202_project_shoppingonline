import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ManageProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    avatarURL: "",
  });

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:9999/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          username: data.username || "",
          fullname: data.fullname || "",
          email: data.email || "",
          avatarURL: data.avatarURL || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, avatarURL: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    fetch(`http://localhost:9999/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        ...form,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditMode(false);
        alert("Profile updated successfully!");
      })
      .catch(console.error);
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Profile</h2>

      <Row className="align-items-center mb-4">
        <Col md={4} className="text-center mb-3 mb-md-0">
          <img
            src={form.avatarURL || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="rounded"
            width="150"
            height="150"
            style={{ border: "3px solid #0dcaf0", objectFit: "cover" }}
          />
        </Col>
        <Col md={8}>
          <Form.Group controlId="formAvatarUpload">
            <Form.Label>Upload Avatar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              disabled={!editMode}
              onChange={handleAvatarChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6} className="mb-3">
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={form.username}
              disabled={!editMode}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Group controlId="formFullname">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={form.fullname}
              disabled={!editMode}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={form.email} disabled />
          </Form.Group>
        </Col>

        <Col md={6} className="mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control type="text" value={user.role} disabled />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2">
        {editMode ? (
          <>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </div>
    </Container>
  );
};

export default ManageProfile;
