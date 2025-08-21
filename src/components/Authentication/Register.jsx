import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    try {
      const checkEmailResponse = await fetch(`http://localhost:9999/users?email=${email}`);
      const existingUsers = await checkEmailResponse.json();

      if (existingUsers.length > 0) {
        setError("Email đã tồn tại.");
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        username: email.split('@')[0],
        fullname: fullName,
        email: email,
        password: password,
        role: 'buyer',
        avatarURL: "https://example.com/avatars/default.jpg",
        action: "unlock",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const createUserResponse = await fetch('http://localhost:9999/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!createUserResponse.ok) {
        throw new Error("Đăng ký thất bại.");
      }

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      setError("Không thể kết nối tới server. Bạn đã chạy json-server chưa?");
      console.error("Lỗi đăng ký:", err);
    }
  };

  return (
    <AuthLayout title="Đăng ký thành viên">
      <form onSubmit={handleRegister}>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="fullNameInput" placeholder="Họ và Tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <label htmlFor="fullNameInput">Họ và Tên</label>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="emailInput">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="passwordInput" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label htmlFor="passwordInput">Mật khẩu</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="confirmPasswordInput" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <label htmlFor="confirmPasswordInput">Nhập lại mật khẩu</label>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-lg">Đăng ký</button>
        </div>
      </form>
      <hr className="my-4" />
      <div className="text-center">
        <p className="mb-0">Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
      </div>
    </AuthLayout>
  );
};

export default Register;
