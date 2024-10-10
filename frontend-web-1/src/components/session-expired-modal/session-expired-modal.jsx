import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const SessionExpiredModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Session Expired</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your session has expired. Please log in again.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SessionExpiredModal