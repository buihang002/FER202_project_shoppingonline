import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Card, Row, Col, Spinner, Alert,
  Button
} from 'react-bootstrap';
import EditStoreModal from './EditProfileStore';

function StoreProfile() {
  const [store, setStore] = useState(null);
  const [seller, setSeller] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    bannerImageURL: '',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      setStatus('loading');
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.id || currentUser.role !== 'seller') {
          throw new Error('You are not logged in as a seller.');
        }
        const sellerId = currentUser.id;

        const storeRes = await axios.get(`http://localhost:9999/stores?sellerId=${sellerId}`);
        const fetchedStore = storeRes.data[0];

        if (!fetchedStore) {
          throw new Error('No store found for this seller.');
        }
        setStore(fetchedStore);
        setFormData({
          storeName: fetchedStore.storeName,
          description: fetchedStore.description,
          bannerImageURL: fetchedStore.bannerImageURL,
        });

        const sellerRes = await axios.get(`http://localhost:9999/users/${sellerId}`);
        setSeller(sellerRes.data);
        setStatus('success');
      } catch (err) {
        console.error('Error fetching data:', err);
        setStatus('error');
      }
    };
    fetchStoreData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('saving');
    
    // Validation
    if (!formData.storeName || !formData.description) {
      alert('Store name and description are required.');
      setStatus('error');
      return;
    }

    try {
      const updatedStore = { ...store, ...formData, updatedAt: new Date().toISOString() };
      await axios.put(`http://localhost:9999/stores/${store.id}`, updatedStore);
      setStore(updatedStore);
      handleCloseModal();
      setStatus('success');
    } catch (err) {
      console.error('Error updating store:', err);
      setStatus('error');
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading store profile...</p>
        </div>
      );
    }
    
    if (status === 'error' || !store || !seller) {
      return (
        <div className="my-5">
          <Alert variant="danger">
            {status === 'error' ? 'Failed to load store data. Please try again.' : 'Store data is not available.'}
          </Alert>
        </div>
      );
    }

    return (
      <>
        {store.bannerImageURL && (
          <Card.Img
            variant="top"
            src={store.bannerImageURL}
            alt="Store Banner"
            style={{ height: '300px', objectFit: 'cover' }}
          />
        )}
        <Card.Body className="p-4 p-md-5">
          <Row className="mb-4 align-items-center">
            <Col>
              <h1 className="fw-bold text-primary">{store.storeName}</h1>
              <p className="lead text-muted">{store.description}</p>
            </Col>
            <Col xs="auto">
              <Button variant="outline-primary" onClick={handleShowModal}>
                Edit
              </Button>
            </Col>
          </Row>
          <hr />
          <div className="mt-4">
            <h3 className="fw-semibold">Seller Information</h3>
            <ul className="list-unstyled">
              <li><strong>Full Name:</strong> {seller.fullname}</li>
              <li><strong>Username:</strong> {seller.username}</li>
              <li><strong>Email:</strong> {seller.email}</li>
            </ul>
          </div>
        </Card.Body>
      </>
    );
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 rounded-3">
        {renderContent()}
      </Card>
      {store && (
        <EditStoreModal
          show={showModal}
          handleClose={handleCloseModal}
          storeData={formData}
          setStoreData={setFormData}
          handleSave={handleSave}
          isSaving={status === 'saving'}
        />
      )}
    </Container>
  );
}

export default StoreProfile;