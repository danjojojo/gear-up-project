import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';

const FrameForm = ({ itemName, itemPrice, onClose }) => {
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

            <div className="item-price form-group">
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

            <div className="item-description form-group">
                <label htmlFor="item-description-frame">Description</label>
                <input
                    type="text"
                    id="item-description-frame"
                    name="itemDescription"
                    placeholder="Enter item description"
                    required
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Size</div>
                <select
                    className="dropdown"
                    id="frame-size"
                    name="frameSize"
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
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Tapered">Tapered</option>
                    <option value="Straight">Straight</option>
                    <option value="Integrated">Integrated</option>
                    <option value="External">External</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Head Tube Upper Diameter</div>
                <select
                    className="dropdown"
                    id="ht-upper-diameter"
                    name="htUpperDiameter"
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value='1 1/8" (28.6 mm)'>1 1/8" (28.6 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Head Tube Lower Diameter</div>
                <select
                    className="dropdown"
                    id="ht-lower-diameter"
                    name="htLowerDiameter"
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1 3/8" (34.9 mm)'>1 3/8" (34.9 mm)</option>
                </select>
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
                <div className="title">Axle Width</div>
                <select
                    className="dropdown"
                    id="axle-width"
                    name="axleWidth"
                    required
                >
                    <option value="">Select Width</option>
                    <option value="135 mm">135 mm</option>
                    <option value="142 mm">142 mm</option>
                    <option value="148 mm (Boost)">148 mm (Boost)</option>
                    <option value="150 mm">150 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Bottom Bracket Type</div>
                <select
                    className="dropdown"
                    id="bottom-bracket-type"
                    name="bottomBracketType"
                    required
                >
                    <option value="">Select Type</option>
                    <option value="BSA (Threaded)">BSA (Threaded)</option>
                    <option value="Press Fit (PF30)">Press Fit (PF30)</option>
                    <option value="BB30">BB30</option>
                    <option value="BB92">BB92</option>
                    <option value="BB86">BB86</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Bottom Bracket Diameter</div>
                <select
                    className="dropdown"
                    id="bb-diameter"
                    name="bbDiameter"
                    required
                >
                    <option value="">Select Diameter</option>
                    <option value="24 mm">24 mm</option>
                    <option value="30 mm">30 mm</option>
                    <option value="41 mm">41 mm</option>
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

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Max Tire Width</div>
                <select
                    className="dropdown"
                    id="max-tire-width"
                    name="maxTireWidth"
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
                    required
                >
                    <option value="">Select Mount</option>
                    <option value="Post Mount">Post Mount</option>
                    <option value="Flat Mount">Flat Mount</option>
                    <option value="IS (International Standard)">IS (International Standard)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Cable Routing</div>
                <select
                    className="dropdown"
                    id="cable-routing"
                    name="cableRouting"
                    required
                >
                    <option value="">Select Routing</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                </select>
            </div>

            <div className="item-material form-group">
                <label htmlFor="item-material-frame">Material</label>
                <input
                    type="text"
                    id="item-material-frame"
                    name="itemMaterial"
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="item-weight form-group">
                <label htmlFor="item-weight-frame">Weight</label>
                <input
                    type="text"
                    id="item-weight-frame"
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

export default FrameForm;