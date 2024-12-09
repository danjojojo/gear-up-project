import "./bike-upgrader.scss"
import "./bike-upgrader-1.scss"
import React, { useState, useEffect } from "react";
import {
    getAnyItems
} from "../../services/bikeBuilderService";
import { Modal } from 'react-bootstrap';
import { useCompatibilitySpecs, formOptions } from "../../utils/compatibilityUtils";
import PartDetails from "./part-details";
import backbutton from "../../assets/icons/back-button.png";

const BikeUpgrader = () => {
    const ownedPartsSelection = [
        'Frame',
        'Fork',
        'Groupset',
        'Wheelset',
        'Seat',
        'Cockpit'
    ]

    const compatibilitySpecs = useCompatibilitySpecs('mtb');
    const [ownedParts, setOwnedParts] = useState([]);
    const [desiredPart, setDesiredPart] = useState('');
    const [dynamicFormFields, setDynamicFormFields] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [filterValues, setFilterValues] = useState({});
    const [items, setItems] = useState([]);
    const [findPartsClicked, setFindPartsClicked] = useState(false);

    const handleOwnedPartSelected = (ownedPartsValue) => {
        if (ownedParts.includes(ownedPartsValue)) {
            setOwnedParts(ownedParts.filter(part => part !== ownedPartsValue));
            setFormValues((prev) => {
                delete prev[ownedPartsValue.toLowerCase()];
                return prev;
            })
        } else {
            setOwnedParts([...ownedParts, ownedPartsValue]);
            setFormValues((prev) => {
                return prev;
            });
        }
        setFindPartsClicked(false);
        setItems([]);
    }

    const handleDesiredPartChange = (desiredPartValue) => {
        setDesiredPart(desiredPartValue);
        setFormValues({});
        setDynamicFormFields(['']);
        setFindPartsClicked(false);
        setItems([]);
    }

    // Nandito yung mga na columns and naset na specs ni user
    const handleSetSpecification = (field, value) => {
        Object.keys(formValues).map((part) => {
            if (formValues[part].hasOwnProperty(field.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase())) {
                setFormValues((prev) => ({
                    ...prev,
                    [part]: {
                        ...prev[part],
                        [field.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()]: value
                    }
                }))
            }
        });
    }

    useEffect(() => {
        console.log(formValues);
        console.log(filterValues);
    }, [formValues, filterValues]);

    const getFormFields = (ownedParts, desiredPart) => {
        if (ownedParts.length === 0 || desiredPart === '') return [];
        // set formFields as Set to avoid dupes sa fields na hahanapin below
        let formFields = new Array();
        ownedParts.forEach((part) => {
            // Check if part is a key in compatibilitySpecs
            // Check if desiredPart is a property of the key in compatibilitySpecs
            if (!formValues[part]) {
                setFormValues((prev) => ({
                    ...prev,
                    [part]: {}
                }));
            }

            if (compatibilitySpecs[part] && compatibilitySpecs[part][desiredPart]) {
                // If yes
                formFields.push(part);
                compatibilitySpecs[part][desiredPart].forEach((field) => {
                    // Add the values of the desiredPart property to formFields
                    // Sample: compatibilitySpecs.frame.fork = ['purpose', 'frameSize', bla bla bla]
                    // Check if field is already in formFields
                    formFields.push(field);
                    if (!formValues[part]) {
                        setFormValues((prev) => ({
                            ...prev,
                            [part]: {
                                ...prev[part],
                                [field.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()]: ''
                            }
                        }))
                    }
                });
            }
        });

        // convert formFields na Set to Array
        return formFields;
    };

    useEffect(() => {
        // When ownedParts and desiredPart changes, get the formFields
        const fields = getFormFields(ownedParts, desiredPart);
        setDynamicFormFields(fields);
        // if(ownedParts.length === 0 || desiredPart === '') setFormValues({});
    }, [ownedParts, desiredPart]);

    const renderDynamicForm = () => {
        // render the dynamic form fields
        // values will be yung fields na nakuha from getFormFields
        if (dynamicFormFields.length === 0)
            return (
                <div className="no-compatibility">
                    <i className="fa-regular fa-square-minus"></i>
                    <p>Parts selected are independent from each other.</p>
                </div>
            )

        return dynamicFormFields.map((field, index) => (
            // render yung mga fields as separate selects
            <div key={index} className="form-field">
                {/* yung formFields natin nakaset as camelCase */}
                {/* this regex will get the words that has capital letters (/([A-Z])/g) tapos magdadagdag siya ng space before it (' $1') */}
                {!ownedParts.includes(field) ?
                    <>
                        <label>{field.replace(/([_])/g, ' ')}</label>
                        <select defaultValue={'none'} onChange={(e) => handleSetSpecification(field, e.target.value)}>
                            <option value="none" disabled>Set specification</option>
                            {/* check if field is a property in formOptions */}
                            {formOptions[field] && formOptions[field].map((option, idx) => (
                                // if so
                                // render yung values from that property as options
                                <option key={idx} value={idx + option}>{option}</option>
                            ))}
                        </select>
                    </>
                    : <h3 className="owned-part-name">{field}</h3>
                }
            </div>
        ));
    };

    const [loading, setLoading] = useState(false);

    const getParts = async (desiredPart, filterValues) => {
        // console.log(desiredPart, filterValues);
        // await getAnyItems(desiredPart, filterValues);
        setLoading(true);
        const { parts } = await getAnyItems(desiredPart, filterValues);
        setItems(parts);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    const handleFindParts = () => {
        // Reset the filter values
        setFilterValues({});
        let finalFilterValues = {};

        // Check if any part in formValues has an empty string, if so, show the modal and exit
        const hasEmptyValues = Object.keys(formValues).some(value =>
            Object.values(formValues[value]).includes('')
        );

        if (hasEmptyValues) {
            setShowModal(true);
            return; // Early exit to prevent further execution
        }

        // Proceed to build filter values if all fields are valid
        Object.keys(formValues).forEach((value) => {
            const reverseCompatibility = compatibilitySpecs[desiredPart][value];
            reverseCompatibility.forEach((reverseField, index) => {
                const key = reverseField.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                const originalValue = Object.values(formValues[value]);
                const filterValue = Object.values(formOptions[reverseField]);
                const filterValueByIndex = filterValue[originalValue[index].match(/^\d/)[0]];
                if (key === 'max_tire_width' || key === 'tire_width') {
                    // removed number from the strin
                    // get substring from index 1 to the end of originalValue[index]
                    finalFilterValues[key] = originalValue[index].substring(1);
                } else {
                    finalFilterValues[key] = filterValueByIndex;
                }
            });
        });

        // Call getParts only when there are no empty values
        getParts(desiredPart, finalFilterValues);
        setFindPartsClicked(true);
    };

    function FindPartsModalIncomplete(props) {
        return (
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Oops!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your set specifications are incomplete. Please fill out all fields to find parts.
                </Modal.Body>
            </Modal>
        );
    }

    const [showModal, setShowModal] = useState(false);
    const [showRightContainer, setShowRightContainer] = useState(false);

    return (
        <div className="bike-upgrader">
            <FindPartsModalIncomplete
                show={showModal}
                onHide={() => setShowModal(false)}
            />
            <div className={`left-container ${showRightContainer ? 'hidden' : ''}`}>
                <div className="row-1">
                    <div className="left">
                        <div className="top">
                            <h4>Your owned parts</h4>
                        </div>
                        <div className="owned-parts">
                            <div className="owned-parts-selection">
                                {ownedPartsSelection.map((part, index) => {
                                    return (
                                        <button type="button"
                                            className={ownedParts.includes(part.toLowerCase()) ? 'owned-part selected' : 'owned-part'}
                                            key={index}
                                            onClick={(e) => handleOwnedPartSelected((e.target.value).toLowerCase())}
                                            value={part.toLowerCase()}
                                            disabled={desiredPart === part.toLowerCase() ? true : false}
                                        >{part}
                                            {ownedParts.includes(part.toLowerCase()) && <span><i className="fa-solid fa-check" onClick={(e) => e.stopPropagation()}></i></span>}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h4>Part you're looking for</h4>
                        <div className="desired-part">
                            <div className="owned-parts-selection">
                                <select className={desiredPart && 'selected'} name="" id="" defaultValue={'select'} onChange={(e) => handleDesiredPartChange((e.target.value).toLowerCase())}>
                                    <option value="select" disabled>Select a desired bike part</option>
                                    {ownedPartsSelection.map((part, index) => {
                                        return (
                                            <option value={part} key={index}
                                                disabled={ownedParts.includes(part.toLowerCase()) ? true : false}
                                            >{part}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row-2">
                    <h4>Set your specifications</h4>
                    {ownedParts.length === 0 || desiredPart === '' ?
                        <div className="no-specs">
                            <i className="fa-solid fa-bicycle"></i>
                            <p>Select your owned parts and desired part to set your specifications.</p>
                        </div>
                        :
                        <div className="specs-container">
                            {renderDynamicForm()}
                        </div>
                    }
                </div>
                <div className="row-3">
                    <button
                        className="upgrade-part" onClick={() => {
                            handleFindParts();
                            setShowRightContainer(true);
                        }}
                        disabled={Object.keys(formValues).length === 0 || dynamicFormFields.length === 0 ? true : false}
                    >Find parts</button>
                </div>
            </div>
            <div className={`right-container ${showRightContainer ? '' : 'hidden'}`}>
                <h4>{desiredPart === '' ? 'Parts' : desiredPart + 's'}</h4>
                <div className="parts-container">
                    <button
                        className="close-button"
                        onClick={() => setShowRightContainer(false)} // Hide right container
                    >
                        <img src={backbutton} alt="back-button" />
                    </button>
                    <div className="parts">
                        {!findPartsClicked && items.length === 0 && < div className="specs-not-set">
                            <p>Enter your specifications and press <strong>Find Parts</strong>.</p>
                        </div>}
                        {!loading && findPartsClicked && items.length === 0 &&
                            <div className="specs-not-set">
                                <p>Sorry, we can't find any available parts for your bike's specifications.</p>
                            </div>
                        }
                        {!loading && findPartsClicked && items.length !== 0 && items.map((item, index) => {
                            return (
                                <div className="part" key={index}>
                                    <div className="part-image">
                                        {item.item_image ? (
                                            <img
                                                src={`data:image/jpeg;base64,${item.item_image}`}
                                                alt={item.item_name}
                                            />
                                        ) : (
                                            <>
                                                No image attached
                                            </>
                                        )}
                                    </div>

                                    <PartDetails item={item} partType={desiredPart}/>
                                </div>
                            )
                        })}
                        {loading && findPartsClicked &&
                            <div className="loading">
                                <i className="fa-solid fa-gear fa-spin"></i>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    );

};

export default BikeUpgrader;