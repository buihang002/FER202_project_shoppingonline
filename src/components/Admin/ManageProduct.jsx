import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Container, Alert, Row, Col, Image } from "react-bootstrap";

const API_URL = "http://localhost:9999/products";

const initialForm = {
  id: null,
  title: "",
  description: "",
  price: "",
  image: "",
  categoryId: "",
  sellerId: "",
  isAuction: false,
  auctionEndTime: "",
  createdAt: "",
  updatedAt: "",
};

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null); // "create" | "details"
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const isCreate = modalMode === "create";
  const isView = modalMode === "details" && !isEditing;
  const isEdit = modalMode === "details" && isEditing;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:9999/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setForm({ ...initialForm });
    setModalMode("create");
    setIsEditing(false);
    setError("");
    setShowModal(true);
  };

  // Open Details Modal
  const openDetailsModal = (product) => {
    setForm({
      id: product.id ?? null,
      title: product.title ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      image: product.image ?? "",
      categoryId: product.categoryId ?? "",
      sellerId: product.sellerId ?? "",
      isAuction: product.isAuction ?? false,
      auctionEndTime: product.auctionEndTime ?? "",
      createdAt: product.createdAt ?? "",
      updatedAt: product.updatedAt ?? "",
    });
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validateForm = () => {
    if (!form.title || !form.price || !form.categoryId) {
      return "Vui lòng nhập đầy đủ thông tin bắt buộc.";
    }
    return "";
  };

  const handleCreate = async () => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    const now = new Date().toISOString();
    const generatedId = form.id ?? Date.now().toString();
    const newProduct = { ...form, id: generatedId, createdAt: now, updatedAt: now };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("Create product error:", err);
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
      fetchProducts();
    } catch (err) {
      console.error("Update product error:", err);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await fetch(`${API_URL}/${form.id}`, { method: "DELETE" });
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Quản lý sản phẩm</h2>

      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Button variant="primary" onClick={openAddModal}>
            + Thêm sản phẩm
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Đấu giá</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p, idx) => (
            <tr key={p.id}>
              <td>{idx + 1}</td>
              <td>
                {p.image && <Image src={p.image} alt={p.title} thumbnail width={60} />}
              </td>
              <td>{p.title}</td>
              <td>${p.price}</td>
              <td>{categories.find((c) => c.id === p.categoryId)?.name || "N/A"}</td>
              <td>{p.isAuction ? "Có" : "Không"}</td>
              <td>
                <Button variant="secondary" size="sm" onClick={() => openDetailsModal(p)}>
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{isCreate ? "Thêm sản phẩm mới" : isEdit ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={isView}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={isView}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                disabled={isView}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Danh mục</Form.Label>
              {isCreate ? (
                <Form.Select name="categoryId" value={form.categoryId} onChange={handleChange}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type="text"
                  value={categories.find((c) => c.id === form.categoryId)?.name || ""}
                  disabled
                />
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>URL ảnh</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                disabled={isView}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                label="Đấu giá"
                name="isAuction"
                checked={form.isAuction}
                onChange={handleChange}
                disabled={isView}
              />
            </Form.Group>

            {form.isAuction && (
              <Form.Group className="mb-2">
                <Form.Label>Thời gian kết thúc đấu giá</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="auctionEndTime"
                  value={form.auctionEndTime || ""}
                  onChange={handleChange}
                  disabled={isView}
                />
              </Form.Group>
            )}
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

export default ManageProduct;
