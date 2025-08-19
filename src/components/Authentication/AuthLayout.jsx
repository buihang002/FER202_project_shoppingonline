import React from 'react';

// Component này tạo ra một layout chung: một chiếc card được căn giữa màn hình
// Nó nhận vào 'children' để hiển thị nội dung form (đăng nhập hoặc đăng ký)
const AuthLayout = ({ children, title }) => {
  const shoppingCartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-cart3 text-primary" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.74 11.5H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  );

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="p-4 p-md-5 bg-white rounded shadow-sm w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          {shoppingCartIcon}
          <h1 className="h3 mt-2 mb-0">Shopping Online</h1>
          {title && <h2 className="h5 text-muted mt-2">{title}</h2>}
        </div>
        {/* Nội dung của form sẽ được hiển thị ở đây */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
