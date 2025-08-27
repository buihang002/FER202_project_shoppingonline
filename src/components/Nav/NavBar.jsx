import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Container fluid>
        <Navbar.Brand className="fw-bold pe-5" style={{ color: "#343a40" }}>
          SHOPII
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center">
          {/* <Button
            variant="outline-danger"
            className="d-flex align-items-center"
            onClick={handleLogout}
          >
            <FiLogOut className="me-2" />
            Logout
          </Button> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
