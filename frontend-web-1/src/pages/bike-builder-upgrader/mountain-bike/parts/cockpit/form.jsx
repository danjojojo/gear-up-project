import React, { useState, useEffect, useContext } from "react";
import exit from "../../../../../assets/icons/exit.png";
import edit from "../../../../../assets/icons/edit.png";
import cancel from "../../../../../assets/icons/cancel.png";
import del from "../../../../../assets/icons/delete.png";
import restore from "../../../../../assets/icons/restore.png";
import ImageUploadButton from "../../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../../utility/imageUtils";
import { AuthContext } from "../../../../../context/auth-context";
import { updateCockpitItem, archiveCockpitItem, restoreCockpitItem, deleteCockpitItem } from "../../../../../services/bbuService";
import ImagePreviewModal from "../../../../../components/image-preview-modal/image-preview";
import './cockpit.scss';
import { Modal, Button } from 'react-bootstrap';

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing, functionKey, setFunctionKey, setShowResponseModal }) => {
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

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [handlebarError, setHandlebarError] = useState('');
    const [headsetTypeError, setHeadsetTypeError] = useState('');

    const [handlebarIsCorrect, setHandlebarIsCorrect] = useState(false);
    const [headsetIsCorrect, setHeadsetIsCorrect] = useState(false);

    function ConfirmModal({ onHide, onConfirm, ...props }) {
        return (
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={onHide}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {functionKey === 'archive' &&
                            'Delete item?'
                        }
                        {functionKey === 'delete' &&
                            'Delete this item?'
                        }
                        {functionKey === 'restore' &&
                            'Restore item?'
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {functionKey === 'archive' &&
                        <p>If you archive this part, it will not be shown in your Bike Builder and Bike Upgrader. Archived parts will be stored and can be restored in the Archived tab in this page.</p>
                    }
                    {functionKey === 'delete' &&
                        <p>If you delete this part, you won't be able to restore it.</p>
                    }
                    {functionKey === 'restore' &&
                        <p>If you restore this part, it can be used again in your Bike Builder and Bike Upgrader. You will also be able to edit its details.</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        onHide();
                        if (functionKey === "delete") onConfirm();
                    }}>
                        {(functionKey === "archive" || functionKey === "restore") ? "Cancel" : "Confirm"}
                    </Button>
                    <Button variant={functionKey === 'delete' || functionKey === 'archive' ? "danger" : "primary"} onClick={() => {
                        onHide();
                        if (functionKey === "archive" || functionKey === "restore") onConfirm();
                    }}>
                        {(functionKey === "archive" || functionKey === "restore") ? "Confirm" : "Cancel"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

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

        if (!handlebarIsCorrect || !headsetIsCorrect) return;

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
        setShowResponseModal(true);

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
            setShowConfirmModal(false);
            setShowResponseModal(true);

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
            setShowConfirmModal(false);
            setShowResponseModal(true);

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
            setShowConfirmModal(false);
            setShowResponseModal(true);

            refreshWaitlist();
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("An error occurred while deleting the item");
        }
    }

    function handleConfirmModal() {
        switch (functionKey) {
            case 'archive':
                handleArchiveItem(selectedItem.cockpit_id);
                break;
            case 'delete':
                handleDeleteItem(selectedItem.cockpit_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.cockpit_id);
                break;
            default:
                break;
        }
    }

    function handleBarCorrect() {
        // handlebar clamp diameter must be same as stem clamp diameter
        if (handlebarClampDiameter === stemClampDiameter) {
            setHandlebarError('');
            return setHandlebarIsCorrect(true);
        } else {
            setHandlebarError('Handlebar clamp diameter must be the same as stem clamp diameter');
            return setHandlebarIsCorrect(false);
        }
    }

    function headsetTypeCorrect() {
        // if headset type is tapered, headset upper diameter must be smaller than headset lower diameter
        // if headset type is non tapered, headset upper diameter must be equal to headset lower diameter
        if (headsetType === 'Tapered' && headsetUpperDiameter < headsetLowerDiameter) {
            setHeadsetTypeError('');
            return setHeadsetIsCorrect(true);
        }

        if (headsetType === 'Non Tapered' && headsetUpperDiameter === headsetLowerDiameter) {
            setHeadsetTypeError('');
            return setHeadsetIsCorrect(true);
        }

        if (headsetType === 'Tapered' && headsetUpperDiameter >= headsetLowerDiameter) {
            setHeadsetTypeError('Headset upper diameter must be smaller than headset lower diameter');
            return setHeadsetIsCorrect(false);
        }

        if (headsetType === 'Non Tapered' && headsetUpperDiameter !== headsetLowerDiameter) {
            setHeadsetTypeError('Headset upper diameter must be equal to headset lower diameter');
            return setHeadsetIsCorrect(false);
        }
    }

    useEffect(() => {
        handleBarCorrect();
        headsetTypeCorrect();
    }, [handlebarClampDiameter, stemClampDiameter, headsetType, headsetUpperDiameter, headsetLowerDiameter]);


    return (
        <form className="form-content" onSubmit={(e) => {
            handleSubmit(e);
            setFunctionKey('edit');
        }}>
            <ConfirmModal
                show={showConfirmModal}
                onHide={() => {
                    setShowConfirmModal(false);
                }}
                onConfirm={handleConfirmModal}
            />
            <div className="container-1 d-flex">
                <h4>Specifications</h4>
                <div className="btns">
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
                                onClick={() => {
                                    setShowConfirmModal(true);
                                    setFunctionKey('restore');
                                }}
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
                        {userRole === 'admin' && showArchived && (
                            <img
                                src={del}
                                alt="Delete"
                                className="del-icon"
                                onClick={() => {
                                    setShowConfirmModal(true);
                                    setFunctionKey('delete');
                                }}
                            />
                        )}
                        {userRole === 'admin' && !showArchived && (
                            <img
                                src={del}
                                alt="Archive"
                                className="archive-icon"
                                onClick={() => {
                                    setShowConfirmModal(true);
                                    setFunctionKey('archive');
                                }}
                            />
                        )}
                    </div>
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
                <ImageUploadButton onFileSelect={handleFileSelect} part={'cockpit'} />
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
                <textarea
                    type="text"
                    id="item-description-cockpit"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                ></textarea>
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
                    <option value="680mm">680mm</option>
                    <option value="700mm">700mm</option>
                    <option value="720mm">720mm</option>
                    <option value="760mm">760mm</option>
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
                    <option value="25.4mm">25.4mm</option>
                    <option value="31.8mm">31.8mm</option>
                    <option value="35mm">35mm</option>
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
                    <option value="25.4mm">25.4mm</option>
                    <option value="31.8mm">31.8mm</option>
                    <option value="35mm">35mm</option>
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
                    <option value="60mm">60mm</option>
                    <option value="70mm">70mm</option>
                    <option value="80mm">80mm</option>
                    <option value="90mm">90mm</option>
                    <option value="100mm">100mm</option>
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
                    <option value="Non Tapered">Non Tapered</option>
                    <option value="Tapered">Tapered</option>
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
                    <option value="49mm">49mm</option>
                    <option value="55mm">55mm</option>
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

            {(handlebarError || headsetTypeError) &&
                <div className="error-message">
                    <p>{handlebarError}</p>
                    <p>{headsetTypeError}</p>
                </div>}

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