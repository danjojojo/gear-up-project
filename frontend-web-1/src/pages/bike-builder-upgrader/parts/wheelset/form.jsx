import React, { useState, useEffect, useContext } from "react";
import exit from "../../../../assets/icons/exit.png";
import edit from "../../../../assets/icons/edit.png";
import cancel from "../../../../assets/icons/cancel.png";
import del from "../../../../assets/icons/delete.png";
import archive from "../../../../assets/icons/archive.png";
import restore from "../../../../assets/icons/restore.png";
import ImageUploadButton from "../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../utility/imageUtils";
import { AuthContext } from "../../../../context/auth-context";
import { updateWheelsetItem, archiveWheelsetItem, restoreWheelsetItem, deleteWheelsetItem } from "../../../../services/bbuService";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [tireSize, setTireSize] = useState('');
    const [tireWidth, setTireWidth] = useState('');
    const [rimHoles, setRimHoles] = useState('');
    const [rimWidth, setRimWidth] = useState('');
    const [hubType, setHubType] = useState('');
    const [hubSpeed, setHubSpeed] = useState('');
    const [hubHoles, setHubHoles] = useState('');
    const [spokes, setSpokes] = useState('');
    const [axleType, setAxleType] = useState('');
    const [rotorType, setRotorType] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [weight, setWeight] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [itemImage, setItemImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const { userRole } = useContext(AuthContext);

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
            setTireSize(selectedItem.tire_size || '');
            setTireWidth(selectedItem.tire_width || '');
            setRimHoles(selectedItem.rim_holes || '');
            setRimWidth(selectedItem.rim_width || '');
            setHubType(selectedItem.hub_type || '');
            setHubSpeed(selectedItem.hub_speed || '');
            setHubHoles(selectedItem.hub_holes || '');
            setSpokes(selectedItem.spokes || '');
            setAxleType(selectedItem.axle_type || '');
            setRotorType(selectedItem.rotor_type || '');
            setRotorSize(selectedItem.rotor_size || '');
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
        updatedData.append('tire_size', tireSize);
        updatedData.append('tire_width', tireWidth);
        updatedData.append('rim_holes', rimHoles);
        updatedData.append('rim_width', rimWidth);
        updatedData.append('hub_type', hubType);
        updatedData.append('hub_speed', hubSpeed);
        updatedData.append('hub_holes', hubHoles);
        updatedData.append('spokes', spokes);
        updatedData.append('axle_type', axleType);
        updatedData.append('rotor_type', rotorType);
        updatedData.append('rotor_size', rotorSize);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateWheelsetItem(selectedItem.wheelset_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.wheelset_id === selectedItem.wheelset_id ? updatedItem : item
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

    // Archive item
    const handleArchiveItem = async (wheelset_id) => {
        try {
            await archiveWheelsetItem(wheelset_id);
            alert("Item archived successfully");

            refreshWaitlist();
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error("Error archiving item:", error);
            alert("An error occurred while archiving the item");
        }
    }

    // Restore item
    const handleRestoreItem = async (wheelset_id) => {
        try {
            await restoreWheelsetItem(wheelset_id);
            alert("Item restored successfully");

            refreshWaitlist();
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error("Error restoring item:", error);
            alert("An error occurred while restoring the item");
        }
    }

    // Delete item
    const handleDeleteItem = async (wheelset_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteWheelsetItem(wheelset_id);
            alert("Item deleted successfully");

            refreshWaitlist();
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("An error occurred while deleting the item");
        }
    }


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
                    {showArchived ? (
                        <img
                            src={restore}
                            alt="Restore"
                            className="restore-icon"
                            onClick={() => handleRestoreItem(selectedItem.wheelset_id)}
                        />
                    ) : isEditing ? (
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
                    {showArchived ? (
                        <img
                            src={del}
                            alt="Delete"
                            className="del-icon"
                            onClick={userRole === 'admin' ? () => handleDeleteItem(selectedItem.wheelset_id) : null}
                            style={{ opacity: userRole === 'admin' ? 1 : 0.5, cursor: userRole === 'admin' ? 'pointer' : 'not-allowed' }} // Adjust appearance based on role
                        />
                    ) : (
                        <img
                            src={archive}
                            alt="Archive"
                            className="archive-icon"
                            onClick={() => handleArchiveItem(selectedItem.wheelset_id)}
                        />
                    )}
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

            <div className="input-container form-group">
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

            <div className="input-container form-group">
                <label htmlFor="item-description-wheelset">Description</label>
                <input
                    type="text"
                    id="item-description-wheelset"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Tire Size</div>
                <select
                    className="dropdown"
                    id="tire-size"
                    name="tireSize"
                    value={tireSize}
                    onChange={(e) => setTireSize(e.target.value)}
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
                <div className="title">Tire Width</div>
                <select
                    className="dropdown"
                    id="tire-width"
                    name="tireWidth"
                    value={tireWidth}
                    onChange={(e) => setTireWidth(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={rimHoles}
                    onChange={(e) => setRimHoles(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={rimWidth}
                    onChange={(e) => setRimWidth(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={hubType}
                    onChange={(e) => setHubType(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={hubSpeed}
                    onChange={(e) => setHubSpeed(e.target.value)}
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
                <div className="title">Hub Holes</div>
                <select
                    className="dropdown"
                    id="hub-holes"
                    name="hubHoles"
                    value={hubHoles}
                    onChange={(e) => setHubHoles(e.target.value)}
                    required
                    disabled={!isEditing}
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
                    value={spokes}
                    onChange={(e) => setSpokes(e.target.value)}
                    required
                    disabled={!isEditing}
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
                <div className="title">Rotor Type</div>
                <select
                    className="dropdown"
                    id="rotor-type"
                    name="rotorType"
                    value={rotorType}
                    onChange={(e) => setRotorType(e.target.value)}
                    required
                    disabled={!isEditing}
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

            <div className="input-container form-group">
                <label htmlFor="item-weight-wheelset">Weight</label>
                <input
                    type="text"
                    id="item-weight-wheelset"
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