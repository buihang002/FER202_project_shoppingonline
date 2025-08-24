import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Login from './components/Authentication/Login.jsx';
import Register from './components/Authentication/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import BecomeSeller from './components/Buyer/BecomeSeller.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
      </Routes>
    </Router>
  );
}

export default App;
