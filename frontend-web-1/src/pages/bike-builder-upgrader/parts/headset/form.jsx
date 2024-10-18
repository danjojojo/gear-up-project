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
import { updateHeadsetItem, archiveHeadsetItem, restoreHeadsetItem, deleteHeadsetItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [headsetType, setHeadsetType] = useState('');
    const [headsetUpperDiameter, setHeadsetUpperDiameter] = useState('');
    const [headsetLowerDiameter, setHeadsetLowerDiameter] = useState('');
    const [headsetCupType, setHeadsetCupType] = useState('');
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
            setHeadsetType(selectedItem.headset_type || '');
            setHeadsetUpperDiameter(selectedItem.headset_upper_diameter || '');
            setHeadsetLowerDiameter(selectedItem.headset_lower_diameter || '');
            setHeadsetCupType(selectedItem.headset_cup_type || '');
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
        updatedData.append('headset_type', headsetType);
        updatedData.append('headset_upper_diameter', headsetUpperDiameter);
        updatedData.append('headset_lower_diameter', headsetLowerDiameter);
        updatedData.append('headset_cup_type', headsetCupType);
        updatedData.append('material', material);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateHeadsetItem(selectedItem.headset_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.headset_id === selectedItem.headset_id ? updatedItem : item
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
    const handleArchiveItem = async (headset_id) => {
        try {
            await archiveHeadsetItem(headset_id);
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
    const handleRestoreItem = async (headset_id) => {
        try {
            await restoreHeadsetItem(headset_id);
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
    const handleDeleteItem = async (headset_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteHeadsetItem(headset_id);
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
                            onClick={() => handleRestoreItem(selectedItem.headset_id)}
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
                            onClick={userRole === 'admin' ? () => handleDeleteItem(selectedItem.headset_id) : null}
                            style={{ opacity: userRole === 'admin' ? 1 : 0.5, cursor: userRole === 'admin' ? 'pointer' : 'not-allowed' }} // Adjust appearance based on role
                        />
                    ) : (
                        <img
                            src={archive}
                            alt="Archive"
                            className="archive-icon"
                            onClick={() => handleArchiveItem(selectedItem.headset_id)}
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
                <label htmlFor="item-name-headset">Name</label>
                <input
                    type="text"
                    id="item-name-headset"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-headset">Price</label>
                <input
                    type="text"
                    id="item-price-headset"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-headset">Description</label>
                <input
                    type="text"
                    id="item-description-headset"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                />
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
                    <option value="44 mm">44 mm</option>
                    <option value="49 mm">49 mm</option>
                    <option value="55 mm">55 mm</option>
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
                    <option value="44 mm">44 mm</option>
                    <option value="55 mm">55 mm</option>
                    <option value="56 mm">56 mm</option>
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
                <label htmlFor="item-material-headset">Material</label>
                <input
                    type="text"
                    id="item-material-headset"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-headset">Weight</label>
                <input
                    type="text"
                    id="item-weight-headset"
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