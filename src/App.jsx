import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import các trang và component
import Home from './pages/Home.jsx';
import Login from './components/Authentication/Login.jsx';
import Register from './components/Authentication/Register.jsx';

// Component Dashboard đơn giản để kiểm tra
const Dashboard = ({ role }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="p-5 bg-white rounded shadow-sm text-center">
        <h2 className="mb-4">Trang quản trị của {role}</h2>
        <p className="mb-4 text-muted">Đây là dashboard của bạn. Chức năng sẽ được bổ sung sau.</p>
        <Link to="/" className="btn btn-success">Về trang chủ</Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho các trang chính */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route cho các dashboard sau khi đăng nhập */}
        <Route path="/buyer/dashboard" element={<Dashboard role="Người mua" />} />
        <Route path="/seller/dashboard" element={<Dashboard role="Người bán" />} />
        <Route path="/admin/dashboard" element={<Dashboard role="Admin" />} />
      </Routes>
    </Router>
  );
};

export default App;
