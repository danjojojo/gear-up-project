import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addFrame } from '../../../services/waitlistService';

const FrameForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [purpose, setPurpose] = useState('');
    const [frameSize, setFrameSize] = useState('');
    const [headTubeType, setHeadTubeType] = useState('');
    const [htUpperDiameter, setHtUpperDiameter] = useState('');
    const [htLowerDiameter, setHtLowerDiameter] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [axleType, setAxleType] = useState('');
    const [axleDiameter, setAxleDiameter] = useState('');
    const [bottomBracketType, setBottomBracketType] = useState('');
    const [bottomBracketWidth, setBottomBracketWidth] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [maxTireWidth, setMaxTireWidth] = useState('');
    const [material, setMaterial] = useState('');
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
        formData.append('purpose', purpose);
        formData.append('frame_size', frameSize);
        formData.append('head_tube_type', headTubeType);
        formData.append('head_tube_upper_diameter', htUpperDiameter);
        formData.append('head_tube_lower_diameter', htLowerDiameter);
        formData.append('seatpost_diameter', seatpostDiameter);
        formData.append('axle_type', axleType);
        formData.append('axle_diameter', axleDiameter);
        formData.append('bottom_bracket_type', bottomBracketType);
        formData.append('bottom_bracket_width', bottomBracketWidth);
        formData.append('rotor_size', rotorSize);
        formData.append('max_tire_width', maxTireWidth);
        formData.append('material', material);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addFrame(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setPurpose("");
            setFrameSize('');
            setHeadTubeType('');
            setHtUpperDiameter('');
            setHtLowerDiameter('');
            setSeatpostDiameter('');
            setAxleType('');
            setAxleDiameter('');
            setBottomBracketType('');
            setBottomBracketWidth('');
            setRotorSize('');
            setMaxTireWidth('');
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
                        onClick={() => deleteItem(waitlistItemID)}/>
                </div>
            </div>

            <ImageUploadButton onFileSelect={handleFileSelect} />

            <div className="input-container form-group">
                <label htmlFor="item-name-frame">Name</label>
                <input
                    type="text"
                    id="item-name-frame"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-frame">Price</label>
                <input
                    type="text"
                    id="item-price-frame"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-frame">Description</label>
                <input
                    type="text"
                    id="item-description-frame"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Purpose</div>
                <select
                    className="dropdown"
                    id="purpose"
                    name="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                >
                    <option value="">Select Purpose</option>
                    <option value="Cross-country (XC)">Cross-country (XC)</option>
                    <option value="Enduro">Enduro</option>
                    <option value="Downhill (DH)">Downhill (DH)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Size</div>
                <select
                    className="dropdown"
                    id="frame-size"
                    name="frameSize"
                    value={frameSize}
                    onChange={(e) => setFrameSize(e.target.value)}
                    required
                >
                    <option value="">Select Size</option>
                    <option value='26"'>26"</option>
                    <option value='27.5"'>27.5"</option>
                    <option value='29"'>29"</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Head Tube Type</div>
                <select
                    className="dropdown"
                    id="head-tube-type"
                    name="headTubeType"
                    value={headTubeType}
                    onChange={(e) => setHeadTubeType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Non Tapered">Non Tapered</option>
                    <option value="Tapered">Tapered</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Head Tube Upper Diameter</div>
                <select
                    className="dropdown"
                    id="ht-upper-diameter"
                    name="htUpperDiameter"
                    value={htUpperDiameter}
                    onChange={(e) => setHtUpperDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value="34mm">34mm</option>
                    <option value="44mm">44mm</option>
                    <option value="49mm">49mm</option>
                    <option value="55mm">55mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Head Tube Lower Diameter</div>
                <select
                    className="dropdown"
                    id="ht-lower-diameter"
                    name="htLowerDiameter"
                    value={htLowerDiameter}
                    onChange={(e) => setHtLowerDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value="34mm">34mm</option>
                    <option value="44mm">44mm</option>
                    <option value="55mm">55mm</option>
                    <option value="56mm">56mm</option>
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
                    <option value="27.2 mm">27.2 mm</option>
                    <option value="30.9 mm">30.9 mm</option>
                    <option value="31.6 mm">31.6 mm</option>
                    <option value="34.9 mm">34.9 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Axle Type</div>
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
                <div className="title">Frame Axle Diameter</div>
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
                    <option value="12mm (Thru-Axle)">12mm (Thru-Axle)</option>
                    <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                    <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Bottom Bracket Type</div>
                <select
                    className="dropdown"
                    id="bottom-bracket-type"
                    name="bottomBracketType"
                    value={bottomBracketType}
                    onChange={(e) => setBottomBracketType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="BSA (Threaded)">BSA (Threaded)</option>
                    <option value="Press-Fit (PF30, BB86, BB92)">Press-Fit (PF30, BB86, BB92)</option>
                    <option value="BB30">BB30</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Bottom Bracket Width</div>
                <select
                    className="dropdown"
                    id="bottom-bracket-Width"
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
                <div className="title">Frame Rotor Size</div>
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
                <div className="title">Frame Max Tire Width</div>
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

            <div className="input-container form-group">
                <label htmlFor="item-material-frame">Material</label>
                <input
                    type="text"
                    id="item-material-frame"
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
    );
};

export default FrameForm;