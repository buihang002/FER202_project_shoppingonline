import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Form, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ManageSellers.css"; 

const ManageSellersTable = () => {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, productRes] = await Promise.all([
        axios.get("http://localhost:9999/users?role=seller"),
        axios.get("http://localhost:9999/products"),
      ]);

      const productData = productRes.data;
      setProducts(productData);

      let sellerData = userRes.data.map((s) => {
        const count = productData.filter((p) => p.sellerId === s.id).length;
        return { ...s, productCount: count };
      });

      sellerData.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );

      setSellers(sellerData);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter((s) => {
    const matchSearch =
      s.fullname.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ? true : s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="manage-sellers ">
      <h2 className="mb-4 fw-bold">Sellers & Shops Management</h2>

      {/* Toolbar */}
      <Row className="mb-3 g-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="secondary" onClick={fetchData} className="w-100">
            Refresh
          </Button>
        </Col>
      </Row>

      <div className="table-container shadow-sm rounded">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" /> Loading...
          </div>
        ) : (
          <Table striped hover responsive className="align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Seller</th>
                <th>Email</th>
                <th>Status</th>
                <th>Products</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller, index) => (
                <tr key={seller.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {seller.fullname}
                    </div>
                  </td>
                  <td>{seller.email}</td>
                  <td>
                    <Badge bg={getStatusVariant(seller.status)}>
                      {seller.status}
                    </Badge>
                  </td>
                  <td>{seller.productCount}</td>
                  <td>{new Date(seller.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          navigate(`/admin/sellers/${seller.id}/products`)
                        }
                      >
                        View Products
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ManageSellersTable;
