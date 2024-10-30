import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addWheelset } from '../../../services/waitlistService';
import {Modal, Button} from 'react-bootstrap';

const WheelsetForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem, role, setShowDeleteModal, setShowResponseModal }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [hubRotorType, setHubRotorType] = useState('');
    const [hubCassetteType, setHubCassetteType] = useState('');
    const [hubHoles, setHubHoles] = useState('');
    const [frontHubWidth, setFrontHubWidth] = useState('');
    const [frontHubAxleType, setFrontHubAxleType] = useState('');
    const [frontHubAxleDiameter, setFrontHubAxleDiameter] = useState('');
    const [rearHubWidth, setRearHubWidth] = useState('');
    const [rearHubAxleType, setRearHubAxleType] = useState('');
    const [rearHubAxleDiameter, setRearHubAxleDiameter] = useState('');
    const [rearHubSpeed, setRearHubSpeed] = useState('');
    const [tireSize, setTireSize] = useState('');
    const [tireWidth, setTireWidth] = useState('');
    const [rimSpokes, setRimSpokes] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
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

    // Submit part
    const handleSubmit = async () => {

        const formData = new FormData();
        formData.append('waitlist_item_id', waitlistItemID);
        formData.append('item_id', itemID);
        formData.append('description', description);
        formData.append('hub_rotor_type', hubRotorType);
        formData.append('hub_cassette_type', hubCassetteType);
        formData.append('front_hub_width', frontHubWidth);
        formData.append('front_hub_axle_type', frontHubAxleType);
        formData.append('front_hub_axle_diameter', frontHubAxleDiameter);
        formData.append('rear_hub_width', rearHubWidth);
        formData.append('rear_hub_axle_type', rearHubAxleType);
        formData.append('rear_hub_axle_diameter', rearHubAxleDiameter);
        formData.append('hub_holes', hubHoles);
        formData.append('rear_hub_speed', rearHubSpeed);
        formData.append('tire_size', tireSize);
        formData.append('tire_width', tireWidth);
        formData.append('rim_spokes', rimSpokes);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addWheelset(formData);
            setShowConfirmModal(false);
            setShowResponseModal(true);

            // Reset Form
            setDescription('');
            setHubRotorType('');
            setHubCassetteType('');
            setHubHoles('');
            setFrontHubWidth('');
            setFrontHubAxleType('');
            setFrontHubAxleDiameter('');
            setRearHubWidth('');
            setRearHubAxleType('');
            setRearHubAxleDiameter('');
            setRearHubSpeed('');
            setTireSize('');
            setTireWidth('');
            setRimSpokes('');
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

                <ImageUploadButton onFileSelect={handleFileSelect} part={'wheelset'}/>

                <div className="input-container form-group">
                    <label htmlFor="item-name-wheelset">Name</label>
                    <input
                        type="text"
                        id="item-name-wheelset"
                        name="itemName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-price-wheelset">Price</label>
                    <input
                        type="text"
                        id="item-price-wheelset"
                        name="itemPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-description-wheelset">Description</label>
                    <textarea
                        id="item-description-wheelset"
                        name="itemDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter item description"
                        required
                    ></textarea>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Hub - Rotor Type</div>
                    <select
                        className="dropdown"
                        id="hub-rotor-type"
                        name="hubRotorType"
                        value={hubRotorType}
                        onChange={(e) => setHubRotorType(e.target.value)}
                        required
                    >
                        <option value="">Select Holes</option>
                        <option value="6-bolt">6-bolt</option>
                        <option value="Centerlock">Centerlock</option>

                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Hub - Cassette Type</div>
                    <select
                        className="dropdown"
                        id="hub-cassette-ype"
                        name="hubCassetteType"
                        value={hubCassetteType}
                        onChange={(e) => setHubCassetteType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Cassette">Cassette</option>
                        <option value="Threaded">Threaded</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Hub Holes</div>
                    <select
                        className="dropdown"
                        id="hub-holes"
                        name="hubHoles"
                        value={hubHoles}
                        onChange={(e) => setHubHoles(e.target.value)}
                        required
                    >
                        <option value="">Select Holes</option>
                        <option value="28H">28H</option>
                        <option value="32H">32H</option>
                        <option value="36H">36H</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Front Hub Width</div>
                    <select
                        className="dropdown"
                        id="front-hub-width"
                        name="frontHubWidth"
                        value={frontHubWidth}
                        onChange={(e) => setFrontHubWidth(e.target.value)}
                        required
                    >
                        <option value="">Select Width</option>
                        <option value="100mm (Front)">100mm (Front)</option>
                        <option value="110mm (Boost Front)">110mm (Boost Front)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Front Hub - Axle Type</div>
                    <select
                        className="dropdown"
                        id="front-hub-axle-type"
                        name="frontHubAxleType"
                        value={frontHubAxleType}
                        onChange={(e) => setFrontHubAxleType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Quick Release (QR)">Quick Release (QR)</option>
                        <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Front Hub - Axle Diameter</div>
                    <select
                        className="dropdown"
                        id="front-hub-axle-diameter"
                        name="frontHubAxleDiameter"
                        value={frontHubAxleDiameter}
                        onChange={(e) => setFrontHubAxleDiameter(e.target.value)}
                        required
                    >
                        <option value="">Select Diameter</option>
                        <option value="9mm (QR)">9mm (QR)</option>
                        <option value="12mm (Thru-Axle)">12mm (Thru-Axle)</option>
                        <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                        <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rear Hub Width</div>
                    <select
                        className="dropdown"
                        id="rear-hub-width"
                        name="rearHubWidth"
                        value={rearHubWidth}
                        onChange={(e) => setRearHubWidth(e.target.value)}
                        required
                    >
                        <option value="">Select Width</option>
                        <option value="135mm (Rear)">135mm (Rear)</option>
                        <option value="142mm (Rear)">142mm (Rear)</option>
                        <option value="148mm (Boost Rear)">148mm (Boost Rear)</option>
                        <option value="150mm (Downhill)">150mm (Downhill)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rear Hub - Axle Type</div>
                    <select
                        className="dropdown"
                        id="rear-hub-axle-type"
                        name="rearHubAxleType"
                        value={rearHubAxleType}
                        onChange={(e) => setRearHubAxleType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Quick Release (QR)">Quick Release (QR)</option>
                        <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rear Hub - Axle Diameter</div>
                    <select
                        className="dropdown"
                        id="rear-hub-axle-diameter"
                        name="rearHubAxleDiameter"
                        value={rearHubAxleDiameter}
                        onChange={(e) => setRearHubAxleDiameter(e.target.value)}
                        required
                    >
                        <option value="">Select Diameter</option>
                        <option value="9mm (QR)">9mm (QR)</option>
                        <option value="12mm (Thru-Axle)">12mm (Thru-Axle)</option>
                        <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                        <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rear Hub Speed</div>
                    <select
                        className="dropdown"
                        id="rear-hub-speed"
                        name="rearHubSpeed"
                        value={rearHubSpeed}
                        onChange={(e) => setRearHubSpeed(e.target.value)}
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
                    <div className="title">Tire Size</div>
                    <select
                        className="dropdown"
                        id="tire-size"
                        name="tireSize"
                        value={tireSize}
                        onChange={(e) => setTireSize(e.target.value)}
                        required
                    >
                        <option value="">Select Size</option>
                        <option value='26"'>26"</option>
                        <option value='27.5"'>27.5"</option>
                        <option value='29"'>29"</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Tire Width</div>
                    <select
                        className="dropdown"
                        id="tire-width"
                        name="tireWidth"
                        value={tireWidth}
                        onChange={(e) => setTireWidth(e.target.value)}
                        required
                    >
                        <option value="">Select Width</option>
                        <option value='1.9'>1.9</option>
                        <option value='1.95'>1.95</option>
                        <option value='2.0'>2.0</option>
                        <option value='2.1'>2.1</option>
                        <option value='2.125'>2.125</option>
                        <option value='2.25'>2.25</option>
                        <option value='2.4'>2.4</option>
                        <option value='2.6'>2.6</option>
                        <option value='2.8'>2.8</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Rim Spokes</div>
                    <select
                        className="dropdown"
                        id="rim-spokes"
                        name="rimSpokes"
                        value={rimSpokes}
                        onChange={(e) => setRimSpokes(e.target.value)}
                        required
                    >
                        <option value="">Select Spokes</option>
                        <option value="28">28</option>
                        <option value="32">32</option>
                        <option value="36">36</option>
                    </select>
                </div>

                <div className="submit-container">
                    <button type="submit" className="submit-btn">
                        Add
                    </button>
                </div>
            </form>
        </>
    );
};

export default WheelsetForm;