import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addFork } from '../../../services/waitlistService';
import {Modal, Button} from 'react-bootstrap';

const ForkForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem, role, setShowDeleteModal, setShowResponseModal }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [forkSize, setForkSize] = useState('');
    const [forkTubeType, setForkTubeType] = useState('');
    const [ftUpperDiameter, setFtUpperDiameter] = useState('');
    const [ftLowerDiameter, setFtLowerDiameter] = useState('');
    const [forkTravel, setForkTravel] = useState('');
    const [axleType, setAxleType] = useState('');
    const [axleDiameter, setAxleDiameter] = useState('');
    const [suspensionType, setSuspensionType] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [maxTireWidth, setMaxTireWidth] = useState('');
    const [frontHubWidth, setFrontHubWidth] = useState('');
    const [material, setMaterial] = useState('');
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
        formData.append('fork_size', forkSize);
        formData.append('fork_tube_type', forkTubeType);
        formData.append('fork_tube_upper_diameter', ftUpperDiameter);
        formData.append('fork_tube_lower_diameter', ftLowerDiameter);
        formData.append('fork_travel', forkTravel);
        formData.append('axle_type', axleType);
        formData.append('axle_diameter', axleDiameter);
        formData.append('suspension_type', suspensionType);
        formData.append('rotor_size', rotorSize);
        formData.append('max_tire_width', maxTireWidth);
        formData.append('front_hub_width', frontHubWidth);
        formData.append('material', material);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addFork(formData);
            setShowConfirmModal(false);
            setShowResponseModal(true);

            // Reset Form
            setDescription('');
            setForkSize('');
            setForkTubeType('');
            setFtUpperDiameter('');
            setFtLowerDiameter('');
            setAxleType('');
            setAxleDiameter('');
            setSuspensionType('');
            setRotorSize('');
            setMaxTireWidth('');
            setFrontHubWidth('');
            setMaterial('');
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

                <ImageUploadButton onFileSelect={handleFileSelect} part={'fork'}/>

                <div className="input-container form-group">
                    <label htmlFor="item-name-fork">Name</label>
                    <input
                        type="text"
                        id="item-name-fork"
                        name="itemName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-price-fork">Price</label>
                    <input
                        type="text"
                        id="item-price-fork"
                        name="itemPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-description-fork">Description</label>
                    <textarea
                        id="item-description-fork"
                        name="itemDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter item description"
                        required
                    ></textarea>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Size</div>
                    <select
                        className="dropdown"
                        id="fork-size"
                        name="forkSize"
                        value={forkSize}
                        onChange={(e) => setForkSize(e.target.value)}
                        required
                    >
                        <option value="">Select Size</option>
                        <option value='26"'>26"</option>
                        <option value='27.5"'>27.5"</option>
                        <option value='29"'>29"</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Tube Type</div>
                    <select
                        className="dropdown"
                        id="fork-tube-type"
                        name="forkTubeType"
                        value={forkTubeType}
                        onChange={(e) => setForkTubeType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Non Tapered">Non Tapered</option>
                        <option value="Tapered">Tapered</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Tube Upper Diameter</div>
                    <select
                        className="dropdown"
                        id="ft-upper-diameter"
                        name="ftUpperDiameter"
                        value={ftUpperDiameter}
                        onChange={(e) => setFtUpperDiameter(e.target.value)}
                        required
                    >
                        <option value="">Select Diameter</option>
                        <option value='1 1/8"'>1 1/8"</option>
                        <option value='1 1/4"'>1 1/4"</option>
                        <option value='1.5"'>1.5"</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Tube Lower Diameter</div>
                    <select
                        className="dropdown"
                        id="ft-lower-diameter"
                        name="ftLowerDiameter"
                        value={ftLowerDiameter}
                        onChange={(e) => setFtLowerDiameter(e.target.value)}
                        required
                    >
                        <option value="">Select Diameter</option>
                        <option value='1 1/8"'>1 1/8"</option>
                        <option value='1 1/4"'>1 1/4"</option>
                        <option value='1.5"'>1.5"</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Travel</div>
                    <select
                        className="dropdown"
                        id="fork-travel"
                        name="forkTravel"
                        value={forkTravel}
                        onChange={(e) => setForkTravel(e.target.value)}
                        required
                    >
                        <option value="">Select Travel</option>
                        <option value="80mm to 120mm">80mm to 120mm</option>
                        <option value="120mm to 160mm">120mm to 160mm</option>
                        <option value="150mm to 180mm">150mm to 180mm</option>
                        <option value="180mm to 200mm">180mm to 200mm</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Axle Type</div>
                    <select
                        className="dropdown"
                        id="axle-type"
                        name="axleType"
                        value={axleType}
                        onChange={(e) => setAxleType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Quick Release (QR)">Quick Release (QR)</option>
                        <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Axle Diameter</div>
                    <select
                        className="dropdown"
                        id="axle-diameter"
                        name="axleDiameter"
                        value={axleDiameter}
                        onChange={(e) => setAxleDiameter(e.target.value)}
                        required
                    >
                        <option value="">Select Diameter</option>
                        <option value="9mm (QR)">9mm (QR)</option>
                        <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                        <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Suspension Type</div>
                    <select
                        className="dropdown"
                        id="suspension-type"
                        name="suspensionType"
                        value={suspensionType}
                        onChange={(e) => setSuspensionType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Air">Air</option>
                        <option value="Coil">Coil</option>
                        <option value="N/A (Rigid)">N/A (Rigid)</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Rotor Size</div>
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

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Fork Max Tire Width</div>
                    <select
                        className="dropdown"
                        id="max-tire-width"
                        name="maxTireWidth"
                        value={maxTireWidth}
                        onChange={(e) => setMaxTireWidth(e.target.value)}
                        required
                    >
                        <option value="">Select Width</option>
                        <option value='2.1'>2.1</option>
                        <option value='2.25'>2.25</option>
                        <option value='2.4'>2.4</option>
                        <option value='2.6'>2.6</option>
                        <option value='2.8'>2.8</option>
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

                <div className="input-container form-group">
                    <label htmlFor="item-material-fork">Material</label>
                    <input
                        type="text"
                        id="item-material-fork"
                        name="itemMaterial"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="Enter item material"
                        required
                    />
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

export default ForkForm;