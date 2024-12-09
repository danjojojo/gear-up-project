import React from 'react'
import './specifications.scss'
import { Modal, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { 
    getCompatibilitySpecs,
    getAllParts 
} from '../../services/bbuService'

const Specifications = ({
    bikeTypeName,
    type,
    onHide,
    showSpecifications,
    setShowSpecifications,
    ...props
}) => {
    const [retrievedParts, setRetrievedParts] = useState([]);
    const handleGetParts = async () => {
        try {
            const { parts } = await getAllParts();
            setRetrievedParts(parts);
        } catch (error) {
            console.log("Error");
        }
    }

    const handleGetCompatibilitySpecs = async () => {
        try {
            await getCompatibilitySpecs(type);
        } catch (error) {
            console.log("Error");
        }
    }

    useEffect(() => {
        if(showSpecifications) {
            handleGetParts();
            handleGetCompatibilitySpecs();
        }
    },[showSpecifications]);


    return (
        <Modal
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            contentClassName='specifications-modal'
            centered
            onHide={onHide}
            {...props}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                   {bikeTypeName} Specifications
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content">
                    <div className="header">
                        <h4>Centered Modal</h4>
                        <p>
                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        </p>
                    </div>
                    <div className="parts">
                        {retrievedParts.map((part, index) => (
                            <div key={index} className='part'>
                                <button>Add {part.part_name}</button>
                            </div>
                        ))}
                    </div>
                    <div className="specs-list">
                        {retrievedParts.map((part, index) => (
                            <div key={index} className='spec'>
                                <p>{part.part_name}</p>

                                <div className="spec-groups">
                                    {part.part_name === 'Frame' && 
                                    <>
                                        <div className="spec-group">
                                            <p>Fork</p>
                                            <p>Frame purpose &rarr; Fork travel</p>
                                        </div>
                                        
                                    </>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default Specifications