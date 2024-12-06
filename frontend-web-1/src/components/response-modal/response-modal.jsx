import React from 'react'
import { Modal } from 'react-bootstrap'

const ResponseModal = ({ message, ...props }) => {
  return (
    <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <h4>Response</h4>
        </Modal.Header>
        <Modal.Body>
            <p>{message}</p>
        </Modal.Body>
    </Modal>
  )
}

export default ResponseModal