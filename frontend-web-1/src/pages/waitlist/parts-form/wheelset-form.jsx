import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addWheelset } from '../../../services/waitlistService';

const WheelsetForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [tireSize, setTireSize] = useState('');
    const [tireWidth, setTireWidth] = useState('');
    const [rimHoles, setRimHoles] = useState('');
    const [rimWidth, setRimWidth] = useState('');
    const [hubType, setHubType] = useState('');
    const [hubSpeed, setHubSpeed] = useState('');
    const [hubHoles, setHubHoles] = useState('');
    const [spokes, setSpokes] = useState('');
    const [axleType, setAxleType] = useState('');
    const [rotorType, setRotorType] = useState('');
    const [rotorSize, setRotorSize] = useState('');
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
        formData.append('tire_size', tireSize);
        formData.append('tire_width', tireWidth);
        formData.append('rim_holes', rimHoles);
        formData.append('rim_width', rimWidth);
        formData.append('hub_type', hubType);
        formData.append('hub_speed', hubSpeed);
        formData.append('hub_holes', hubHoles);
        formData.append('spokes', spokes);
        formData.append('axle_type', axleType);
        formData.append('rotor_type', rotorType);
        formData.append('rotor_size', rotorSize);
        formData.append('weight', weight);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addWheelset(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setTireSize('');
            setTireWidth('');
            setRimHoles('');
            setRimWidth('');
            setHubType('');
            setHubSpeed('');
            setHubHoles('');
            setSpokes('');
            setAxleType('');
            setRotorType('');
            setRotorSize('');
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

            <div className="item-name form-group">
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

            <div className="item-price form-group">
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

            <div className="item-description form-group">
                <label htmlFor="item-description-wheelset">Description</label>
                <input
                    type="text"
                    id="item-description-wheelset"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
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
                    <option value='2.1"'>2.1"</option>
                    <option value='2.25"'>2.25"</option>
                    <option value='2.3"'>2.3"</option>
                    <option value='2.4"'>2.4"</option>
                    <option value='2.6"'>2.6"</option>
                    <option value='2.8"'>2.8"</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rim Holes</div>
                <select
                    className="dropdown"
                    id="rim-holes"
                    name="rimHoles"
                    value={rimHoles}
                    onChange={(e) => setRimHoles(e.target.value)}
                    required
                >
                    <option value="">Select Holes</option>
                    <option value="28H">28H</option>
                    <option value="32H">32H</option>
                    <option value="36H">36H</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rim Width</div>
                <select
                    className="dropdown"
                    id="rim-width"
                    name="rimWidth"
                    value={rimWidth}
                    onChange={(e) => setRimWidth(e.target.value)}
                    required
                >
                    <option value="">Select Width</option>
                    <option value="20 mm">20 mm</option>
                    <option value="23 mm">23 mm</option>
                    <option value="25 mm">25 mm</option>
                    <option value="30 mm">30 mm</option>
                </select>
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
                <div className="title">Spokes</div>
                <select
                    className="dropdown"
                    id="spokes"
                    name="spokes"
                    value={spokes}
                    onChange={(e) => setSpokes(e.target.value)}
                    required
                >
                    <option value="">Select Spokes</option>
                    <option value="28">28</option>
                    <option value="32">32</option>
                    <option value="36">36</option>
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
                    <option value="160 mm">160 mm</option>
                    <option value="180 mm">180 mm</option>
                    <option value="203 mm">203 mm</option>
                </select>
            </div>

            <div className="item-weight form-group">
                <label htmlFor="item-weight-wheelset">Weight</label>
                <input
                    type="text"
                    id="item-weight-wheelset"
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

export default WheelsetForm;