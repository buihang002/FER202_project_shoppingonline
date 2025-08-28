import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHome from '../Home/NavHome';
import Footer from '../Home/Footer';

const BecomeSeller = () => {
    const [formData, setFormData] = useState({
        storeName: '',
        description: '',
        address: '',
        avatarURL: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Kiểm tra nếu người dùng chưa đăng nhập hoặc đã là seller/admin
    if (!currentUser || currentUser.role !== 'buyer') {
        // Có thể hiển thị một thông báo hoặc chuyển hướng
        return (
            <div className="d-flex flex-column min-vh-100">
                <NavHome />
                <div className="container flex-grow-1 my-5 text-center">
                    <h2 className="text-danger">Access Denied</h2>
                    <p>You must be logged in as a buyer to access this page.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Bước 1: Cập nhật vai trò của người dùng thành 'seller'
            const userUpdateResponse = await fetch(`http://localhost:9999/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'seller' })
            });

            if (!userUpdateResponse.ok) throw new Error('Failed to update user role.');
            const updatedUser = await userUpdateResponse.json();
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));


            // Bước 2: Tạo một cửa hàng mới trong 'stores'
            const newStore = {
                id: `store-${Date.now()}`,
                sellerId: currentUser.id,
                storeName: formData.storeName,
                description: formData.description,
                address: formData.address, 
                bannerImageURL: formData.avatarURL,
                status: 'pending' // Chờ admin duyệt
            };

            const storeCreateResponse = await fetch('http://localhost:9999/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore)
            });

            if (!storeCreateResponse.ok) throw new Error('Failed to create the store.');

            alert('Congratulations! You are now a seller. You will be redirected to the Seller Dashboard.');
            navigate('/seller/dashboard');

        } catch (err) {
            setError(err.message);
            console.error("Registration failed:", err);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-5">
                                <h2 className="card-title text-center fw-bold mb-4">Become a Seller</h2>
                                <p className="text-center text-muted mb-4">Fill out the form below to start selling your products.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="storeName" className="form-label">Shop Name</label>
                                        <input type="text" className="form-control" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="avatarURL" className="form-label">Shop Avatar (URL)</label>
                                        <input type="text" className="form-control" id="avatarURL" name="avatarURL" value={formData.avatarURL} onChange={handleChange} placeholder="https://example.com/image.png" required />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                                    </div>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary btn-lg">Register as Seller</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BecomeSeller;
