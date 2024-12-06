import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addGroupset } from '../../../services/waitlistService';
import {Modal, Button} from 'react-bootstrap';

const GroupsetForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem, role, setShowDeleteModal, setShowResponseModal, retrievedBikeTypes }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [chainringSpeed, setChainringSpeed] = useState('');
    const [crankArmLength, setCrankArmLength] = useState('');
    const [frontDerailleurSpeed, setFrontDerailleurSpeed] = useState('');
    const [rearDerailleurSpeed, setRearDerailleurSpeed] = useState('');
    const [cassetteType, setCassetteType] = useState('');
    const [cassetteSpeed, setCassetteSpeed] = useState('');
    const [chainSpeed, setChainSpeed] = useState('');
    const [bottomBracketType, setBottomBracketType] = useState('');
    const [bottomBracketWidth, setBottomBracketWidth] = useState('');
    const [brakeType, setBrakeType] = useState('');
    const [rotorMountType, setRotorMountType] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [fdError, setFdError] = useState('');
    const [rdError, setRdError] = useState('');

    const [fdIsCorrect, setFdIsCorrect] = useState(false);
    const [rdIsCorrect, setRdIsCorrect] = useState(false);
    
    function ConfirmationModal({ onHide, onConfirm, ...props }) {
		return (
			<Modal
				{...props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton onClick={onHide}>
					<Modal.Title id="contained-modal-title-vcenter">
						Confirmation
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Do you confirm these specifications?
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => {
							onHide();
					}}>
						Cancel
					</Button>
					<Button variant="primary" onClick={() => {
							onConfirm();
						}}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

    // Populate item name and price
    useEffect(() => {
        setName(itemName);
        setPrice(itemPrice);
    }, [itemName, itemPrice]);

    const [bikeType, setBikeType] = useState('');

    // Submit part
    const handleSubmit = async () => {

        if(!fdIsCorrect || !rdIsCorrect) return;

        const formData = new FormData();
        formData.append('waitlist_item_id', waitlistItemID);
        formData.append('item_id', itemID);
        formData.append('description', description);
        formData.append('chainring_speed', chainringSpeed);
        formData.append('crank_arm_length', crankArmLength);
        formData.append('front_derailleur_speed', frontDerailleurSpeed);
        formData.append('rear_derailleur_speed', rearDerailleurSpeed);
        formData.append('cassette_type', cassetteType);
        formData.append('cassette_speed', cassetteSpeed);
        formData.append('chain_speed', chainSpeed);
        formData.append('bottom_bracket_type', bottomBracketType);
        formData.append('bottom_bracket_width', bottomBracketWidth);
        formData.append('brake_type', brakeType);
        formData.append('rotor_mount_type', rotorMountType);
        formData.append('rotor_size', rotorSize);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        formData.append('type', bikeType);

        console.log('Form data being sent:', [...formData]);

        try {
            await addGroupset(formData);
            setShowConfirmModal(false);
            setShowResponseModal(true);

            // Reset Form
            setDescription('');
            setChainringSpeed('');
            setCrankArmLength('');
            setFrontDerailleurSpeed('');
            setRearDerailleurSpeed('');
            setCassetteType('');
            setCassetteSpeed('');
            setChainSpeed('');
            setBottomBracketType('');
            setBottomBracketWidth('');
            setBrakeType('');
            setRotorMountType('');
            setRotorSize('');
            setSelectedFile(null);
            onClose();
            refreshWaitlist();

        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    // Select image file
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    function chainringSpeedCorrect(){
        // if chainring is 1x, front derailleur speed should be N/A
        if(chainringSpeed === "Single (1x)" && frontDerailleurSpeed !== "N/A (1x Chainring speed)"){
            setFdError("Front Derailleur Speed should be N/A (1x Chainring speed)");
            return setFdIsCorrect(false);
        } 
        // if chainring is 2x, front derailleur speed should be 2-speed
        if(chainringSpeed === "Double (2x)" && frontDerailleurSpeed !== "2-speed"){
            setFdError("Front Derailleur Speed should be 2-speed");
            return setFdIsCorrect(false);
        }

        // if chainring is 3x, front derailleur speed should be 3-speed
        if(chainringSpeed === "Triple (3x)" && frontDerailleurSpeed !== "3-speed"){
            setFdError("Front Derailleur Speed should be 3-speed");
            return setFdIsCorrect(false);
        }

        setFdError('');
        return setFdIsCorrect(true);
    }

    function cassetteSpeedCorrect(){
        // rear derailleur speed is 9-speed, cassette speed should be 9-speed, chain speed should be 9-speed
        if(cassetteSpeed !== rearDerailleurSpeed  || chainSpeed !== rearDerailleurSpeed ){
            setRdError(`Cassette Speed and Chain Speed should be ${rearDerailleurSpeed}`);
            return setRdIsCorrect(false);
        }
        setRdError('');
        return setRdIsCorrect(true);
    }

    useEffect(() => {
        chainringSpeedCorrect();
        cassetteSpeedCorrect();
    },[chainringSpeed, frontDerailleurSpeed, rearDerailleurSpeed, cassetteSpeed, chainSpeed]);

    return (
        <>
            <ConfirmationModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    handleSubmit();
                }}
            />
            <form className="form-content" onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission
                    setShowConfirmModal(true); // Show confirmation modal
                }}>
                <div className="container-1 d-flex">
                    <h4>Set Specifications</h4>
                    <div className="btns">
                        <div className="exit-btn">
                            <img
                                src={exit}
                                alt="Exit"
                                className="exit-icon"
                                onClick={onClose}
                            />
                        </div>
                        {role == 'admin' && <div className="del-btn">
                            <img src={del}
                                alt="Delete"
                                className="del-icon"
                                onClick={() => setShowDeleteModal(true)} />
                        </div>}
                    </div>
                </div>

                <ImageUploadButton onFileSelect={handleFileSelect} part={'groupset'}/>

                <div className="input-container form-group">
                    <label htmlFor="item-name-groupset">Name</label>
                    <input
                        type="text"
                        id="item-name-groupset"
                        name="itemName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-price-groupset">Price</label>
                    <input
                        type="text"
                        id="item-price-groupset"
                        name="itemPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-description-groupset">Description</label>
                    <textarea
                        id="item-description-groupset"
                        name="itemDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter item description"
                        required
                    ></textarea>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Bike Type</div>
                    <select
                        className="dropdown"
                        id="type"
                        name="type"
                        defaultValue=""
                        required
                        onChange={(e) => {
                            setBikeType(e.target.value)
                            console.log(e.target.value)
                        }}
                    >   
                        <option value="">Select Bike Type</option>
                        {retrievedBikeTypes.map((bikeType, index) => (
                            <option key={index} value={bikeType.bike_type_id}>
                                {bikeType.bike_type_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Chainring Speed</div>
                    <select
                        className="dropdown"
                        id="chainring-speed"
                        name="chainringSpeed"
                        value={chainringSpeed}
                        onChange={(e) => setChainringSpeed(e.target.value)}
                        required
                    >
                        <option value="">Select Speed</option>
                        <option value="Single (1x)">Single (1x)</option>
                        <option value="Double (2x)">Double (2x)</option>
                        <option value="Triple (3x)">Triple (3x)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Crank Arm Length</div>
                    <select
                        className="dropdown"
                        id="crank-arm-length"
                        name="crankArmLength"
                        value={crankArmLength}
                        onChange={(e) => setCrankArmLength(e.target.value)}
                        required
                    >
                        <option value="">Select Length</option>
                        <option value="165mm">165mm</option>
                        <option value="170mm">170mm</option>
                        <option value="175mm">175mm</option>
                        <option value="180mm">180mm</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Front Derailleur Speed</div>
                    <select
                        className="dropdown"
                        id="front-derailleur-speed"
                        name="frontDerailleurSpeed"
                        value={frontDerailleurSpeed}
                        onChange={(e) => setFrontDerailleurSpeed(e.target.value)}
                        required
                    >
                        <option value="">Select Speed</option>
                        <option value="2-speed">2-speed</option>
                        <option value="3-speed">3-speed</option>
                        <option value="N/A (1x Chainring speed)">N/A (1x Chainring speed)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rear Derailleur Speed</div>
                    <select
                        className="dropdown"
                        id="rear-derailleur-speed"
                        name="rearDerailleurSpeed"
                        value={rearDerailleurSpeed}
                        onChange={(e) => setRearDerailleurSpeed(e.target.value)}
                        required
                    >
                        <option value="">Select Speed</option>
                        <option value="8-speed">8-speed</option>
                        <option value="9-speed">9-speed</option>
                        <option value="10-speed">10-speed</option>
                        <option value="11-speed">11-speed</option>
                        <option value="12-speed">12-speed</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Cassette Type</div>
                    <select
                        className="dropdown"
                        id="cassette-type"
                        name="cassetteType"
                        value={cassetteType}
                        onChange={(e) => setCassetteType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Cassette">Cassette</option>
                        <option value="Threaded">Threaded</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Cassette Speed</div>
                    <select
                        className="dropdown"
                        id="cassette-speed"
                        name="cassetteSpeed"
                        value={cassetteSpeed}
                        onChange={(e) => setCassetteSpeed(e.target.value)}
                        required
                    >
                        <option value="">Select Speed</option>
                        <option value="8-speed">8-speed</option>
                        <option value="9-speed">9-speed</option>
                        <option value="10-speed">10-speed</option>
                        <option value="11-speed">11-speed</option>
                        <option value="12-speed">12-speed</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Chain Speed</div>
                    <select
                        className="dropdown"
                        id="chain-speed"
                        name="chainrSpeed"
                        value={chainSpeed}
                        onChange={(e) => setChainSpeed(e.target.value)}
                        required
                    >
                        <option value="">Select Speed</option>
                        <option value="8-speed">8-speed</option>
                        <option value="9-speed">9-speed</option>
                        <option value="10-speed">10-speed</option>
                        <option value="11-speed">11-speed</option>
                        <option value="12-speed">12-speed</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Bottom Bracket Type</div>
                    <select
                        className="dropdown"
                        id="bottom-bracket-type"
                        name="bottomBracketType"
                        value={bottomBracketType}
                        onChange={(e) => setBottomBracketType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Threaded (BSA)">Threaded (BSA)</option>
                        <option value="Press-Fit (PF30, BB86, BB92)">Press-Fit (PF30, BB86, BB92)</option>
                        <option value="BB30">BB30</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Bottom Bracket Width</div>
                    <select
                        className="dropdown"
                        id="bottom-bracket-width"
                        name="bottomBracketWidth"
                        value={bottomBracketWidth}
                        onChange={(e) => setBottomBracketWidth(e.target.value)}
                        required
                    >
                        <option value="">Select Width</option>
                        <option value="68mm">68mm</option>
                        <option value="73mm (MTB)">73mm (MTB)</option>
                        <option value="83mm (Downhill)">83mm (Downhill)</option>
                        <option value="86mm (Press-Fit)">86mm (Press-Fit)</option>
                        <option value="92mm (MTB)">92mm (MTB)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Brake Type</div>
                    <select
                        className="dropdown"
                        id="brake-type"
                        name="brakeType"
                        value={brakeType}
                        onChange={(e) => setBrakeType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Hydraulic">Hydraulic</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rotor Mount Type</div>
                    <select
                        className="dropdown"
                        id="rotor-mount-type"
                        name="rotorMountType"
                        value={rotorMountType}
                        onChange={(e) => setRotorMountType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="6-bolt">6-bolt</option>
                        <option value="Centerlock">Centerlock</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rotor Size</div>
                    <select
                        className="dropdown"
                        id="rotor-size"
                        name="rotorSize"
                        value={rotorSize}
                        onChange={(e) => setRotorSize(e.target.value)}
                        required
                    >
                        <option value="">Select Size</option>
                        <option value="160mm">160mm</option>
                        <option value="180mm">180mm</option>
                        <option value="203mm">203mm</option>
                    </select>
                </div>

                 {(fdError || rdError )&& 
                <div className="error-message">
                    <p>{fdError}</p>
                    <p>{rdError}</p>
                </div>}


                <div className="submit-container">
                    <button type="submit" className="submit-btn">
                        Add
                    </button>
                </div>
            </form>
        </>
    );
};

export default GroupsetForm;