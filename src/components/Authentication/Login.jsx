import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import database from '../../data/database.json';

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

  const shoppingCartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#007bff" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-9.438-6.5L4.107 3H13.5l-1.477 7.385A.5.5 0 0 1 12 11H4a.5.5 0 0 1-.49-.408L2.01 3.607 1.61 2H.5z" />
    </svg>
  );

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="p-5 bg-white rounded shadow-sm text-center" style={{ maxWidth: '400px' }}>
        <div className="mb-4">
          {shoppingCartIcon}
          <h1 className="h4 mt-2">Shopping Online</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="Email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="emailInput">Email or mobile number</label>
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
            <label htmlFor="passwordInput">Password</label>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary btn-lg">Log In</button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        <div className="mt-3">
          <a href="#" className="link-primary text-decoration-none">Having trouble logging in?</a>
        </div>
        <hr className="my-4" />
        <div className="d-grid gap-2">
          <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;