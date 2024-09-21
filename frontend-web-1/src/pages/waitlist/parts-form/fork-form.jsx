import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addFork } from '../../../services/waitlistService';

const ForkForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [forkSize, setForkSize] = useState('');
    const [forkTubeType, setForkTubeType] = useState('');
    const [ftUpperDiameter, setFtUpperDiameter] = useState('');
    const [ftLowerDiameter, setFtLowerDiameter] = useState('');
    const [axleType, setAxleType] = useState('');
    const [axleWidth, setAxleWidth] = useState('');
    const [suspensionType, setSuspensionType] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [maxTireWidth, setMaxTireWidth] = useState('');
    const [brakeMount, setBrakeMount] = useState('');
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
        formData.append('fork_size', forkSize);
        formData.append('fork_tube_type', forkTubeType);
        formData.append('fork_tube_upper_diameter', ftUpperDiameter);
        formData.append('fork_tube_lower_diameter', ftLowerDiameter);
        formData.append('axle_type', axleType);
        formData.append('axle_width', axleWidth);
        formData.append('suspension_type', suspensionType);
        formData.append('rotor_size', rotorSize);
        formData.append('max_tire_width', maxTireWidth);
        formData.append('brake_mount', brakeMount);
        formData.append('material', material);
        formData.append('weight', weight);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addFork(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setForkSize('');
            setForkTubeType('');
            setFtUpperDiameter('');
            setFtLowerDiameter('');
            setAxleType('');
            setAxleWidth('');
            setSuspensionType('');
            setRotorSize('');
            setMaxTireWidth('');
            setBrakeMount('');
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

            <div className="item-name form-group">
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

            <div className="item-price form-group">
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

            <div className="item-description form-group">
                <label htmlFor="item-description-fork">Description</label>
                <input
                    type="text"
                    id="item-description-fork"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
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
                    <option value="Tapered">Tapered</option>
                    <option value="Straight">Straight</option>
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
                    <option value='1 1/8" (28.6 mm)'>1 1/8" (28.6 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
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
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1 3/8" (34.9 mm)'>1 3/8" (34.9 mm)</option>
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
                <div className="title">Axle Width</div>
                <select
                    className="dropdown"
                    id="axle-width"
                    name="axleWidth"
                    value={axleWidth}
                    onChange={(e) => setAxleWidth(e.target.value)}
                    required
                >
                    <option value="">Select Width</option>
                    <option value="100 mm (Standard)">100 mm (Standard)</option>
                    <option value="110 mm (Boost)">110 mm (Boost)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Suspension Type</div>
                <select
                    className="dropdown"
                    id="suspension-type"
                    name="suspensionType"
                    value={suspensionType}
                    onChange={(e) => setSuspensionType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Coil">Coil</option>
                    <option value="Air">Air</option>
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

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Max Tire Width</div>
                <select
                    className="dropdown"
                    id="max-tire-width"
                    name="maxTireWidth"
                    value={maxTireWidth}
                    onChange={(e) => setMaxTireWidth(e.target.value)}
                    required
                >
                    <option value="">Select Width</option>
                    <option value='2.1"'>2.1"</option>
                    <option value='2.25"'>2.25"</option>
                    <option value='2.4"'>2.4"</option>
                    <option value='2.6"'>2.6"</option>
                    <option value='2.8"'>2.8"</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Brake Mount</div>
                <select
                    className="dropdown"
                    id="brake-mount"
                    name="brakeMount"
                    value={brakeMount}
                    onChange={(e) => setBrakeMount(e.target.value)}
                    required
                >
                    <option value="">Select Mount</option>
                    <option value="Post Mount">Post Mount</option>
                    <option value="Flat Mount">Flat Mount</option>
                    <option value="IS (International Standard)">IS (International Standard)</option>
                </select>
            </div>

            <div className="item-material form-group">
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

            <div className="item-weight form-group">
                <label htmlFor="item-weight-fork">Weight</label>
                <input
                    type="text"
                    id="item-weight-fork"
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

export default ForkForm;