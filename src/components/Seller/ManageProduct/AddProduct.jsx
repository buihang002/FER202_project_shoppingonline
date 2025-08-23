import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { uid } from "uid";

export default function CreateProduct({ onClose, onProductCreated, onCategoryCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    image: ""
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    axios
      .get("http://localhost:9999/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0 || price > 100000000) {
      newErrors.price = "Price must be a positive number under 100,000,000.";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category.";
    }

    if (!formData.image || !formData.image.trim()) {
      newErrors.image = "Image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Bạn cần đăng nhập để tạo sản phẩm!");
      return;
    }

    const newProduct = {
      id: uid(25),
      ...formData,
      price: parseFloat(formData.price),
      sellerId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await axios.post("http://localhost:9999/products", newProduct);
      alert("Product created successfully!");

      if (typeof onProductCreated === "function") {
        onProductCreated();
      }

      onClose();
    } catch (err) {
      console.error("Failed to create product", err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const categoryToAdd = {
      id: uid(25),
      ...newCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await axios.post("http://localhost:9999/categories", categoryToAdd);
      setCategories((prev) => [...prev, res.data]);
      setFormData((prev) => ({ ...prev, categoryId: res.data.id }));
      setNewCategory({ name: "", description: "" });
      setShowCategoryModal(false);

      if (typeof onCategoryCreated === "function") {
        onCategoryCreated();
      }
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Category *</Form.Label>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  isInvalid={!!errors.categoryId}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="secondary" onClick={() => setShowCategoryModal(true)}>
                  Add Category
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.categoryId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                isInvalid={!!errors.image}
              />
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">
          Create Product
        </Button>
        <Button variant="secondary" onClick={onClose} className="ms-2">
          Cancel
        </Button>
      </Form>

      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success">
              Add
            </Button>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)} className="ms-2">
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}