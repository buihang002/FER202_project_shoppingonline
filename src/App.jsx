import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Authentication/Login.jsx';
import Register from './components/Authentication/Register.jsx';

// Component trang chủ
const HomePage = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div className="p-5 bg-white rounded shadow-sm w-100" style={{ maxWidth: '500px' }}>
        <h1 className="mb-4">Shopping online</h1>
        <p className="mb-4 text-muted">Chào mừng bạn đến với ứng dụng mua sắm trực tuyến. Vui lòng đăng nhập hoặc đăng ký để tiếp tục.</p>
        <div className="d-grid gap-2 d-md-block">
          <Link to="/login" className="btn btn-primary me-2">Đăng nhập</Link>
          <Link to="/register" className="btn btn-secondary">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

// Component trang dashboard mặc định cho các vai trò
const Dashboard = ({ role }) => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div className="p-5 bg-light rounded shadow-sm w-100" style={{ maxWidth: '500px' }}>
        <h2 className="mb-4">Trang quản trị {role}</h2>
        <p className="mb-4 text-muted">Đây là trang dashboard của bạn. Chức năng sẽ được bổ sung sau.</p>
        <Link to="/" className="btn btn-success">Về trang chủ</Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Các route dashboard giả để kiểm tra việc chuyển hướng */}
        <Route path="/buyer/dashboard" element={<Dashboard role="người mua" />} />
        <Route path="/seller/dashboard" element={<Dashboard role="người bán" />} />
        <Route path="/admin/dashboard" element={<Dashboard role="admin" />} />
      </Routes>
    </Router>
  );
};

export default App;