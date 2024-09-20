import React, { useState, useEffect } from 'react';
import exit from "../../../assets/icons/exit.png";
import del from "../../../assets/icons/delete.png";
import ImageUploadButton from '../../../components/img-upload-button/img-upload-button';

const GroupsetForm = ({ itemName, itemPrice, onClose }) => {
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
                <label htmlFor="item-name-groupset">Name</label>
                <input
                    type="text"
                    id="item-name-groupset"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="item-price form-group">
                <label htmlFor="item-price-groupset">Price</label>
                <input
                    type="text"
                    id="item-price-groupset"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="item-description form-group">
                <label htmlFor="item-description-groupset">Description</label>
                <input
                    type="text"
                    id="item-description-groupset"
                    name="itemDescription"
                    placeholder="Enter item description"
                    required
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Chain Ring Speed</div>
                <select
                    className="dropdown"
                    id="chain-ring-speed"
                    name="chainRingSpeed"
                    required
                >
                    <option value="">Select Speed</option>
                    <option value="Single (1x)">Single (1x)</option>
                    <option value="Double (2x)">Double (2x)</option>
                    <option value="Triple (3x)">Triple (3x)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Crank Arm Length</div>
                <select
                    className="dropdown"
                    id="crank-arm-length"
                    name="crankArmLength"
                    required
                >
                    <option value="">Select Length</option>
                    <option value="165 mm">165 mm</option>
                    <option value="170 mm">170 mm</option>
                    <option value="175 mm">175 mm</option>
                    <option value="180 mm">180 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Front Derailleur Speed</div>
                <select
                    className="dropdown"
                    id="front-derailleur-speed"
                    name="frontDerailleurSpeed"
                    required
                >
                    <option value="">Select Speed</option>
                    <option value="2-speed">2-speed</option>
                    <option value="3-speed">3-speed</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rear Derailleur Speed</div>
                <select
                    className="dropdown"
                    id="rear-derailleur-speed"
                    name="rearDerailleurSpeed"
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
                <div className="title">Cassette Type</div>
                <select
                    className="dropdown"
                    id="cassette-type"
                    name="cassetteType"
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Cassette">Cassette</option>
                    <option value="Threaded Freewheel">Threaded Freewheel</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Cassette Speed</div>
                <select
                    className="dropdown"
                    id="cassette-speed"
                    name="cassetteSpeed"
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
                <div className="title">Chain Speed</div>
                <select
                    className="dropdown"
                    id="chain-speed"
                    name="chainrSpeed"
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
                <div className="title">Brake Type</div>
                <select
                    className="dropdown"
                    id="brake-type"
                    name="brakeType"
                    required
                >
                    <option value="">Select Type</option>
                    <option value="Mechanical Disc">Mechanical Disc</option>
                    <option value="Hydraulic Disc">Hydraulic Disc</option>
                    <option value="Rim Brake">Rim Brake</option>
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

            <div className="item-material form-group">
                <label htmlFor="item-material-groupset">Material</label>
                <input
                    type="text"
                    id="item-material-groupset"
                    name="itemMaterial"
                    placeholder="Enter item material"
                    required
                />
            </div>

            <div className="item-weight form-group">
                <label htmlFor="item-weight-groupset">Weight</label>
                <input
                    type="text"
                    id="item-weight-groupset"
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

export default GroupsetForm;