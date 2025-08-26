import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditStoreModal = ({ show, handleClose, storeData, setStoreData, handleSave, isSaving }) => {

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setStoreData({ ...storeData, bannerImageURL: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Store Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Store Name *</Form.Label>
            <Form.Control
              type="text"
              value={storeData.storeName}
              onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={storeData.description}
              onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Banner Image *</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {storeData.bannerImageURL && (
              <img
                src={storeData.bannerImageURL}
                alt="Preview"
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginTop: "10px", borderRadius: "6px" }}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSaving}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStoreModal;
