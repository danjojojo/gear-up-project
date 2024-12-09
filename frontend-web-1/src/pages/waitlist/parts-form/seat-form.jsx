import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addSeat } from '../../../services/waitlistService';
import {Modal, Button} from 'react-bootstrap';

const SeatForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem, role, setShowDeleteModal, setShowResponseModal, retrievedBikeTypes}) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [seatpostLength, setSeatpostLength] = useState('');
    const [seatClampType, setSeatClampType] = useState('');
    const [saddleMaterial, setSaddleMaterial] = useState('');
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

    const [bikeType, setBikeType] = useState('');

    // Submit part
    const handleSubmit = async () => {

        const formData = new FormData();
        formData.append('waitlist_item_id', waitlistItemID);
        formData.append('item_id', itemID);
        formData.append('description', description);
        formData.append('seatpost_diameter', seatpostDiameter);
        formData.append('seatpost_length', seatpostLength);
        formData.append('seat_clamp_type', seatClampType);
        formData.append('saddle_material', saddleMaterial);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        formData.append('type', bikeType);

        try {
            await addSeat(formData);
            setShowConfirmModal(false);
            setShowResponseModal(true);

            // Reset Form
            setDescription('');
            setSeatpostDiameter('');
            setSeatpostLength('');
            setSeatClampType('');
            setSaddleMaterial('');
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

                <ImageUploadButton onFileSelect={handleFileSelect} part={'seat'}/>

                <div className="input-container form-group">
                    <label htmlFor="item-name-seat">Name</label>
                    <input
                        type="text"
                        id="item-name-seat"
                        name="itemName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-price-seat">Price</label>
                    <input
                        type="text"
                        id="item-price-seat"
                        name="itemPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled
                    />
                </div>

                <div className="input-container form-group">
                    <label htmlFor="item-description-seat">Description</label>
                    <textarea
                        type="text"
                        id="item-description-seat"
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
                    <div className="title">Seatpost Diameter</div>
                    <select
                        className="dropdown"
                        id="seatpost-diameter"
                        name="seatpostDiameter"
                        value={seatpostDiameter}
                        onChange={(e) => setSeatpostDiameter(e.target.value)}
                        required
                    >
                        <option value="">Select Diameter</option>
                        <option value="27.2mm">27.2mm</option>
                        <option value="30.9mm">30.9mm</option>
                        <option value="31.6mm">31.6mm</option>
                        <option value="34.9mm">34.9mm</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Seatpost Length</div>
                    <select
                        className="dropdown"
                        id="seatpost-length"
                        name="seatpostLength"
                        value={seatpostLength}
                        onChange={(e) => setSeatpostLength(e.target.value)}
                        required
                    >
                        <option value="">Select Length</option>
                        <option value="300mm">300mm</option>
                        <option value="350mm">350mm</option>
                        <option value="400mm">400mm</option>
                        <option value="450mm">450mm</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Seat Clamp Type</div>
                    <select
                        className="dropdown"
                        id="seat-clamp-type"
                        name="seatClampType"
                        value={seatClampType}
                        onChange={(e) => setSeatClampType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Quick Release">Quick Release</option>
                        <option value="Bolt-On">Bolt-On</option>
                    </select>
                </div>

                <div className="dropdown-container d-flex justify-content-between">
                    <div className="title">Saddle Material</div>
                    <select
                        className="dropdown"
                        id="saddle-material"
                        name="saddleMaterial"
                        value={saddleMaterial}
                        onChange={(e) => setSaddleMaterial(e.target.value)}
                        required
                    >
                        <option value="">Select Material</option>
                        <option value="Leather">Leather</option>
                        <option value="Synthetic">Synthetic</option>
                        <option value="Gel">Gel</option>
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

export default SeatForm;