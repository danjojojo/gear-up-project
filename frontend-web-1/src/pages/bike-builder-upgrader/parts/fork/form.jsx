import React, { useState, useEffect } from "react";
import exit from "../../../../assets/icons/exit.png";
import edit from "../../../../assets/icons/edit.png";
import cancel from "../../../../assets/icons/cancel.png";
import del from "../../../../assets/icons/delete.png";
import ImageUploadButton from "../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../utility/imageUtils";
import { updateForkItem } from "../../../../services/bbuService";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose }) => {
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
            setForkSize(selectedItem.fork_size || '');
            setForkTubeType(selectedItem.fork_tube_type || '');
            setFtUpperDiameter(selectedItem.fork_tube_upper_diameter || '');
            setFtLowerDiameter(selectedItem.fork_tube_lower_diameter || '');
            setAxleType(selectedItem.axle_type || '');
            setAxleWidth(selectedItem.axle_width || '');
            setSuspensionType(selectedItem.suspension_type || '');
            setRotorSize(selectedItem.rotor_size || '');
            setMaxTireWidth(selectedItem.max_tire_width || '');
            setBrakeMount(selectedItem.brake_mount || '');
            setMaterial(selectedItem.material || '');
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
        updatedData.append('fork_size', forkSize);
        updatedData.append('fork_tube_type', forkTubeType);
        updatedData.append('fork_tube_upper_diameter', ftUpperDiameter);
        updatedData.append('fork_tube_lower_diameter', ftLowerDiameter);
        updatedData.append('axle_type', axleType);
        updatedData.append('axle_width', axleWidth);
        updatedData.append('suspension_type', suspensionType);
        updatedData.append('rotor_size', rotorSize);
        updatedData.append('max_tire_width', maxTireWidth);
        updatedData.append('brake_mount', brakeMount);
        updatedData.append('material', material);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateForkItem(selectedItem.fork_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.fork_id === selectedItem.fork_id ? updatedItem : item
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

            <div className="input-container form-group">
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

            <div className="input-container form-group">
                <label htmlFor="item-description-fork">Description</label>
                <input
                    type="text"
                    id="item-description-fork"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                >
                    <option value="">Select Mount</option>
                    <option value="Post Mount">Post Mount</option>
                    <option value="Flat Mount">Flat Mount</option>
                    <option value="IS (International Standard)">IS (International Standard)</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-material-fork">Material</label>
                <input
                    type="text"
                    id="item-material-fork"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-fork">Weight</label>
                <input
                    type="text"
                    id="item-weight-fork"
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