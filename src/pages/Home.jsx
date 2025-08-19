import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="p-5 bg-white rounded shadow-sm text-center" style={{ maxWidth: '550px' }}>
        <h1 className="display-5 fw-bold mb-3">Chào mừng đến với Shopping Online</h1>
        <p className="lead mb-4">
          Nền tảng mua sắm trực tuyến tốt nhất. Vui lòng đăng nhập hoặc đăng ký để bắt đầu trải nghiệm.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">Đăng nhập</Link>
          <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
