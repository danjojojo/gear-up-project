import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';
import { addStem } from '../../../services/waitlistService';

const StemForm = ({ waitlistItemID, itemID, itemName, itemPrice, onClose, refreshWaitlist, deleteItem }) => {
    // States management
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stemClampDiameter, setStemClampDiameter] = useState('');
    const [stemLength, setStemLength] = useState('');
    const [stemAngle, setStemAngle] = useState('');
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
        formData.append('stem_clamp_diameter', stemClampDiameter);
        formData.append('stem_length', stemLength);
        formData.append('stem_angle', stemAngle);
        formData.append('material', material);
        formData.append('weight', weight);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log('Form data being sent:', [...formData]);

        try {
            await addStem(formData);
            alert("Item added successfully");

            // Reset Form
            setDescription('');
            setStemClampDiameter('');
            setStemLength('');
            setStemAngle('');
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
                <label htmlFor="item-name-stem">Name</label>
                <input
                    type="text"
                    id="item-name-stem"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-stem">Price</label>
                <input
                    type="text"
                    id="item-price-stem"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-stem">Description</label>
                <input
                    type="text"
                    id="item-description-stem"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                />
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
                    <option value="Drop">Drop</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-material-stem">Material</label>
                <input
                    type="text"
                    id="item-material-stem"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-stem">Weight</label>
                <input
                    type="text"
                    id="item-weight-stem"
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

export default StemForm;