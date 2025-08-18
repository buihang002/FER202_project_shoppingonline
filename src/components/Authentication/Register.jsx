import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import database from '../../data/database.json';

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

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    const existingUser = database.users.find(user => user.email === email);
    if (existingUser) {
      setError('Email đã được sử dụng. Vui lòng chọn email khác.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      fullname: `${lastName} ${firstName}`,
      username: email.split('@')[0],
      email,
      password,
      role: 'buyer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    database.users.push(newUser);
    
    console.log('Người dùng mới đã được thêm:', newUser);

    navigate('/login');
  };
  
  const shoppingCartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#007bff" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-9.438-6.5L4.107 3H13.5l-1.477 7.385A.5.5 0 0 1 12 11H4a.5.5 0 0 1-.49-.408L2.01 3.607 1.61 2H.5z" />
    </svg>
  );

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="p-5 bg-white rounded shadow-sm w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          {shoppingCartIcon}
          <h1 className="h4 mt-2">Shopping Online</h1>
        </div>
        <div className="text-center mb-4">
          <h2 className="h4">Đăng ký thành viên!</h2>
        </div>
        <form onSubmit={handleRegister}>
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Họ"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Tên"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg w-100">Đăng ký</button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
      </div>
    </div>
  );
};

export default Register;