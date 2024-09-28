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
import { updateHandlebarItem, archiveHandlebarItem, restoreHandlebarItem, deleteHandlebarItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [handlebarLength, setHandlebarLength] = useState('');
    const [handlebarClampDiameter, setHandlebarClampDiameter] = useState('');
    const [handlebarType, setHandlebarType] = useState('');
    const [material, setMaterial] = useState('');
    const [weight, setWeight] = useState('');
    const [isEditing, setIsEditing] = useState(false);
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
        updatedData.append('handlebar_length', handlebarLength);
        updatedData.append('handlebar_clamp_diameter', handlebarClampDiameter);
        updatedData.append('handlebar_type', handlebarType);
        updatedData.append('material', material);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateHandlebarItem(selectedItem.handlebar_id, updatedData);
        alert("Item updated successfully");

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.handlebar_id === selectedItem.handlebar_id ? updatedItem : item
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
    const handleArchiveItem = async (handlebar_id) => {
        try {
            await archiveHandlebarItem(handlebar_id);
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
    const handleRestoreItem = async (handlebar_id) => {
        try {
            await restoreHandlebarItem(handlebar_id);
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
    const handleDeleteItem = async (handlebar_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteHandlebarItem(handlebar_id);
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
                            onClick={() => handleRestoreItem(selectedItem.handlebar_id)}
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
                            onClick={userRole === 'admin' ? () => handleDeleteItem(selectedItem.handlebar_id) : null}
                            style={{ opacity: userRole === 'admin' ? 1 : 0.5, cursor: userRole === 'admin' ? 'pointer' : 'not-allowed' }} // Adjust appearance based on role
                        />
                    ) : (
                        <img
                            src={archive}
                            alt="Archive"
                            className="archive-icon"
                            onClick={() => handleArchiveItem(selectedItem.handlebar_id)}
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
                <label htmlFor="item-name-handlebar">Name</label>
                <input
                    type="text"
                    id="item-name-handlebar"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-handlebar">Price</label>
                <input
                    type="text"
                    id="item-price-handlebar"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-handlebar">Description</label>
                <input
                    type="text"
                    id="item-description-handlebar"
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
                    <option value="">Select Diameter</option>
                    <option value="Flat">Flat</option>
                    <option value="Riser">Riser</option>
                    <option value="Drop">Drop</option>
                </select>
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-material-handlebar">Material</label>
                <input
                    type="text"
                    id="item-material-handlebar"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                    disabled={!isEditing}
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-weight-handlebar">Weight</label>
                <input
                    type="text"
                    id="item-weight-handlebar"
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