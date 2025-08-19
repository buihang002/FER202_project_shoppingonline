import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <div className="p-5 bg-white rounded shadow-sm text-center">
                <h1 className="mb-4">Chào mừng Admin</h1>
                <p className="mb-4 text-muted">Đây là trang quản trị của bạn.</p>
                <Link to="/" className="btn btn-success">Về trang chủ</Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
