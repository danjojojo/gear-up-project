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
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";
import "./wheelset.scss";
import {Modal, Button} from 'react-bootstrap';

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing, functionKey, setFunctionKey, setShowResponseModal  }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [hubRotorType, setHubRotorType] = useState('');
    const [hubCassetteType, setHubCassetteType] = useState('');
    const [hubHoles, setHubHoles] = useState('');
    const [frontHubWidth, setFrontHubWidth] = useState('');
    const [frontHubAxleType, setFrontHubAxleType] = useState('');
    const [frontHubAxleDiameter, setFrontHubAxleDiameter] = useState('');
    const [rearHubWidth, setRearHubWidth] = useState('');
    const [rearHubAxleType, setRearHubAxleType] = useState('');
    const [rearHubAxleDiameter, setRearHubAxleDiameter] = useState('');
    const [rearHubSpeed, setRearHubSpeed] = useState('');
    const [tireSize, setTireSize] = useState('');
    const [tireWidth, setTireWidth] = useState('');
    const [rimSpokes, setRimSpokes] = useState('');
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
            setHubRotorType(selectedItem.hub_rotor_type || '');
            setHubCassetteType(selectedItem.hub_cassette_type || '');
            setHubHoles(selectedItem.hub_holes || '');
            setFrontHubWidth(selectedItem.front_hub_width || '');
            setFrontHubAxleType(selectedItem.front_hub_axle_type || '');
            setFrontHubAxleDiameter(selectedItem.front_hub_axle_diameter || '');
            setRearHubWidth(selectedItem.rear_hub_width || '');
            setRearHubAxleType(selectedItem.rear_hub_axle_type || '');
            setRearHubAxleDiameter(selectedItem.rear_hub_axle_diameter || '');
            setRearHubSpeed(selectedItem.rear_hub_speed || '');
            setTireSize(selectedItem.tire_size || '');
            setTireWidth(selectedItem.tire_width || '');
            setRimSpokes(selectedItem.rim_spokes || '');
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
        updatedData.append('hub_rotor_type', hubRotorType);
        updatedData.append('hub_cassette_type', hubCassetteType);
        updatedData.append('front_hub_width', frontHubWidth);
        updatedData.append('front_hub_axle_type', frontHubAxleType);
        updatedData.append('front_hub_axle_diameter', frontHubAxleDiameter);
        updatedData.append('rear_hub_width', rearHubWidth);
        updatedData.append('rear_hub_axle_type', rearHubAxleType);
        updatedData.append('rear_hub_axle_diameter', rearHubAxleDiameter);
        updatedData.append('hub_holes', hubHoles);
        updatedData.append('rear_hub_speed', rearHubSpeed);
        updatedData.append('tire_size', tireSize);
        updatedData.append('tire_width', tireWidth);
        updatedData.append('rim_spokes', rimSpokes);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateWheelsetItem(selectedItem.wheelset_id, updatedData);
        setShowResponseModal(true);

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
    const handleRestoreItem = async (wheelset_id) => {
        try {
            await restoreWheelsetItem(wheelset_id);
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
    const handleDeleteItem = async (wheelset_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteWheelsetItem(wheelset_id);
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
                handleArchiveItem(selectedItem.wheelset_id);
                break;
            case 'delete':     
                handleDeleteItem(selectedItem.wheelset_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.wheelset_id);
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
                <ImageUploadButton onFileSelect={handleFileSelect} part={'wheelset'}/>
            )}

            <ImagePreviewModal
                show={showModal}
                handleClose={handleCloseModal}
                src={itemImage}
            />

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
                <textarea
                    type="text"
                    id="item-description-wheelset"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                ></textarea>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Hub - Rotor Type</div>
                <select
                    className="dropdown"
                    id="hub-rotor-type"
                    name="hubRotorType"
                    value={hubRotorType}
                    onChange={(e) => setHubRotorType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Holes</option>
                    <option value="6-bolt">6-bolt</option>
                    <option value="Centerlock">Centerlock</option>

                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Hub - Cassette Type</div>
                <select
                    className="dropdown"
                    id="hub-cassette-ype"
                    name="hubCassetteType"
                    value={hubCassetteType}
                    onChange={(e) => setHubCassetteType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Cassette">Cassette</option>
                    <option value="Threaded">Threaded</option>
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
                <div className="title">Front Hub Width</div>
                <select
                    className="dropdown"
                    id="front-hub-width"
                    name="frontHubWidth"
                    value={frontHubWidth}
                    onChange={(e) => setFrontHubWidth(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Width</option>
                    <option value="100mm (Front)">100mm (Front)</option>
                    <option value="110mm (Boost Front)">110mm (Boost Front)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Front Hub - Axle Type</div>
                <select
                    className="dropdown"
                    id="front-hub-axle-type"
                    name="frontHubAxleType"
                    value={frontHubAxleType}
                    onChange={(e) => setFrontHubAxleType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Quick Release (QR)">Quick Release (QR)</option>
                    <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Front Hub - Axle Diameter</div>
                <select
                    className="dropdown"
                    id="front-hub-axle-diameter"
                    name="frontHubAxleDiameter"
                    value={frontHubAxleDiameter}
                    onChange={(e) => setFrontHubAxleDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Diameter</option>
                    <option value="9mm (QR)">9mm (QR)</option>
                    <option value="12mm (Thru-Axle)">12mm (Thru-Axle)</option>
                    <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                    <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rear Hub Width</div>
                <select
                    className="dropdown"
                    id="rear-hub-width"
                    name="rearHubWidth"
                    value={rearHubWidth}
                    onChange={(e) => setRearHubWidth(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Width</option>
                    <option value="135mm (Rear)">135mm (Rear)</option>
                    <option value="142mm (Rear)">142mm (Rear)</option>
                    <option value="148mm (Boost Rear)">148mm (Boost Rear)</option>
                    <option value="150mm (Downhill)">150mm (Downhill)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rear Hub - Axle Type</div>
                <select
                    className="dropdown"
                    id="rear-hub-axle-type"
                    name="rearHubAxleType"
                    value={rearHubAxleType}
                    onChange={(e) => setRearHubAxleType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Quick Release (QR)">Quick Release (QR)</option>
                    <option value="Thru-Axle (TA)">Thru-Axle (TA)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rear Hub - Axle Diameter</div>
                <select
                    className="dropdown"
                    id="rear-hub-axle-diameter"
                    name="rearHubAxleDiameter"
                    value={rearHubAxleDiameter}
                    onChange={(e) => setRearHubAxleDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Diameter</option>
                    <option value="9mm (QR)">9mm (QR)</option>
                    <option value="12mm (Thru-Axle)">12mm (Thru-Axle)</option>
                    <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                    <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rear Hub Speed</div>
                <select
                    className="dropdown"
                    id="rear-hub-speed"
                    name="rearHubSpeed"
                    value={rearHubSpeed}
                    onChange={(e) => setRearHubSpeed(e.target.value)}
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
                    <option value='1.9'>1.9</option>
                    <option value='1.95'>1.95</option>
                    <option value='2.0'>2.0</option>
                    <option value='2.1'>2.1</option>
                    <option value='2.125'>2.125</option>
                    <option value='2.25'>2.25</option>
                    <option value='2.4'>2.4</option>
                    <option value='2.6'>2.6</option>
                    <option value='2.8'>2.8</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rim Spokes</div>
                <select
                    className="dropdown"
                    id="rim-spokes"
                    name="rimSpokes"
                    value={rimSpokes}
                    onChange={(e) => setRimSpokes(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Spokes</option>
                    <option value="28">28</option>
                    <option value="32">32</option>
                    <option value="36">36</option>
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