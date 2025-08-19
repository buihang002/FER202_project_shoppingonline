import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import database from '../../data/database.json';
import AuthLayout from './AuthLayout'; // Import layout chung

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    const existingUser = database.users.find(user => user.email === email);
    if (existingUser) {
      setError('Email đã được sử dụng. Vui lòng chọn email khác.');
      return;
    }

    // Logic để thêm người dùng mới (lưu ý: cách này chỉ mô phỏng, không an toàn cho production)
    console.log('Đăng ký thành công!');
    navigate('/login');
  };

  return (
    <AuthLayout title="Đăng ký thành viên">
      <form onSubmit={handleRegister}>
        <div className="row g-2 mb-3">
          <div className="col-md">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="lastNameInput"
                placeholder="Họ"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <label htmlFor="lastNameInput">Họ</label>
            </div>
          </div>
          <div className="col-md">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="firstNameInput"
                placeholder="Tên"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label htmlFor="firstNameInput">Tên</label>
            </div>
          </div>
        </div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="emailInput"
            placeholder="Email"
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
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="passwordInput">Mật khẩu</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="confirmPasswordInput"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
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
