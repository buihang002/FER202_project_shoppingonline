import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import database from '../../data/database.json';
import AuthLayout from './AuthLayout'; // Import layout chung

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = database.users.find(u => u.email === email);

    if (!user || user.password !== password) {
      setError('Email hoặc mật khẩu không đúng.');
      return;
    }

    // Chuyển hướng dựa trên vai trò người dùng
    switch (user.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'seller':
        navigate('/seller/dashboard');
        break;
      case 'buyer':
        navigate('/buyer/dashboard');
        break;
      default:
        setError('Vai trò người dùng không hợp lệ.');
    }
  };

  return (
    <AuthLayout title="Đăng nhập vào tài khoản">
      <form onSubmit={handleLogin}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="emailInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="emailInput">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="passwordInput">Mật khẩu</label>
        </div>
        
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="d-grid gap-2 mb-3">
          <button type="submit" className="btn btn-primary btn-lg">Đăng nhập</button>
        </div>
      </form>
      <div className="text-center">
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </div>
      <hr className="my-4" />
      <div className="d-grid">
        <p className="text-center text-muted">Chưa có tài khoản?</p>
        <button className="btn btn-outline-success btn-lg" onClick={() => navigate('/register')}>Tạo tài khoản mới</button>
      </div>
    </AuthLayout>
  );
};

export default Login;
