import React, { useState } from 'react'
import './configure.scss'
import {Modal, Button} from 'react-bootstrap'
import { 
    getAllParts,
    getCompatibilitySpecs
} from '../../services/bbuService'
import { useEffect } from 'react'
import Part from './part/part'

const Configure = ({ 
    bikeTypeName,
    showConfigure,
    setShowConfigure,
    type,
    action,
    onConfirm,
    onHide,
    ...props
}) => {
    
    const [showPart, setShowPart] = useState(false);
    const [partName, setPartName] = useState('');
    
    const [retrievedParts, setRetrievedParts] = useState([]);

    const [configType, setConfigType] = useState('');
    const [configPartId, setConfigPartId] = useState('');

    const [currentPartFrom, setCurrentPartFrom] = useState('');
    const [currentPartTo, setCurrentPartTo] = useState('');

    const handleGetParts = async () => {
        try {
            const { parts } = await getAllParts();
            setRetrievedParts(parts);
        } catch (error) {
            console.log(error);
        }
    }

    const [groupedSpecs, setGroupedSpecs] = useState([]);

    const handleGetCompatibilitySpecs = async () => {
        try {
            const { specs } = await getCompatibilitySpecs(type);
            const specsGrouped = specs.reduce((groups, spec) => {
                const { part_type_from, part_type_to, attribute_from, attribute_to, spec_id } = spec;

                if(!groups[part_type_from]) {
                    groups[part_type_from] = [];
                }

                if(!groups[part_type_from][part_type_to]) {
                    groups[part_type_from][part_type_to] = [];
                }

                groups[part_type_from][part_type_to].push({ 
                    spec_id,
                    attribute_from, 
                    attribute_to 
                });
                return groups;
            }, {});
            setGroupedSpecs(specsGrouped);
            console.log(specsGrouped);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(showConfigure === true) {
            handleGetParts();
        }

        if(action === 'Specifications'){
            handleGetCompatibilitySpecs();
        }
    }, [showConfigure]);

    const handleConfigPart = (partName, config) => {
        setPartName(partName);
        setShowPart(true);
        setShowConfigure(false);
        setConfigType(config);
    }

    const handleEditPart = (partName, partTo, partId, config) => {
        setPartName(partName);
        setShowPart(true);
        setShowConfigure(false);
        setConfigType(config);
        setConfigPartId(partId);
        setCurrentPartFrom(partName);
        setCurrentPartTo(partTo);
    }

    const exitConfigPart = () => {
        setShowPart(false);
        setShowConfigure(true);
    }
    
    return (
        <>
            <Part
                show={showPart}
                showPart={showPart}
                setShowPart={setShowPart}
                partName={partName}
                onHide={() => exitConfigPart()}
                action={action}
                type={type}
                configType={configType}
                setConfigType={setConfigType}
                configPartId={configPartId}
                showConfigure={showConfigure}
                setShowConfigure={setShowConfigure}
                currentPartFrom={currentPartFrom}
                currentPartTo={currentPartTo}
            />
            <Modal
                show={true}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='compatibility-modal'
                centered
                onHide={onHide}
                backdrop="static"
                keyboard={false}
                {...props}
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    {bikeTypeName} {action}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content">
                    <div className="header">
                        <h4>Centered Modal</h4>
                        <p>Determine which specifications are compatible with each other and will be used to compare the parts for the Bike Upgrader.</p>
                        <p>Click the Add buttons below to add specifications.</p>
                        <p>To edit the specifications, click a specification.</p>
                    </div>
                    <div className="parts">
                        {retrievedParts.map((part, index) => (
                            <div key={index} className='part'>
                                <button onClick={() => handleConfigPart(part.part_name, 'Add')}>Add {part.part_name}</button>
                            </div>
                        ))}
                    </div>
                    {action === 'Specifications' &&
                        <div className="specs-list">
                            {Object.keys(groupedSpecs).map((partTypeFrom, index) => (
                                <div key={index} className="spec">
                                    <p>{partTypeFrom}</p>
                                    <div className="spec-groups">
                                        {Object.keys(groupedSpecs[partTypeFrom]).map((partTypeTo, innerIndex) => (
                                            <div key={innerIndex} className="spec-group">
                                                <p>{partTypeTo}</p>
                                                {groupedSpecs[partTypeFrom][partTypeTo].map((spec, specIndex) => (
                                                    <div key={specIndex} className='spec-name'>
                                                        <p onClick={() => handleEditPart(partTypeFrom, partTypeTo, spec.spec_id, 'Edit')}>
                                                            {spec.attribute_from.replace(/([_])/g, ' ')} &rarr; {spec.attribute_to.replace(/([_])/g, ' ')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
               
            </Modal.Body>
            </Modal>
        </>
    )
}

export default Configure