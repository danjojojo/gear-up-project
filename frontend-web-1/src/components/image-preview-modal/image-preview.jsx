import React from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you're using Bootstrap

const ImagePreviewModal = ({ show, handleClose, src }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              
            </Modal.Header>
            <Modal.Body>
                <img
                    src={src}
                    alt="Preview"
                    style={{ width: '100%', height: 'auto' }} // Makes the image responsive
                />
            </Modal.Body>
        </Modal>
    );
};

export default ImagePreviewModal;