// AdminDashboard.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import NavBar from "../components/Nav/NavBar";
import Sidebar from "../components/Nav/SideBar";

const AdminDashboard = () => {
  return (
    <div>
      <NavBar />
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="p-0">
            <Sidebar />
          </Col>
          <Col md={9} lg={10} className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
