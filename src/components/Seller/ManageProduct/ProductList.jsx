import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row, Pagination, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Plus } from "react-bootstrap-icons";
import CreateProduct from './AddProduct.jsx';

function ListProduct({ onViewDetails }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreate = () => setShowCreateModal(true);
  const handleCloseCreate = () => setShowCreateModal(false);

  const fetchProducts = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    axios.get(`http://localhost:9999/products?sellerId=${currentUser.id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:9999/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, search]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const renderProducts = () => (
    currentProducts.map(product => {
      const category = categories.find(c => String(c.id) === String(product.categoryId))?.name || "Unknown";

      return (
        <Col key={product.id} sm={6} md={4} lg={3} className="mb-4 d-flex">
          <Card className="w-100 shadow-sm rounded-3 product-card">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <Card.Img
                variant="top"
                src={product.image}
                style={{ height: "100%", objectFit: "contain", padding: "15px" }}
              />
            </div>
            <Card.Body className="d-flex flex-column p-3">
              <Card.Title className="fw-bold text-dark mb-1">{product.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted small">
                Category: {category}
              </Card.Subtitle>
              <Card.Text className="flex-grow-1 card-description mb-3">
               Description: {product.description}
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                <h5 className="mb-0 text-success fw-bold">${product.price}</h5>
                <Button variant="success" className="btn-sm" onClick={() => onViewDetails(product.id)}>
                  View details
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      );
    })
  );

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-4">
      <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );

  return (
    <>
      <Container className="my-5">
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 className="mb-0 text-primary fw-bold">Your Products</h2>
          </Col>
          <Col md={6} className="d-flex justify-content-md-end mt-3 mt-md-0">
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2 px-4"
              onClick={handleOpenCreate}
            >
              <Plus size={20} /> Create Product
            </Button>
          </Col>
        </Row>
        
        <Row className="mb-4 justify-content-center">
          <Col md={8}>
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-pill px-4"
                placeholder="Search by product title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {filteredProducts.length > 0 ? (
            renderProducts()
          ) : (
            <Col className="text-center py-5">
              <p className="text-muted lead">No products found.</p>
            </Col>
          )}
        </Row>
        
        {filteredProducts.length > productsPerPage && renderPagination()}
      </Container>

      <Modal
        show={showCreateModal}
        onHide={handleCloseCreate}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Create New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <CreateProduct
            onClose={handleCloseCreate}
            onProductCreated={fetchProducts}
            onCategoryCreated={fetchCategories}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListProduct;