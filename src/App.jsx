import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home.jsx';
import Login from './components/Authentication/Login.jsx';
import Register from './components/Authentication/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// import SellerDashboard from './components/Seller/ManageDashboardSeller/SellerDashboard.jsx';
// import ListProduct from './components/Seller/ManageProduct/ProductList.jsx';
// import SellerDashboard from './pages/SellerDashboard.jsx';
// import Admin from './components/Admin/Admin.jsx';
// import ManageAccount from './components/Admin/ManageAccount/ManageAccount.jsx';
// import ManageProduct from './components/Admin/ManageProduct.jsx';

import Admin from './components/Admin/Admin.jsx';
import ManageAccount from './components/Admin/ManageAccount/ManageAccount.jsx';
import ManageProduct from './components/Admin/ManageProduct.jsx';
import SellerDashboard from './components/Seller/ManageDashboardSeller/SellerDashboard.jsx';
import ListProduct from './components/Seller/ManageProduct/ProductList.jsx';



function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />

        <Route path="/seller/products" element={<ListProduct />} />


        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/account" element={<ManageAccount />} />
          <Route path="/admin/product" element={<ManageProduct />} />
        </Route>


        <Route path="/seller/products" element={<ListProduct />} />
      

      </Routes>


    </Router>
  );
}

export default App;
