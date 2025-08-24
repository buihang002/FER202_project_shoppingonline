import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  InputGroup,
  Pagination,
  Badge,
} from "react-bootstrap";
import { PlusCircle, Search, Tag } from "react-bootstrap-icons";
import CreateProduct from "./AddProduct.jsx";

export default function ListProduct({ onViewDetails }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 8;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const sellerId = currentUser?.id;

  const fetchAllData = async () => {
    if (!sellerId) return;
    
    setLoading(true);
    console.log("Fetching all data...");

    try {
      const [prodRes, catRes, invenRes] = await Promise.all([
        axios.get(`http://localhost:9999/products?sellerId=${sellerId}`),
        axios.get("http://localhost:9999/categories"),
        axios.get("http://localhost:9999/inventories"),
      ]);

      setProducts(prodRes.data);
      setCategories(catRes.data);
      setInventories(invenRes.data);
      
      console.log("Products:", prodRes.data.length);
      console.log("Inventories:", invenRes.data.length);
      console.log("Inventories data:", invenRes.data.map(inv => ({ 
        id: inv.id, 
        productId: inv.productId, 
        quantity: inv.quantity 
      })));
      
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [sellerId]);

  // Lấy số lượng tồn kho của sản phẩm
  const getQuantity = (productId) => {
    const inven = inventories.find((inv) => inv.productId === productId);
    const quantity = inven ? inven.quantity : 0;
    
    // Debuglog từng sản phẩm
    console.log(`getQuantity for productId ${productId}:`, {
      found: !!inven,
      inventory: inven,
      quantity: quantity
    });
    
    return quantity;
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchTitle = product.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchCategory = filterCategory
        ? product.categoryId === filterCategory
        : true;
      return matchTitle && matchCategory;
    });
  }, [products, search, filterCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Xử lý khi tạo sản phẩm mới thành công
  const handleProductAdded = async (newProduct, newInventory) => {
    console.log("Product added, refreshing data...");
    setShowCreateModal(false);
    
    // Đợi một chút để backend xử lý xong
    setTimeout(async () => {
      await fetchAllData();
    }, 500);
  };

  return (
    <Container fluid className="py-4" style={{ background: "#f8f9fa" }}>
      {/* Header */}
      <Row className="align-items-center mb-4 g-3">
        {/* Search */}
        <Col xs={12} md={5}>
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Filter by Category */}
        <Col xs={12} md={4}>
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* Create Product Button */}
        <Col xs={12} md={3} className="text-md-end">
          <Button
            variant="primary"
            className="d-flex align-items-center w-100 w-md-auto"
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
          >
            <PlusCircle className="me-2" size={20} />
            Create Product
          </Button>
        </Col>
      </Row>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <Row className="g-4">
        {currentProducts.map((product) => {
          const category =
            categories.find((c) => c.id === product.categoryId)?.name ||
            "Unknown";
          const quantity = getQuantity(product.id);

          return (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border-0 rounded-4 position-relative">
                {/* Hình ảnh */}
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.title}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Hết hàng */}
                {quantity === 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-0 m-2"
                    style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                  >
                    Out of Stock
                  </Badge>
                )}

                <Card.Body>
                  <Card.Title
                    className="fw-bold text-truncate"
                    title={product.title}
                  >
                    {product.title}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    <Tag className="me-1" /> {category}
                  </Card.Text>
                  <Card.Text
                    className="text-truncate"
                    title={product.description}
                  >
                    {product.description}
                  </Card.Text>
                  <h5 className="fw-bold text-success">${product.price}</h5>
                  <p className="mb-0 small">
                    <strong>Quantity:</strong>{" "}
                    <span className={quantity === 0 ? "text-danger" : "text-success"}>
                      {quantity}
                    </span>
                  
                  </p>
                </Card.Body>

                <Card.Footer className="bg-white border-0">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => onViewDetails(product.id)}
                  >
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}

        {currentProducts.length === 0 && !loading && (
          <Col xs={12} className="text-center py-5">
            <h5 className="text-muted">No products found</h5>
          </Col>
        )}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item
                key={num + 1}
                active={num + 1 === currentPage}
                onClick={() => setCurrentPage(num + 1)}
              >
                {num + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateProduct
            onClose={() => setShowCreateModal(false)}
            onProductAdded={handleProductAdded}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}