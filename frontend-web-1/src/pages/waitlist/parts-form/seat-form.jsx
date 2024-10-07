import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addSeat } from '../../../services/waitlistService';

const SeatForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [seatpostLength, setSeatpostLength] = useState('');
    const [seatClampType, setSeatClampType] = useState('');
    const [saddleMaterial, setSaddleMaterial] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Populate item name and price
    useEffect(() => {
        setName(itemName);
        setPrice(itemPrice);
    }, [itemName, itemPrice]);

    // Submit part
    const handleSubmit = async (e) => {
        e.preventDefault();

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

        console.log('Form data being sent:', [...formData]);

        try {
            await addSeat(formData);
            alert("Item added successfully");

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
        <form className="form-content" onSubmit={handleSubmit}>
            <div className="container-1 d-flex">
                <div className="exit-btn">
                    <img
                        src={exit}
                        alt="Exit"
                        className="exit-icon"
                        onClick={onClose}
                    />
                </div>
                <div className="del-btn">
                    <img src={del}
                        alt="Delete"
                        className="del-icon"
                        onClick={() => deleteItem(waitlistItemID)} />
                </div>
            </div>

            <ImageUploadButton onFileSelect={handleFileSelect} />

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
                <input
                    type="text"
                    id="item-description-seat"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
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
                    <option value="27.2 mm">27.2 mm</option>
                    <option value="30.9 mm">30.9 mm</option>
                    <option value="31.6 mm">31.6 mm</option>
                    <option value="34.9 mm">34.9 mm</option>
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
                    <option value="300 mm">300 mm</option>
                    <option value="350 mm">350 mm</option>
                    <option value="400 mm">400 mm</option>
                    <option value="450 mm">450 mm</option>
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
    );
};

export default SeatForm;