import React from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you're using Bootstrap

const ImagePreviewModal = ({ show, handleClose, src }) => {
    return (
        <Modal show={show} onHide={handleClose} centered contentClassName='img-preview'>
            <Modal.Header closeButton>
                Preview Image  
            </Modal.Header>
            <Modal.Body>
                <div className="img-preview">
                    <img
                        src={src}
                        alt="Preview"
                        style={{ width: '100%', height: '50vh', margin: '0 auto', display: 'block', objectFit: 'contain' }}
                    />

                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ImagePreviewModal;