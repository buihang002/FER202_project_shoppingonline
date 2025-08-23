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
     <Col key={product.id} sm={6} md={4} lg={3} className="mb-4">
  <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Card.Img
      variant="top"
      src={product.image}
      style={{ height: "200px", objectFit: "contain", padding: "10px" }}
    />
    <Card.Body className="d-flex flex-column" style={{ flex: "1 1 auto" }}>
      <Card.Title>{product.title}</Card.Title>
      <Card.Text>Category: {category}</Card.Text>
      <Card.Text
        style={{
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical"
        }}
      >
        Description: {product.description}
      </Card.Text>
      <Card.Text>Price: ${product.price}</Card.Text>
      <Button variant="success" className="mt-auto" onClick={() => onViewDetails(product.id)}>
        View details
      </Button>
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
      <Container>
        <Row className="mb-3">
          <Button
            variant="success"
            style={{ display: "flex", alignItems: "center", gap: "5px", width: '15%' }}
            onClick={handleOpenCreate}
          >
            <Plus /> Create Product
          </Button>
        </Row>

        <Row>
          <Col md={12}>
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "70%", padding: "8px" }}
              />
            </div>
            <Row>
              {renderProducts()}
            </Row>
            {renderPagination()}
          </Col>
        </Row>
      </Container>

      <Modal
        show={showCreateModal}
        onHide={handleCloseCreate}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
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