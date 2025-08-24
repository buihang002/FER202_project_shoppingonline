import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { uid } from "uid";

export default function CreateProduct({ onClose, onProductAdded }) {
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const sellerId = currentUser?.id;

  useEffect(() => {
    axios.get("http://localhost:9999/categories").then(res => setCategories(res.data));
    axios.get("http://localhost:9999/products").then(res => setProducts(res.data));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim().length < 5) newErrors.title = "Title must be at least 5 characters.";
    else {
      const existingTitles = products.map(p => p.title.toLowerCase());
      if (existingTitles.includes(formData.title.trim().toLowerCase())) newErrors.title = "Title already exists.";
    }
    if (!formData.description || formData.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters.";
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0 || price > 100000000) newErrors.price = "Price must be a positive number under 100,000,000.";
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) newErrors.quantity = "Quantity must be a non-negative integer.";
    if (!formData.categoryId) newErrors.categoryId = "Please select a category.";
    if (!formData.image) newErrors.image = "Please upload an image.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const productId = uid(25);
    const now = new Date().toISOString();
    const productData = {
      id: productId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      image: formData.image,
      sellerId,
      createdAt: now,
      updatedAt: now
    };
    const inventoryData = {
      id: uid(25),
      productId,
      quantity: parseInt(formData.quantity),
      lastUpdated: now,
      createdAt: now,
      updatedAt: now
    };
    try {
      const productResponse = await axios.post("http://localhost:9999/products", productData);
      await new Promise(resolve => setTimeout(resolve, 200));
      const inventoryResponse = await axios.post("http://localhost:9999/inventories", inventoryData);
      setFormData({ title: "", description: "", price: "", quantity: "", categoryId: "", image: "" });
      setErrors({});
      alert("Product created successfully!");
      if (onProductAdded) onProductAdded(productResponse.data, inventoryResponse.data);
    } catch (err) {
      if (err.config && err.config.url.includes('inventories')) {
        try {
          await axios.delete(`http://localhost:9999/products/${productId}`);
        } catch {}
      }
      alert("Failed to create product! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const categoryToAdd = {
      id: uid(25),
      name: newCategory.name.trim(),
      description: newCategory.description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      const res = await axios.post("http://localhost:9999/categories", categoryToAdd);
      setCategories(prev => [...prev, res.data]);
      setFormData(prev => ({ ...prev, categoryId: res.data.id }));
      setNewCategory({ name: "", description: "" });
      setShowCategoryModal(false);
    } catch {
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
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                isInvalid={!!errors.title}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                isInvalid={!!errors.price}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Quantity *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                isInvalid={!!errors.quantity}
                disabled={isSubmitting}
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
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  isInvalid={!!errors.categoryId}
                  disabled={isSubmitting}
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
                <Button variant="secondary" onClick={() => setShowCategoryModal(true)} disabled={isSubmitting} style={{ whiteSpace: 'nowrap' }}>
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
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
              {formData.image && <img src={formData.image} alt="Preview" style={{ width: "120px", height: "120px", objectFit: "cover", marginTop: "10px", borderRadius: "8px" }} />}
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            isInvalid={!!errors.description}
            disabled={isSubmitting}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Creating...
              </>
            ) : 'Create Product'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        </div>
      </Form>

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control type="text" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="success">Add</Button>
              <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
