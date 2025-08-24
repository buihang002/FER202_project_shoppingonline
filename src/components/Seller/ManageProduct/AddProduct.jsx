import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { uid } from "uid";

export default function CreateProduct({ onClose, onProductCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    image: ""
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [categoryError, setCategoryError] = useState("");
  const [titleError, setTitleError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const sellerId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get("http://localhost:9999/categories"),
          axios.get("http://localhost:9999/products")
        ]);
        setCategories(categoryRes.data || []);
        setProducts(productRes.data || []);
      } catch (err) {
        console.error("Failed to load categories/products", err);
      }
    };
    fetchData();
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
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be a non-negative integer.";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category.";
    }
    if (!formData.image) {
      newErrors.image = "Please upload an image.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !titleError;
  };

  const handleTitleChange = (value) => {
    setFormData({ ...formData, title: value });
    const isDuplicate = products.some(
      (p) => p.title.trim().toLowerCase() === value.trim().toLowerCase()
    );
    setTitleError(isDuplicate ? "Product title already exists!" : "");
  };

  const handleCategoryNameChange = (value) => {
    setNewCategory({ ...newCategory, name: value });
    const isDuplicate = categories.some(
      (c) => c.name.trim().toLowerCase() === value.trim().toLowerCase()
    );
    setCategoryError(isDuplicate ? "Category name already exists!" : "");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productId = uid();
    const now = new Date().toISOString();

    const productData = {
      id: productId,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      image: formData.image,
      sellerId,
      createdAt: now,
      updatedAt: now
    };

    const inventoryData = {
      id: `inv-${productId}`,
      productId: productId,
      quantity: parseInt(formData.quantity),
      lastUpdated: now,
      createdAt: now,
      updatedAt: now
    };

    try {
      await axios.post("http://localhost:9999/products", productData);
      await axios.post("http://localhost:9999/inventories", inventoryData);

      alert("Product created successfully!");
      onProductCreated?.();
    } catch (err) {
      console.error("Failed to create product or inventory", err);
      alert("Failed to create product!");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim() || categoryError) return;

    const categoryToAdd = {
      id: uid(),
      name: newCategory.name.trim(),
      description: newCategory.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await axios.post("http://localhost:9999/categories", categoryToAdd);
      setCategories((prev) => [...prev, res.data]);
      setFormData((prev) => ({ ...prev, categoryId: res.data.id }));
      setNewCategory({ name: "", description: "" });
      setCategoryError("");
      setShowCategoryModal(false);
      alert("Category added successfully!");
    } catch (err) {
      console.error("Failed to add category", err);
      alert("Failed to add category!");
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
                onChange={(e) => handleTitleChange(e.target.value)}
                isInvalid={!!errors.title || !!titleError}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title || titleError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Quantity *</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                isInvalid={!!errors.quantity}
              />
              <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Upload Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                isInvalid={!!errors.image}
              />
              <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
              {formData.image && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              )}
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
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={!!titleError}
        >
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
                onChange={(e) => handleCategoryNameChange(e.target.value)}
                isInvalid={!!categoryError}
                required
              />
              <Form.Control.Feedback type="invalid">{categoryError}</Form.Control.Feedback>
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
            <Button type="submit" variant="success" disabled={!!categoryError}>
              Add
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowCategoryModal(false)}
              className="ms-2"
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
