import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditStoreModal = ({ show, handleClose, storeData, setStoreData, handleSave, isSaving }) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Store Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Store Name</Form.Label>
            <Form.Control
              type="text"
              name="storeName"
              value={storeData.storeName}
              onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
              required
            />
            {storeData.storeName === '' && <Form.Text className="text-danger">Store name is required.</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={storeData.description}
              onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
              required
            />
            {storeData.description === '' && <Form.Text className="text-danger">Description is required.</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner URL</Form.Label>
            <Form.Control
              type="text"
              name="bannerImageURL"
              value={storeData.bannerImageURL}
              onChange={(e) => setStoreData({ ...storeData, bannerImageURL: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStoreModal;