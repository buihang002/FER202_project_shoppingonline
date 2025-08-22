import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText,
  Typography, Button, Avatar, Divider, Grid, Card, CardContent
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

// Import các component con
import ProductList from "../ManageProduct/ProductList.jsx";
import ViewDetails from "../ManageProduct/ViewDetailProduct.jsx";

const drawerWidth = 240;

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Danh sách menu bên trái
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Store Profile", icon: <StoreIcon /> },
    { text: "Inventory", icon: <InventoryIcon /> },
    { text: "Product", icon: <CategoryIcon /> },
    { text: "Orders", icon: <ShoppingCartIcon /> },
    { text: "Shipping", icon: <LocalShippingIcon /> },
  ];

  // Xử lý khi chọn menu
  const handleMenuClick = (text) => setCurrentPage(text);

  // Xử lý logout
  const handleLogout = () => navigate("/login");

  // Component trang chủ Dashboard
  const DashboardHome = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      <Grid container spacing={3}>
        {[
          { label: "Total Products", value: 150 },
          { label: "Total Orders", value: 25 },
          { label: "Revenue", value: "$1,250" },
          { label: "Pending Orders", value: 5 },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography>{item.label}</Typography>
                <Typography>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Các component trang khác
  const StoreProfile = () => <Typography variant="h5">Store Profile</Typography>;
  const Inventory = () => <Typography variant="h5">Inventory Management</Typography>;
  const Orders = () => <Typography variant="h5">Orders Management</Typography>;
  const Shipping = () => <Typography variant="h5">Shipping Management</Typography>;

  // Hiển thị nội dung theo trang hiện tại
  const renderContent = () => {
    switch (currentPage) {
      case "Dashboard": return <DashboardHome />;
      case "Store Profile": return <StoreProfile />;
      case "Inventory": return <Inventory />;
      case "Product":
        return (
          <ProductList
            onViewDetails={(id) => {
              setSelectedProductId(id);
              setCurrentPage("ProductDetails");
            }}
          />
        );
      case "ProductDetails":
        return (
          <ViewDetails
            id={selectedProductId}
            onBack={() => setCurrentPage("Product")}
          />
        );
      case "Orders": return <Orders />;
      case "Shipping": return <Shipping />;
      default: return <DashboardHome />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Thanh AppBar trên cùng */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{currentPage}</Typography>
          <Avatar sx={{ mr: 2 }}>S</Avatar>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Menu bên trái */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
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
                onClick={() => handleMenuClick(item.text)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Nội dung chính */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}