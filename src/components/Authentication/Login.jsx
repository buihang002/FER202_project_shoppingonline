import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useCart } from '../../context/CartContext'; // Import useCart

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useCart(); // Lấy hàm login từ context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:9999/users?email=${email}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        
        // Gọi hàm login từ context để cập nhật trạng thái toàn bộ ứng dụng
        login(user);

        // Điều hướng theo vai trò
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'seller':
            navigate('/seller/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Không thể kết nối tới server.');
    }
  };

  return (
    <AuthLayout title="Đăng nhập vào tài khoản">
        <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label htmlFor="emailInput">Email</label>
            </div>
            <div className="form-floating mb-3">
                <input type="password" className="form-control" id="passwordInput" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label htmlFor="passwordInput">Mật khẩu</label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-grid gap-2 mb-3">
                <button type="submit" className="btn btn-primary btn-lg">Đăng nhập</button>
            </div>
        </form>
        <hr className="my-4" />
        <div className="d-grid">
            <p className="text-center text-muted">Chưa có tài khoản?</p>
            <button className="btn btn-outline-success btn-lg" onClick={() => navigate('/register')}>Tạo tài khoản mới</button>
        </div>
    </AuthLayout>
  );
};

export default Login;
