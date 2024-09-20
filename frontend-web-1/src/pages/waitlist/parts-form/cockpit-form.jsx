import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';

const CockpitForm = ({ itemName, itemPrice, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    // Populate item name and price
    useEffect(() => {
        setName(itemName);
        setPrice(itemPrice);
    }, [itemName, itemPrice]);

    return (
        <form className="form-content">
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

            <ImageUploadButton />

            <div className="item-name form-group">
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

            <div className="item-price form-group">
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

            <div className="item-description form-group">
                <label htmlFor="item-description-cockpit">Description</label>
                <input
                    type="text"
                    id="item-description-cockpit"
                    name="itemDescription"
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
                    required
                >
                    <option value="">Select Length</option>
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
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Quick Release">Quick Release</option>
                    <option value="Bolt-On">Bolt-On</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Handle Bar Length</div>
                <select
                    className="dropdown"
                    id="handle-bar-length"
                    name="handleBarLength"
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
                <div className="title">Handle Bar Clamp Diameter</div>
                <select
                    className="dropdown"
                    id="handle-bar-clamp-diameter"
                    name="handleBarClampDiameter"
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value="25.4 mm">25.4 mm</option>
                    <option value="31.8 mm">31.8 mm</option>
                    <option value="35 mm">35 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Handle Bar Type</div>
                <select
                    className="dropdown"
                    id="handle-bar-type"
                    name="handleBarType"
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
                    required
                >
                    <option value="">Select Angle</option>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Fork Upper Diameter</div>
                <select
                    className="dropdown"
                    id="fork-upper-diameter"
                    name="forkUpperDiameter"
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
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Threadless">Threadless</option>
                    <option value="Integrated">Integrated</option>
                    <option value="Semi-Integrated">Semi-Integrated</option>
                    <option value="External Cup">External Cup</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Upper Diameter</div>
                <select
                    className="dropdown"
                    id="headset-upper-diameter"
                    name="headsetUpperDiameter"
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
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1 3/8" (34.9 mm)'>1 3/8" (34.9 mm)</option>
                </select>
            </div>

            <div className="item-material form-group">
                <label htmlFor="item-material-cockpit">Material</label>
                <input
                    type="text"
                    id="item-material-cockpit"
                    name="itemMaterial"
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="item-weight form-group">
                <label htmlFor="item-weight-cockpit">Weight</label>
                <input
                    type="text"
                    id="item-weight-cockpit"
                    name="itemWeight"
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

export default CockpitForm;