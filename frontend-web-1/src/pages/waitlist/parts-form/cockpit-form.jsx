import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addCockpit } from '../../../services/waitlistService';

const CockpitForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [handlebarLength, setHandlebarLength] = useState('');
    const [handlebarClampDiameter, setHandlebarClampDiameter] = useState('');
    const [handlebarType, setHandlebarType] = useState('');
    const [stemClampDiameter, setStemClampDiameter] = useState('');
    const [stemLength, setStemLength] = useState('');
    const [stemAngle, setStemAngle] = useState('');
    const [stemForkDiameter, setStemForkDiameter] = useState('');
    const [headsetType, setHeadsetType] = useState('');
    const [headsetCupType, setHeadsetCupType] = useState('');
    const [headsetUpperDiameter, setHeadsetUpperDiameter] = useState('');
    const [headsetLowerDiameter, setHeadsetLowerDiameter] = useState('');
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
        formData.append('handlebar_length', handlebarLength);
        formData.append('handlebar_clamp_diameter', handlebarClampDiameter);
        formData.append('handlebar_type', handlebarType);
        formData.append('stem_clamp_diameter', stemClampDiameter);
        formData.append('stem_length', stemLength);
        formData.append('stem_angle', stemAngle);
        formData.append('stem_fork_diameter', stemForkDiameter);
        formData.append('headset_type', headsetType);
        formData.append('headset_cup_type', headsetCupType);
        formData.append('headset_upper_diameter', headsetUpperDiameter);
        formData.append('headset_lower_diameter', headsetLowerDiameter);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addCockpit(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setHandlebarLength('');
            setHandlebarClampDiameter('');
            setHandlebarType('');
            setStemClampDiameter('');
            setStemLength('');
            setStemAngle('');
            setStemForkDiameter('');
            setHeadsetType('');
            setHeadsetCupType('');
            setHeadsetUpperDiameter('');
            setHeadsetLowerDiameter('');
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
                <label htmlFor="item-name-cockpit">Name</label>
                <input
                    type="text"
                    id="item-name-cockpit"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-cockpit">Price</label>
                <input
                    type="text"
                    id="item-price-cockpit"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-cockpit">Description</label>
                <input
                    type="text"
                    id="item-description-cockpit"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Handlebar Length</div>
                <select
                    className="dropdown"
                    id="handlebar-length"
                    name="handlebarLength"
                    value={handlebarLength}
                    onChange={(e) => setHandlebarLength(e.target.value)}
                    required
                >
                    <option value="">Select Length</option>
                    <option value="680 mm">680 mm</option>
                    <option value="700 mm">700 mm</option>
                    <option value="720 mm">720 mm</option>
                    <option value="760 mm">760 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Handlebar Clamp Diameter</div>
                <select
                    className="dropdown"
                    id="handlebar-clamp-diameter"
                    name="handlebarClampDiameter"
                    value={handlebarClampDiameter}
                    onChange={(e) => setHandlebarClampDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value="25.4 mm">25.4 mm</option>
                    <option value="31.8 mm">31.8 mm</option>
                    <option value="35 mm">35 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Handlebar Type</div>
                <select
                    className="dropdown"
                    id="handlebar-type"
                    name="handlebarType"
                    value={handlebarType}
                    onChange={(e) => setHandlebarType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Flat">Flat</option>
                    <option value="Riser">Riser</option>
                    <option value="Drop">Drop</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Stem Clamp Diameter</div>
                <select
                    className="dropdown"
                    id="stem-clamp-diameter"
                    name="stemClampDiameter"
                    value={stemClampDiameter}
                    onChange={(e) => setStemClampDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value="25.4 mm">25.4 mm</option>
                    <option value="31.8 mm">31.8 mm</option>
                    <option value="35 mm">35 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Stem Length</div>
                <select
                    className="dropdown"
                    id="stem-length"
                    name="stemLength"
                    value={stemLength}
                    onChange={(e) => setStemLength(e.target.value)}
                    required
                >
                    <option value="">Select Length</option>
                    <option value="60 mm">60 mm</option>
                    <option value="70 mm">70 mm</option>
                    <option value="80 mm">80 mm</option>
                    <option value="90 mm">90 mm</option>
                    <option value="100 mm">100 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Stem Angle</div>
                <select
                    className="dropdown"
                    id="stem-angle"
                    name="stemAngle"
                    value={stemAngle}
                    onChange={(e) => setStemAngle(e.target.value)}
                    required
                >
                    <option value="">Select Angle</option>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Stem Fork Diameter</div>
                <select
                    className="dropdown"
                    id="stem-fork-diameter"
                    name="stemForkDiameter"
                    value={stemForkDiameter}
                    onChange={(e) => setStemForkDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value='1 1/8" (28.6 mm)'>1 1/8" (28.6 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Type</div>
                <select
                    className="dropdown"
                    id="headset-type"
                    name="headsetType"
                    value={headsetType}
                    onChange={(e) => setHeadsetType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Tapered">Tapered</option>
                    <option value="Non-tapered">Non-tapered</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Cup Type</div>
                <select
                    className="dropdown"
                    id="headset-cup-type"
                    name="headsetCupType"
                    value={headsetCupType}
                    onChange={(e) => setHeadsetCupType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Integrated">Integrated</option>
                    <option value="Non-integrated">Non-integrated</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Upper Diameter</div>
                <select
                    className="dropdown"
                    id="headset-upper-diameter"
                    name="headsetUpperDiameter"
                    value={headsetUpperDiameter}
                    onChange={(e) => setHeadsetUpperDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value='1 1/8" (28.6 mm)'>1 1/8" (28.6 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Lower Diameter</div>
                <select
                    className="dropdown"
                    id="headset-lower-diameter"
                    name="headsetLowerDiameter"
                    value={headsetLowerDiameter}
                    onChange={(e) => setHeadsetLowerDiameter(e.target.value)}
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1 3/8" (34.9 mm)'>1 3/8" (34.9 mm)</option>
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

export default CockpitForm;