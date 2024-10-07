import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addHandlebar } from '../../../services/waitlistService';

const HandlebarForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [handlebarLength, setHandlebarLength] = useState('');
    const [handlebarClampDiameter, setHandlebarClampDiameter] = useState('');
    const [handlebarType, setHandlebarType] = useState('');
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
        formData.append('handlebar_length', handlebarLength);
        formData.append('handlebar_clamp_diameter', handlebarClampDiameter);
        formData.append('handlebar_type', handlebarType);
        formData.append('material', material);
        formData.append('weight', weight);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addHandlebar(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setHandlebarLength('');
            setHandlebarClampDiameter('');
            setHandlebarType('');
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
                        className="del-icon"
                        onClick={() => deleteItem(waitlistItemID)} />
                </div>
            </div>

            <ImageUploadButton onFileSelect={handleFileSelect} />

            <div className="input-container form-group">
                <label htmlFor="item-name-handlebar">Name</label>
                <input
                    type="text"
                    id="item-name-handlebar"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-handlebar">Price</label>
                <input
                    type="text"
                    id="item-price-handlebar"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-handlebar">Description</label>
                <input
                    type="text"
                    id="item-description-handlebar"
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
                    <option value="">Select Diameter</option>
                    <option value="Flat">Flat</option>
                    <option value="Riser">Riser</option>
                    <option value="Drop">Drop</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-material-handlebar">Material</label>
                <input
                    type="text"
                    id="item-material-handlebar"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-handlebar">Weight</label>
                <input
                    type="text"
                    id="item-weight-handlebar"
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

export default HandlebarForm;