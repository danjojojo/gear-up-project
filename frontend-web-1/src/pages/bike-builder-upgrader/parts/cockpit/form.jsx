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
import { updateCockpitItem, archiveCockpitItem, restoreCockpitItem, deleteCockpitItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [handlebarLength, setHandlebarLength] = useState('');
    const [handlebarClampDiameter, setHandlebarClampDiameter] = useState('');
    const [handlebarType, setHandlebarType] = useState('');
    const [stemClampDiameter, setStemClampDiameter] = useState('');
    const [stemLength, setStemLength] = useState('');
    const [stemAngle, setStemAngle] = useState('');
    const [stemForkDiameter, setStemForkDiameter] = useState('');
    const [headsetType, setHeadsetType] = useState('');
    const [headsetCupType, setHeadsetCupType] = useState('');
    const [headsetUpperDiameter, setHeadsetUpperDiameter] = useState('');
    const [headsetLowerDiameter, setHeadsetLowerDiameter] = useState('');
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
            setHandlebarLength(selectedItem.handlebar_length || '');
            setHandlebarClampDiameter(selectedItem.handlebar_clamp_diameter || '');
            setHandlebarType(selectedItem.handlebar_type || '');
            setStemClampDiameter(selectedItem.stem_clamp_diameter || '');
            setStemLength(selectedItem.stem_length || '');
            setStemAngle(selectedItem.stem_angle || '');
            setStemForkDiameter(selectedItem.stem_fork_diameter || '');
            setHeadsetType(selectedItem.headset_type || '');
            setHeadsetCupType(selectedItem.headset_cup_type || '');
            setHeadsetUpperDiameter(selectedItem.headset_upper_diameter || '');
            setHeadsetLowerDiameter(selectedItem.headset_lower_diameter || '');
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
        updatedData.append('handlebar_length', handlebarLength);
        updatedData.append('handlebar_clamp_diameter', handlebarClampDiameter);
        updatedData.append('handlebar_type', handlebarType);
        updatedData.append('stem_clamp_diameter', stemClampDiameter);
        updatedData.append('stem_length', stemLength);
        updatedData.append('stem_angle', stemAngle);
        updatedData.append('stem_fork_diameter', stemForkDiameter);
        updatedData.append('headset_type', headsetType);
        updatedData.append('headset_cup_type', headsetCupType);
        updatedData.append('headset_upper_diameter', headsetUpperDiameter);
        updatedData.append('headset_lower_diameter', headsetLowerDiameter);
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

    // Archive item
    const handleArchiveItem = async (cockpit_id) => {
        try {
            await archiveCockpitItem(cockpit_id);
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
    const handleRestoreItem = async (cockpit_id) => {
        try {
            await restoreCockpitItem(cockpit_id);
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
    const handleDeleteItem = async (cockpit_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteCockpitItem(cockpit_id);
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
                            onClick={() => handleRestoreItem(selectedItem.cockpit_id)}
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
                            onClick={userRole === 'admin' ? () => handleDeleteItem(selectedItem.cockpit_id) : null}
                            style={{ opacity: userRole === 'admin' ? 1 : 0.5, cursor: userRole === 'admin' ? 'pointer' : 'not-allowed' }} // Adjust appearance based on role
                        />
                    ) : (
                        <img
                            src={archive}
                            alt="Archive"
                            className="archive-icon"
                            onClick={() => handleArchiveItem(selectedItem.cockpit_id)}
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
                <div className="title">Stem - Fork Diameter</div>
                <select
                    className="dropdown"
                    id="stem-fork-diameter"
                    name="stemForkDiameter"
                    value={stemForkDiameter}
                    onChange={(e) => setStemForkDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Diameter</option>
                    <option value='1 1/8"'>1 1/8"</option>
                    <option value='1 1/4"'>1 1/4"</option>
                    <option value='1.5"'>1.5"</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Type</div>
                <select
                    className="dropdown"
                    id="headset-type"
                    name="headsetType"
                    value={headsetType}
                    onChange={(e) => setHeadsetType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Tapered">Tapered</option>
                    <option value="Non-tapered">Non-tapered</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Headset Cup Type</div>
                <select
                    className="dropdown"
                    id="headset-cup-type"
                    name="headsetCupType"
                    value={headsetCupType}
                    onChange={(e) => setHeadsetCupType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Integrated">Integrated</option>
                    <option value="Non-integrated">Non-integrated</option>
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
                    <option value="44mm">44mm</option>
                    <option value="55mm">55mm</option>
                    <option value="56mm">56mm</option>
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
                    <option value="44mm">44mm</option>
                    <option value="55mm">55mm</option>
                    <option value="56mm">56mm</option>
                </select>
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