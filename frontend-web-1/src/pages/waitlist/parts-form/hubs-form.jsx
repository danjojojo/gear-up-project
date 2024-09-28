import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addHubs } from '../../../services/waitlistService';

const HubsForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [hubType, setHubType] = useState('');
    const [hubSpeed, setHubSpeed] = useState('');
    const [hubHoles, setHubHoles] = useState('');
    const [axleType, setAxleType] = useState('');
    const [rotorType, setRotorType] = useState('');
    const [material, setMaterial] = useState('');
    const [weight, setWeight] = useState('');
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
        formData.append('hub_type', hubType);
        formData.append('hub_speed', hubSpeed);
        formData.append('hub_holes', hubHoles);
        formData.append('axle_type', axleType);
        formData.append('rotor_type', rotorType);
        formData.append('material', material);
        formData.append('weight', weight);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addHubs(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setHubType('');
            setHubSpeed('');
            setHubHoles('');
            setAxleType('');
            setRotorType('');
            setMaterial('');
            setWeight('');
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
                        className="del-icon" />
                </div>
            </div>

            <ImageUploadButton onFileSelect={handleFileSelect} />

            <div className="input-container form-group">
                <label htmlFor="item-name-hubs">Name</label>
                <input
                    type="text"
                    id="item-name-hubs"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-hubs">Price</label>
                <input
                    type="text"
                    id="item-price-hubs"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-hubs">Description</label>
                <input
                    type="text"
                    id="item-description-hubs"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Hub Type</div>
                <select
                    className="dropdown"
                    id="hub-type"
                    name="hubType"
                    value={hubType}
                    onChange={(e) => setHubType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Quick Release (QR)">Quick Release (QR)</option>
                    <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Hub Speed</div>
                <select
                    className="dropdown"
                    id="hub-speed"
                    name="hubSpeed"
                    value={hubSpeed}
                    onChange={(e) => setHubSpeed(e.target.value)}
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
                <div className="title">Axle Type</div>
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
                <div className="title">Rotor Type</div>
                <select
                    className="dropdown"
                    id="rotor-type"
                    name="rotorType"
                    value={rotorType}
                    onChange={(e) => setRotorType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="6-bolt">6-bolt</option>
                    <option value="Centerlock">Centerlock</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-material-hubs">Material</label>
                <input
                    type="text"
                    id="item-material-hubs"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-hubs">Weight</label>
                <input
                    type="text"
                    id="item-weight-hubs"
                    name="itemWeight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter item weight"
                    required
                />
            </div>

            <div className="submit-container">
                <button type="submit" className="submit-btn">
                    Add
                </button>
            </div>
        </form>
    );
};

export default HubsForm;