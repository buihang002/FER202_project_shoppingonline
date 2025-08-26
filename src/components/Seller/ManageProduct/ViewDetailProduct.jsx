import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  ArrowLeft,
  Tags,
  CashStack,
  Hammer,
  PencilSquare,
} from "react-bootstrap-icons";
import EditProduct from "./EditProduct";

function ViewDetails({ id, onBack }) {
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("Unknown");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProductAndInventory = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/products/${id}`);
        if (mounted) setProduct(res.data);

        const categoriesRes = await axios.get("http://localhost:9999/categories");
        if (mounted) {
          setCategories(categoriesRes.data);
          const prodCategory = categoriesRes.data.find(
            (c) => c.id === res.data.categoryId
          );
          if (prodCategory) setCategory(prodCategory.name);
        }

        const inventoryRes = await axios.get(
          `http://localhost:9999/inventories?productId=${id}`
        );
        if (mounted && inventoryRes.data.length > 0) {
          setInventory(inventoryRes.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProductAndInventory();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleUpdated = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/products/${id}`);
      setProduct(res.data);
      const prodCategory = categories.find((c) => c.id === res.data.categoryId);
      if (prodCategory) setCategory(prodCategory.name);

      // Cập nhật quantity sau khi edit
      const inventoryRes = await axios.get(
        `http://localhost:9999/inventories?productId=${id}`
      );
      if (inventoryRes.data.length > 0) setInventory(inventoryRes.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" variant="primary" role="status" />
        <span className="ms-2">Loading product details...</span>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="text-center py-5">
        <h4 className="text-muted">Product not found</h4>
        <Button
          variant="primary"
          className="mt-3 d-flex align-items-center justify-content-center mx-auto"
          onClick={onBack}
        >
          <ArrowLeft className="me-2" /> Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-lg border-0 rounded-4">
        <Row className="g-0">
          <Col md={6} className="d-flex justify-content-center align-items-center p-3">
            <div
              className="overflow-hidden rounded-4 shadow-sm"
              style={{
                width: "100%",
                maxHeight: "450px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fff",
              }}
            >
              <Image
                src={product.image}
                alt={product.title}
                fluid
                style={{
                  objectFit: "cover",
                  maxHeight: "450px",
                  transition: "transform 0.3s ease",
                }}
                className="hover-zoom"
              />
            </div>
          </Col>

          <Col md={6} className="p-4 d-flex flex-column justify-content-center">
            <Card.Body>
              <Card.Title className="fw-bold fs-3 mb-3">
                {product.title}
              </Card.Title>

              <div className="mb-3">
                <Badge bg="info" className="fs-6 px-3 py-2 d-inline-flex align-items-center">
                  <Tags className="me-2" /> {category}
                </Badge>
              </div>

              <Card.Text className="text-muted" style={{ lineHeight: "1.6" }}>
                {product.description}
              </Card.Text>

              <h3 className="fw-bold text-success mt-3 d-flex align-items-center">
                <CashStack className="me-2" /> ${product.price}
              </h3>

              {inventory && (
                <h5 className="fw-semibold mt-2 d-flex align-items-center">
                  <span className="me-2">Quantity:</span>
                  <span
                    style={{
                      color: inventory.quantity === 0 ? "red" :
                             inventory.quantity < 10 ? "orange" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {inventory.quantity}
                  </span>
                </h5>
              )}

              {product.isAuction && (
                <Badge
                  bg="danger"
                  className="fs-6 px-3 py-2 mt-3 d-inline-flex align-items-center"
                >
                  <Hammer className="me-2" /> Auction: Ongoing
                </Badge>
              )}

              <div className="mt-4 d-flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="d-flex align-items-center"
                  onClick={() => setShowEditModal(true)}
                >
                  <PencilSquare className="me-2" /> Edit Product
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="d-flex align-items-center"
                  onClick={onBack}
                >
                  <ArrowLeft className="me-2" /> Back to Products
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <EditProduct
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        productId={id}
        onUpdated={handleUpdated}
      />
    </Container>
  );
}

export default ViewDetails;
