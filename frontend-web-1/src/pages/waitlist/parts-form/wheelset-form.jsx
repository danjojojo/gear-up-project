import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';

const WheelsetForm = ({ itemName, itemPrice, onClose }) => {
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
                    required
                >
                    <option value="">Select Size</option>
                    <option value="160 mm">160 mm</option>
                    <option value="180 mm">180 mm</option>
                    <option value="203 mm">203 mm</option>
                </select>
            </div>

            <div className="item-material form-group">
                <label htmlFor="item-material-wheelset">Material</label>
                <input
                    type="text"
                    id="item-material-wheelset"
                    name="itemMaterial"
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="item-weight form-group">
                <label htmlFor="item-weight-wheelset">Weight</label>
                <input
                    type="text"
                    id="item-weight-wheelset"
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

export default WheelsetForm;