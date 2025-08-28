import React from "react";
import { Nav, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiLogOut,
  FiClock,
  FiUser,
  FiAlertCircle,
  FiPackage,
  FiBarChart2,
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.id;

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    userId && {
      name: "My Profile",
      path: `/admin/profile/${userId}`,
      icon: <FiUser />,
    },

    { name: "Manage Account", path: "/admin/account", icon: <FiUsers /> },
    {
      name: "Pending Seller",
      path: "/admin/pending-seller",
      icon: <FiClock />,
    },
    {
      name: "Manage Sellers & Shops",
      path: "/admin/sellers",
      icon: <FiPackage />,
    },
    { name: "Manage Product", path: "/admin/product", icon: <FiBox /> },
    {
      name: "Manage Complaints",
      path: "/admin/complaints",
      icon: <FiAlertCircle />,
    },
    { name: "Statistic", path: "/admin/statistic", icon: <FiBarChart2 /> },
  ].filter(Boolean);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column vh-100 p-3"
      style={{ backgroundColor: "#f0f4f8", color: "#343a40" }}
    >
      <Nav className="flex-column">
        {links.map((link) => (
          <Nav.Link
            as={Link}
            to={link.path}
            key={link.path}
            className="mb-2 rounded px-3 py-2 d-flex align-items-center"
            style={{
              color: "#343a40",
              backgroundColor:
                location.pathname === link.path ? "#a8dadc" : "transparent",
            }}
          >
            <span className="me-2">{link.icon}</span>
            {link.name}
          </Nav.Link>
        ))}
      </Nav>

      <div className="mt-5">
        <Button
          variant="outline-danger"
          className="d-flex align-items-center justify-content-center w-100"
          onClick={handleLogout}
        >
          <FiLogOut className="me-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
