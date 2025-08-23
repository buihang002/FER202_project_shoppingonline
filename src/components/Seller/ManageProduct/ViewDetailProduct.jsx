import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Image, Button } from "react-bootstrap";

function ViewDetails({ id, onBack }) {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("Unknown");

  useEffect(() => {
    axios.get(`http://localhost:9999/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));

    axios.get("http://localhost:9999/categories")
      .then((res) => {
        const prodCategory = res.data.find(c => c.id === product?.categoryId);
        if (prodCategory) setCategory(prodCategory.name);
      })
      .catch(err => console.log(err));
  }, [id, product?.categoryId]);

  if (!product) return <p>Loading product details...</p>;

  return (
    <Container style={{ marginTop: "30px" }}>
      <Row>
        <Col md={4}>
          <Image src={product.image} alt={product.title} fluid style={{ objectFit: "contain", maxHeight: "400px" }} />
        </Col>
        <Col md={8}>
          <h2>{product.title}</h2>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          {product.isAuction && <p style={{ color: "red" }}><strong>Auction:</strong> Ongoing</p>}
          <Button variant="success" onClick={onBack}>Back to product list</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewDetails;
