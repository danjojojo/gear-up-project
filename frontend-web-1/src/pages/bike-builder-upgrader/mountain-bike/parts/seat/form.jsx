import React, { useState, useEffect, useContext } from "react";
import exit from "../../../../../assets/icons/exit.png";
import edit from "../../../../../assets/icons/edit.png";
import cancel from "../../../../../assets/icons/cancel.png";
import del from "../../../../../assets/icons/delete.png";
import restore from "../../../../../assets/icons/restore.png";
import ImageUploadButton from "../../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../../utility/imageUtils";
import { AuthContext } from "../../../../../context/auth-context";
import { updateSeatItem, archiveSeatItem, restoreSeatItem, deleteSeatItem } from "../../../../../services/bbuService";
import ImagePreviewModal from "../../../../../components/image-preview-modal/image-preview";
import "./seat.scss";
import {Modal, Button} from 'react-bootstrap';

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing, functionKey, setFunctionKey, setShowResponseModal }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [seatpostLength, setSeatpostLength] = useState('');
    const [seatClampType, setSeatClampType] = useState('');
    const [saddleMaterial, setSaddleMaterial] = useState('');
    const [itemImage, setItemImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const { userRole } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

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
							if(functionKey === "delete") onConfirm();
					}}>
						{(functionKey === "archive" || functionKey === "restore") ? "Cancel" : "Confirm"}
					</Button>
					<Button variant={functionKey === 'delete' || functionKey === 'archive' ? "danger" : "primary"} onClick={() => {
							onHide();
							if(functionKey === "archive" || functionKey === "restore") onConfirm();
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
            setSeatpostDiameter(selectedItem.seatpost_diameter || '');
            setSeatpostLength(selectedItem.seatpost_length || '');
            setSeatClampType(selectedItem.seat_clamp_type || '');
            setSaddleMaterial(selectedItem.saddle_material || '');
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
        updatedData.append('saddle_material', saddleMaterial);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateSeatItem(selectedItem.seat_id, updatedData);
        setShowResponseModal(true);

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.seat_id === selectedItem.seat_id ? updatedItem : item
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
    const handleArchiveItem = async (seat_id) => {
        try {
            await archiveSeatItem(seat_id);
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
    const handleRestoreItem = async (seat_id) => {
        try {
            await restoreSeatItem(seat_id);
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
    const handleDeleteItem = async (seat_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteSeatItem(seat_id);
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

        function handleConfirmModal(){
        switch(functionKey){
            case 'archive':
                handleArchiveItem(selectedItem.seat_id);
                break;
            case 'delete':     
                handleDeleteItem(selectedItem.seat_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.seat_id);
                break;
            default:
                break;
        }
    }

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
                <ImageUploadButton onFileSelect={handleFileSelect} part={'seat'}/>
            )}

            <ImagePreviewModal
                show={showModal}
                handleClose={handleCloseModal}
                src={itemImage}
            />

            <div className="input-container form-group">
                <label htmlFor="item-name-seat">Name</label>
                <input
                    type="text"
                    id="item-name-seat"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-seat">Price</label>
                <input
                    type="text"
                    id="item-price-seat"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-seat">Description</label>
                <textarea
                    type="text"
                    id="item-description-seat"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                ></textarea>
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
                    <option value="27.2mm">27.2mm</option>
                    <option value="30.9mm">30.9mm</option>
                    <option value="31.6mm">31.6mm</option>
                    <option value="34.9mm">34.9mm</option>
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
                    <option value="300mm">300mm</option>
                    <option value="350mm">350mm</option>
                    <option value="400mm">400mm</option>
                    <option value="450mm">450mm</option>
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
                <div className="title">Saddle Material</div>
                <select
                    className="dropdown"
                    id="saddle-material"
                    name="saddleMaterial"
                    value={saddleMaterial}
                    onChange={(e) => setSaddleMaterial(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Material</option>
                    <option value="Leather">Leather</option>
                    <option value="Synthetic">Synthetic</option>
                    <option value="Gel">Gel</option>
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