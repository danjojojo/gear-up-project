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
import { updateHubsItem, archiveHubsItem, restoreHubsItem, deleteHubsItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [hubType, setHubType] = useState('');
    const [hubSpeed, setHubSpeed] = useState('');
    const [hubHoles, setHubHoles] = useState('');
    const [axleType, setAxleType] = useState('');
    const [rotorType, setRotorType] = useState('');
    const [material, setMaterial] = useState('');
    const [weight, setWeight] = useState('');
    const [itemImage, setItemImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const { userRole } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
            setHubType(selectedItem.hub_type || '');
            setHubSpeed(selectedItem.hub_speed || '');
            setHubHoles(selectedItem.hub_holes || '');
            setAxleType(selectedItem.axle_type || '');
            setRotorType(selectedItem.rotor_type || '');
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
        updatedData.append('hub_type', hubType);
        updatedData.append('hub_speed', hubSpeed);
        updatedData.append('hub_holes', hubHoles);
        updatedData.append('axle_type', axleType);
        updatedData.append('rotor_type', rotorType);
        updatedData.append('material', material);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateHubsItem(selectedItem.hub_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.hub_id === selectedItem.hub_id ? updatedItem : item
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
    const handleArchiveItem = async (hub_id) => {
        try {
            await archiveHubsItem(hub_id);
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
    const handleRestoreItem = async (hub_id) => {
        try {
            await restoreHubsItem(hub_id);
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
    const handleDeleteItem = async (hub_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteHubsItem(hub_id);
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
                            onClick={() => handleRestoreItem(selectedItem.hub_id)}
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
                            onClick={userRole === 'admin' ? () => handleDeleteItem(selectedItem.hub_id) : null}
                            style={{ opacity: userRole === 'admin' ? 1 : 0.5, cursor: userRole === 'admin' ? 'pointer' : 'not-allowed' }} // Adjust appearance based on role
                        />
                    ) : (
                        <img
                            src={archive}
                            alt="Archive"
                            className="archive-icon"
                            onClick={() => handleArchiveItem(selectedItem.hub_id)}
                        />
                    )}
                </div>
            </div>

            {!isEditing ? (
                itemImage ? (
                    <div className="item-image-container" onClick={handleOpenModal}>
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

            <ImagePreviewModal
                show={showModal}
                handleClose={handleCloseModal}
                src={itemImage}
            />

            <div className="input-container form-group">
                <label htmlFor="item-name-hubs">Name</label>
                <input
                    type="text"
                    id="item-name-hubs"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-hubs">Price</label>
                <input
                    type="text"
                    id="item-price-hubs"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-hubs">Description</label>
                <input
                    type="text"
                    id="item-description-hubs"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                />
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

            <div className="input-container form-group">
                <label htmlFor="item-material-hubs">Material</label>
                <input
                    type="text"
                    id="item-material-hubs"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-hubs">Weight</label>
                <input
                    type="text"
                    id="item-weight-hubs"
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