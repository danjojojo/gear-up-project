import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import './part.scss'
import { useEffect } from 'react'
import {
    getAllParts,
    getPartSpecs,

    addUpgraderSpecForm,
    updateUpgraderSpecForm,
    deleteUpgraderSpecForm,
} from '../../../services/bbuService'

const Part = ({ 
    partName,
    showPart,
    setShowPart,
    showConfigure,
    setShowConfigure,
    onConfirm,
    type,
    action,
    configType,
    setConfigType,
    configPartId,
    currentPartFrom,
    currentPartTo,
    onHide,
    ...props
}) => {
    const operations = ['Equal', 'Match Index', 'Greater Than', 'Less Than', 'Greater Than or Equal', 'Less Than or Equal'];

    const independentPart = partName;
    const [independentSpecs, setIndependentSpecs] = useState([]);

    const [otherParts, setOtherParts] = useState([]);

    const [dependentPart, setDependentPart] = useState('');
    const [dependentSpecs, setDependentSpecs] = useState([]);

    const [independentSpec, setIndependentSpec] = useState('');
    const [dependentSpec, setDependentSpec] = useState('');
    const [operationSpec, setOperationSpec] = useState('');

    const handleGetOtherParts = async () => {
        try {
            const { parts } = await getAllParts();
            setOtherParts(parts.filter(part => part.part_name !== partName));

            if(currentPartTo) {
                 setDependentPart(currentPartTo)
                 return;
            }

            setDependentPart(prev => parts.filter(part => part.part_name !== partName)[0].part_name);
        } catch (error) {
            console.log("Error");
        }
    }

    const getIndependentSpecs = async () => {
        try {
            const { specs } = await getPartSpecs(independentPart, configType === "Add" ? 0 : configPartId);
            setIndependentSpecs(specs.filter(spec => spec.column_name));
            setIndependentSpec(prev => specs.filter(spec => spec.column_name)[0].column_name);
        } catch (error) {
            console.log("Error");
        }
    }

    const getDependentSpecs = async () => {
        try {
            const { specs } = await getPartSpecs(dependentPart, configType === "Add" ? 0 : configPartId);
            setDependentSpecs(specs.filter(spec => spec.column_name));
            setDependentSpec(prev => specs.filter(spec => spec.column_name)[0].column_name);
        } catch (error) {
            console.log("Error");
        }
    }

    useEffect(() => {
        if(showPart) getDependentSpecs();
    },[dependentPart]);

    useEffect(() => {
        if(showPart) {
            handleGetOtherParts();
            getIndependentSpecs();
            getDependentSpecs();
        }
        
    },[showPart]);

    const selectOtherParts = 
        <select className='form-select' onChange={(e) => setDependentPart(e.target.value)}>
            {otherParts.map((part, index) => {
                return (
                    <option key={index} value={part.part_name}>{part.part_name}</option>
                )
            })}
        </select>

    const selectOperations =
        <select className='form-select' onChange={(e) => setOperationSpec(e.target.value)}>
            {operations.map((operation, index) => {
                return (
                    <option key={index} value={operation}>{operation}</option>
                )
            })}
        </select>
    
    const selectIndependentSpecs =
        <select className='form-select' onChange={(e) => setIndependentSpec(e.target.value)}>
            {independentSpecs.map((spec, index) => {
                return (
                    <option key={index} value={spec.column_name}>{spec.column_name.replace(/([_])/g, ' ')}</option>
                )
            })}
        </select>

    const selectDependentSpecs =
        <select className='form-select' onChange={(e) => setDependentSpec(e.target.value)}>
            {dependentSpecs.map((spec, index) => {
                return (
                    <option key={index} value={spec.column_name}>{spec.column_name.replace(/([_])/g, ' ')}</option>
                )
            })}
        </select>

    const handleAddSpec = async () => {
        switch(action){
            case 'Specifications':
                await addUpgraderSpecForm(
                    type,
                    independentPart,
                    dependentPart,
                    independentSpec,
                    dependentSpec
                );
                break;
            default:
                break;
        }
        setShowPart(false);
        setShowConfigure(true);
    }

    const handleUpdateSpec = async () => {
        switch(action){
            case 'Specifications':
                await updateUpgraderSpecForm(
                    configPartId,
                    dependentPart,
                    independentSpec,
                    dependentSpec
                );
                break;
            default:
                break;
        }
        setShowPart(false);
        setShowConfigure(true);
    }

    const handleDeleteSpec = async () => {
        switch(action){
            case 'Specifications':
                await deleteUpgraderSpecForm(configPartId);
                break;
            default:
                break;
        }
        setShowPart(false);
        setShowConfigure(true);
    }

    const handleSpec = () => {
        switch(configType){
            case 'Add':
                handleAddSpec();
                break;
            case 'Edit':
                handleUpdateSpec();
                break;
        }
    }

    return (
        <Modal
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            contentClassName='part-modal'
            centered
            {...props}
        >
        <Modal.Header>
            <Modal.Title>
                {configType} {partName} {action === 'Specifications' ? 'Specification' : action}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* <div className="guide">
                <p>Guide:</p>
                <ul> */}
                    {/* <li>Independent Part - The basis for the dependent part.</li> */}
                    {/* <li>Dependent Part - The part whose specifications will be based from the independent part.</li> */}
                    {/* <li>Independent Spec - The specification of the independent part you wish to set compatibility with the dependent spec.</li>
                    <li>Dependent Spec - The specification of the dependent part that is compatible to the independent part's specification.</li> */}
                    {/* <li>Specs (Independent and Dependent) - Specifications from independent and dependent part that where you will apply compatibility.</li>
                    {action === 'Compatibility' &&  <li>Operation - The operation that will be used to compare the independent and dependent specifications.</li>} */}
                {/* </ul>
            </div> */}
            <div className="table-comp">
                <table>
                    <thead>
                        <tr>
                            <th>Part A</th>
                            <th>Part B</th>
                            <th>{partName} Spec</th>
                            <th>{dependentPart} Spec</th>
                            {action === 'Compatibility' && <th>Operation</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{partName}</td>
                            <td>{selectOtherParts}</td>
                            <td>{selectIndependentSpecs}</td>
                            <td>{selectDependentSpecs}</td>
                            {action === 'Compatibility' && <td>{selectOperations}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleSpec} variant='primary'>{configType}</Button>
            {configType === 'Edit' && <Button onClick={handleDeleteSpec} variant='danger'>Delete</Button>}
            <Button onClick={onHide} variant='secondary'>Cancel</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default Part