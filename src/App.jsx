import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BecomeSeller from "./components/Buyer/BecomeSeller.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartPage from "./pages/CartPage.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/Authentication/Login.jsx";
import Register from "./components/Authentication/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Admin from "./components/Admin/AdminDashBoard.jsx";
import ManageAccount from "./components/Admin/ManageAccount/ManageAccount.jsx";
import ManageProduct from "./components/Admin/ManageProduct/ManageProduct.jsx";
import SellerDashboard from "./components/Seller/ManageDashboardSeller/SellerDashboard.jsx";
import ListProduct from "./components/Seller/ManageProduct/ProductList.jsx";
import PendingSellers from "./components/Admin/ManagerPending/PendingSeller.jsx";
import AdminOrderPage from "./components/Admin/AdminOrderPage.jsx";
import AdminReview from "./components/Admin/AdminReview.jsx";
import ManageComplaints from "./components/Admin/ManageComplaints/ManageComplaints.jsx";
import ProductDetailPage from "./components/Admin/ManageProduct/ProductDetails.jsx";
import ManageProfile from "./components/Admin/ManageProfile/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/seller/dashboard" element={<SellerDashboard />} />


        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/account" element={<ManageAccount />} />
          <Route path="/admin/product" element={<ManageProduct />} />

          <Route path="pending-seller" element={<PendingSellers />} />
          <Route path="order" element={<AdminOrderPage />} />
          <Route path="review" element={<AdminReview />} />
          <Route path="/admin/complaints" element={<ManageComplaints />} />
        </Route>



        <Route path="/profile/:userId" element={<ManageProfile />} />
        <Route path="/admin/product/:id" element={<ProductDetailPage />} />


        <Route path="/seller/products" element={<ListProduct />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
