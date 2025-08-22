import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/seller/dashboard" },
    { text: "Store Profile", icon: <StoreIcon />, path: "/manage-store" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/manage-inventory" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/manage-order" },
    { text: "Shipping", icon: <LocalShippingIcon />, path: "/manage-shipping" },
  ];

  const handleMenuClick = (path, text) => {
    navigate(path);
    setCurrentPage(text);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {currentPage}
          </Typography>
          <Avatar sx={{ mr: 2 }}>S</Avatar>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={currentPage === item.text}
                onClick={() => handleMenuClick(item.path, item.text)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
