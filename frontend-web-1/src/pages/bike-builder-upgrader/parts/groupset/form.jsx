import React, { useState, useEffect } from "react";
import exit from "../../../../assets/icons/exit.png";
import edit from "../../../../assets/icons/edit.png";
import cancel from "../../../../assets/icons/cancel.png";
import del from "../../../../assets/icons/delete.png";
import ImageUploadButton from "../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../utility/imageUtils";
import { updateGroupsetItem } from "../../../../services/bbuService";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [chainringSpeed, setChainringSpeed] = useState('');
    const [crankArmLength, setCrankArmLength] = useState('');
    const [frontDerailleurSpeed, setFrontDerailleurSpeed] = useState('');
    const [rearDerailleurSpeed, setRearDerailleurSpeed] = useState('');
    const [cassetteType, setCassetteType] = useState('');
    const [cassetteSpeed, setCassetteSpeed] = useState('');
    const [chainSpeed, setChainSpeed] = useState('');
    const [bottomBracketType, setBottomBracketType] = useState('');
    const [bbDiameter, setBbDiameter] = useState('');
    const [brakeType, setBrakeType] = useState('');
    const [axleType, setAxleType] = useState('');
    const [weight, setWeight] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [itemImage, setItemImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);

    // Populate fields when a new item is selected
    useEffect(() => {
        if (selectedItem) {
            const fileExtension = selectedItem.item_image && selectedItem.item_image.startsWith("data:image/png")
                ? "png"
                : "jpg";

            const imageBase64 =
                selectedItem.item_image && !selectedItem.item_image.startsWith("data:image/")
                    ? `data:image/${fileExtension};base64,${selectedItem.item_image}`
                    : selectedItem.item_image;

            const imageFile = imageBase64
                ? base64ToFile(imageBase64, `image.${fileExtension}`)
                : null;

            setName(selectedItem.item_name || '');
            setPrice(selectedItem.item_price || '');
            setDescription(selectedItem.description || '');
            setChainringSpeed(selectedItem.chainring_speed || '');
            setCrankArmLength(selectedItem.crank_arm_length || '');
            setFrontDerailleurSpeed(selectedItem.front_derailleur_speed || '');
            setRearDerailleurSpeed(selectedItem.rear_derailleur_speed || '');
            setCassetteType(selectedItem.cassette_type || '');
            setCassetteSpeed(selectedItem.cassette_speed || '');
            setChainSpeed(selectedItem.chain_speed || '');
            setBottomBracketType(selectedItem.bottom_bracket_type || '');
            setBbDiameter(selectedItem.bottom_bracket_diameter || '');
            setBrakeType(selectedItem.brake_type || '');
            setAxleType(selectedItem.axle_type || '');
            setWeight(selectedItem.weight || '');
            setItemImage(imageBase64);
            setOriginalItem({ ...selectedItem });

            if (imageFile) {
                handleFileSelect(imageFile);
            }
        }
    }, [selectedItem]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedData = new FormData();
        updatedData.append('description', description);
        updatedData.append('chainring_speed', chainringSpeed);
        updatedData.append('crank_arm_length', crankArmLength);
        updatedData.append('front_derailleur_speed', frontDerailleurSpeed);
        updatedData.append('rear_derailleur_speed', rearDerailleurSpeed);
        updatedData.append('cassette_type', cassetteType);
        updatedData.append('cassette_speed', cassetteSpeed);
        updatedData.append('chain_speed', chainSpeed);
        updatedData.append('bottom_bracket_type', bottomBracketType);
        updatedData.append('bottom_bracket_diameter', bbDiameter);
        updatedData.append('brake_type', brakeType);
        updatedData.append('axle_type', axleType);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateGroupsetItem(selectedItem.groupset_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.groupset_id === selectedItem.groupset_id ? updatedItem : item
            ),
        );

        refreshWaitlist();
        setIsEditing(false);
        onClose();
    };


    // Select image file
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    // Handle editing an item
    const handleEditClick = () => {
        setOriginalItem({ ...selectedItem });
        setIsEditing(true);
    };

    // Handle canceling the edit
    const handleCancelEdit = async () => {
        setSelectedItem(originalItem);
        setIsEditing(false);
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
                <div className="edit-btn">
                    {isEditing ? (
                        <img
                            src={cancel}
                            alt="Cancel"
                            className="cancel-icon"
                            onClick={handleCancelEdit}
                        />
                    ) : (
                        <img
                            src={edit}
                            alt="Edit"
                            className="edit-icon"
                            onClick={handleEditClick}
                        />
                    )}
                </div>
                <div className="del-btn">
                    <img
                        src={del}
                        alt="Delete"
                        className="del-icon" />
                </div>
            </div>

            {!isEditing ? (
                itemImage ? (
                    <div className="item-image-container">
                        <img
                            src={itemImage}
                            alt="Item"
                            className="item-image"
                        />
                    </div>
                ) : (
                    <div className="no-image-container">
                        No image attached
                    </div>
                )
            ) : (
                <ImageUploadButton onFileSelect={handleFileSelect} />
            )}

            <div className="input-container form-group">
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

            <div className="input-container form-group">
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

            <div className="input-container form-group">
                <label htmlFor="item-description-groupset">Description</label>
                <input
                    type="text"
                    id="item-description-groupset"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Chainring Speed</div>
                <select
                    className="dropdown"
                    id="chainring-speed"
                    name="chainringSpeed"
                    value={chainringSpeed}
                    onChange={(e) => setChainringSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={crankArmLength}
                    onChange={(e) => setCrankArmLength(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={frontDerailleurSpeed}
                    onChange={(e) => setFrontDerailleurSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={rearDerailleurSpeed}
                    onChange={(e) => setRearDerailleurSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={cassetteType}
                    onChange={(e) => setCassetteType(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={cassetteSpeed}
                    onChange={(e) => setCassetteSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={chainSpeed}
                    onChange={(e) => setChainSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={bottomBracketType}
                    onChange={(e) => setBottomBracketType(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={bbDiameter}
                    onChange={(e) => setBbDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={brakeType}
                    onChange={(e) => setBrakeType(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={axleType}
                    onChange={(e) => setAxleType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Quick Release (QR)">Quick Release (QR)</option>
                    <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-groupset">Weight</label>
                <input
                    type="text"
                    id="item-weight-groupset"
                    name="itemWeight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter item weight"
                    required
                    disabled={!isEditing}
                />
            </div>

            {isEditing && (
                <div className="submit-container">
                    <button type="submit" className="submit-btn">
                        Save
                    </button>
                </div>
            )}
        </form>
    )
}

export default Form;