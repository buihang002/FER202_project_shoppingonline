import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Gửi yêu cầu đăng nhập đến backend tại địa chỉ http://localhost:8000/api/login
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu backend trả về lỗi, hiển thị thông báo
        throw new Error(data.message || 'Đã có lỗi xảy ra.');
      }

      // Lưu thông tin người dùng (ví dụ: token) vào localStorage để duy trì đăng nhập
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);

      // Điều hướng dựa trên vai trò trả về từ backend
      switch (data.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'seller':
          navigate('/seller/dashboard');
          break;
        case 'buyer':
          navigate('/');
          break;
        default:
          setError('Vai trò người dùng không hợp lệ.');
      }
    } catch (err) {
      setError(err.message);
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
