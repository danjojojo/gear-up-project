import React, { useState, useEffect } from "react";
import exit from "../../../../assets/icons/exit.png";
import edit from "../../../../assets/icons/edit.png";
import cancel from "../../../../assets/icons/cancel.png";
import del from "../../../../assets/icons/delete.png";
import ImageUploadButton from "../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../utility/imageUtils";
import { updateCockpitItem } from "../../../../services/bbuService";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [seatpostLength, setSeatpostLength] = useState('');
    const [seatClampType, setSeatClampType] = useState('');
    const [handlebarLength, setHandlebarLength] = useState('');
    const [handlebarClampDiameter, setHandlebarClampDiameter] = useState('');
    const [handlebarType, setHandlebarType] = useState('');
    const [stemClampDiameter, setStemClampDiameter] = useState('');
    const [stemLength, setStemLength] = useState('');
    const [stemAngle, setStemAngle] = useState('');
    const [forkUpperDiameter, setForkUpperDiameter] = useState('');
    const [headsetType, setHeadsetType] = useState('');
    const [headsetUpperDiameter, setHeadsetUpperDiameter] = useState('');
    const [headsetLowerDiameter, setHeadsetLowerDiameter] = useState('');
    const [headsetCupType, setHeadsetCupType] = useState('');
    const [stemMaterial, setStemMaterial] = useState('');
    const [handlebarMaterial, setHandlebarMaterial] = useState('');
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
            setSeatpostDiameter(selectedItem.seatpost_diameter || '');
            setSeatpostLength(selectedItem.seatpost_length || '');
            setSeatClampType(selectedItem.seat_clamp_type || '');
            setHandlebarLength(selectedItem.handlebar_length || '');
            setHandlebarClampDiameter(selectedItem.handlebar_clamp_diameter || '');
            setHandlebarType(selectedItem.handlebar_type || '');
            setStemClampDiameter(selectedItem.stem_clamp_diameter || '');
            setStemLength(selectedItem.stem_length || '');
            setStemAngle(selectedItem.stem_angle || '');
            setForkUpperDiameter(selectedItem.fork_upper_diameter || '');
            setHeadsetType(selectedItem.headset_type || '');
            setHeadsetUpperDiameter(selectedItem.headset_upper_diameter || '');
            setHeadsetLowerDiameter(selectedItem.headset_lower_diameter || '');
            setHeadsetCupType(selectedItem.headset_cup_type || '');
            setStemMaterial(selectedItem.stem_material || '');
            setHandlebarMaterial(selectedItem.handlebar_material || '');
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
        updatedData.append('seatpost_diameter', seatpostDiameter);
        updatedData.append('seatpost_length', seatpostLength);
        updatedData.append('seat_clamp_type', seatClampType);
        updatedData.append('handlebar_length', handlebarLength);
        updatedData.append('handlebar_clamp_diameter', handlebarClampDiameter);
        updatedData.append('handlebar_type', handlebarType);
        updatedData.append('stem_clamp_diameter', stemClampDiameter);
        updatedData.append('stem_length', stemLength);
        updatedData.append('stem_angle', stemAngle);
        updatedData.append('fork_upper_diameter', forkUpperDiameter);
        updatedData.append('headset_type', headsetType);
        updatedData.append('headset_upper_diameter', headsetUpperDiameter);
        updatedData.append('headset_lower_diameter', headsetLowerDiameter);
        updatedData.append('headset_cup_type', headsetCupType);
        updatedData.append('stem_material', stemMaterial);
        updatedData.append('handlebar_material', handlebarMaterial);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateCockpitItem(selectedItem.cockpit_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.cockpit_id === selectedItem.cockpit_id ? updatedItem : item
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
                    disabled={!isEditing}
                />
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
                    disabled={!isEditing}
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
                    value={seatpostLength}
                    onChange={(e) => setSeatpostLength(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={seatClampType}
                    onChange={(e) => setSeatClampType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Quick Release">Quick Release</option>
                    <option value="Bolt-On">Bolt-On</option>
                </select>
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    value={forkUpperDiameter}
                    onChange={(e) => setForkUpperDiameter(e.target.value)}
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
                <div className="title">Headset Type</div>
                <select
                    className="dropdown"
                    id="headset-type"
                    name="headsetCupType"
                    value={headsetType}
                    onChange={(e) => setHeadsetType(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={headsetUpperDiameter}
                    onChange={(e) => setHeadsetUpperDiameter(e.target.value)}
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
                <div className="title">Headset Lower Diameter</div>
                <select
                    className="dropdown"
                    id="headset-lower-diameter"
                    name="headsetLowerDiameter"
                    value={headsetLowerDiameter}
                    onChange={(e) => setHeadsetLowerDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Diameter</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1 3/8" (34.9 mm)'>1 3/8" (34.9 mm)</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="headset-cup-type">Headset Cup Type</label>
                <input
                    type="text"
                    id="headset-cup-type"
                    name="headsetCupType"
                    value={headsetCupType}
                    onChange={(e) => setHeadsetCupType(e.target.value)}
                    placeholder="Enter headset cup type"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="stem-material">Stem Material</label>
                <input
                    type="text"
                    id="stem-material"
                    name="stemMaterial"
                    value={stemMaterial}
                    onChange={(e) => setStemMaterial(e.target.value)}
                    placeholder="Enter stem material"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="handlebar-material">Handlebar Material</label>
                <input
                    type="text"
                    id="handlebar-material"
                    name="handlebarMaterial"
                    value={handlebarMaterial}
                    onChange={(e) => setHandlebarMaterial(e.target.value)}
                    placeholder="Enter handlebar material"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-cockpit">Weight</label>
                <input
                    type="text"
                    id="item-weight-cockpit"
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