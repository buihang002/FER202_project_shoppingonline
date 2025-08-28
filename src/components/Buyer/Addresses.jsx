import React, { useState, useEffect } from 'react';
import NavHome from '../Home/NavHome';
import Footer from '../Home/Footer';
import { PlusCircle, Edit, Trash2, Home as HomeIcon } from 'lucide-react';
import { Modal, Button, Form } from 'react-bootstrap';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9999/addresses?userId=${currentUser.id}`);
            if (!response.ok) throw new Error('Failed to fetch addresses.');
            const data = await response.json();
            setAddresses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchAddresses();
        } else {
            setLoading(false);
        }
    }, []);

    const handleShowModal = (address = null) => {
        setIsEditing(!!address);
        setCurrentAddress(address || { userId: currentUser.id, fullName: '', phone: '', street: '', city: '', state: '', country: '', isDefault: false });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentAddress(null);
    };

    const handleSaveAddress = async () => {
        const url = isEditing 
            ? `http://localhost:9999/addresses/${currentAddress.id}` 
            : 'http://localhost:9999/addresses';
        
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentAddress)
            });
            if (!response.ok) throw new Error('Failed to save address.');
            fetchAddresses(); // Tải lại danh sách địa chỉ
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await fetch(`http://localhost:9999/addresses/${addressId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete address.');
                fetchAddresses();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSetDefault = async (addressToSet) => {
        // Bỏ mặc định của tất cả các địa chỉ khác
        const updates = addresses.map(addr => 
            fetch(`http://localhost:9999/addresses/${addr.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDefault: false })
            })
        );
        await Promise.all(updates);

        // Đặt địa chỉ mới làm mặc định
        try {
            const response = await fetch(`http://localhost:9999/addresses/${addressToSet.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDefault: true })
            });
            if (!response.ok) throw new Error('Failed to set default address.');
            fetchAddresses();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <NavHome />
            <main className="container flex-grow-1 my-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4 p-lg-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="fw-bold mb-0">Manage Addresses</h1>
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <PlusCircle size={16} className="me-2" />Add New Address
                            </Button>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {loading ? (
                            <div className="text-center"><div className="spinner-border" /></div>
                        ) : addresses.length > 0 ? (
                            <div className="list-group">
                                {addresses.map(address => (
                                    <div key={address.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="mb-1 fw-bold">
                                                {address.fullName}
                                                {address.isDefault && <span className="badge bg-success ms-2">Default</span>}
                                            </p>
                                            <p className="mb-1 text-muted">{address.phone}</p>
                                            <p className="mb-0 text-muted">{`${address.street}, ${address.city}, ${address.state}, ${address.country}`}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            {!address.isDefault && (
                                                <Button variant="outline-success" size="sm" onClick={() => handleSetDefault(address)}>Set Default</Button>
                                            )}
                                            <Button variant="outline-secondary" size="sm" onClick={() => handleShowModal(address)}><Edit size={16} /></Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAddress(address.id)}><Trash2 size={16} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-5 border rounded">
                                <p>You have no saved addresses.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />

            {/* Modal for Add/Edit Address */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Address' : 'Add New Address'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" value={currentAddress?.fullName} onChange={e => setCurrentAddress({...currentAddress, fullName: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" value={currentAddress?.phone} onChange={e => setCurrentAddress({...currentAddress, phone: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Street</Form.Label>
                            <Form.Control type="text" value={currentAddress?.street} onChange={e => setCurrentAddress({...currentAddress, street: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" value={currentAddress?.city} onChange={e => setCurrentAddress({...currentAddress, city: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" value={currentAddress?.state} onChange={e => setCurrentAddress({...currentAddress, state: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" value={currentAddress?.country} onChange={e => setCurrentAddress({...currentAddress, country: e.target.value})} />
                        </Form.Group>
                        <Form.Check type="checkbox" label="Set as default address" checked={currentAddress?.isDefault} onChange={e => setCurrentAddress({...currentAddress, isDefault: e.target.checked})} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveAddress}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Addresses;
