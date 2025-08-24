import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Image } from "react-bootstrap";
import axios from "axios";

export default function EditProduct({ show, onClose, productId, onUpdated }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        image: ""
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (!productId || !show) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, categoryRes] = await Promise.all([
                    axios.get(`http://localhost:9999/products/${productId}`),
                    axios.get("http://localhost:9999/categories")
                ]);

                setFormData(productRes.data);
                setCategories(categoryRes.data);
                setPreviewImage(productRes.data.image);
            } catch (error) {
                console.error("Failed to fetch product data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId, show]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage("");
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9999/products/${productId}`, formData);
            onUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update product", error);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
                {loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "300px" }}
                    >
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="category">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={formData.categoryId}
                                        onChange={(e) => handleChange("categoryId", e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="image">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                                    {previewImage && (
                                        <div className="mt-3 text-center">
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                thumbnail
                                                style={{ maxHeight: "150px", objectFit: "cover" }}
                                            />
                                            <div className="mt-2">
                                                <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
                                                    Remove Image
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="secondary" onClick={onClose} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="success" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}
