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
import { updateForkItem, archiveForkItem, restoreForkItem, deleteForkItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";
import "./fork.scss";
import {Modal, Button} from 'react-bootstrap';

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing, functionKey, setFunctionKey, setShowResponseModal }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [forkSize, setForkSize] = useState('');
    const [forkTubeType, setForkTubeType] = useState('');
    const [ftUpperDiameter, setFtUpperDiameter] = useState('');
    const [ftLowerDiameter, setFtLowerDiameter] = useState('');
    const [forkTravel, setForkTravel] = useState('');
    const [axleType, setAxleType] = useState('');
    const [axleDiameter, setAxleDiameter] = useState('');
    const [suspensionType, setSuspensionType] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [maxTireWidth, setMaxTireWidth] = useState('');
    const [frontHubWidth, setFrontHubWidth] = useState('');
    const [material, setMaterial] = useState('');
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
            setForkSize(selectedItem.fork_size || '');
            setForkTubeType(selectedItem.fork_tube_type || '');
            setFtUpperDiameter(selectedItem.fork_tube_upper_diameter || '');
            setFtLowerDiameter(selectedItem.fork_tube_lower_diameter || '');
            setForkTravel(selectedItem.fork_travel || '');
            setAxleType(selectedItem.axle_type || '');
            setAxleDiameter(selectedItem.axle_diameter || '');
            setSuspensionType(selectedItem.suspension_type || '');
            setRotorSize(selectedItem.rotor_size || '');
            setMaxTireWidth(selectedItem.max_tire_width || '');
            setFrontHubWidth(selectedItem.front_hub_width || '');
            setMaterial(selectedItem.material || '');
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
        updatedData.append('fork_travel', forkTravel);
        updatedData.append('axle_type', axleType);
        updatedData.append('axle_diameter', axleDiameter);
        updatedData.append('suspension_type', suspensionType);
        updatedData.append('rotor_size', rotorSize);
        updatedData.append('max_tire_width', maxTireWidth);
        updatedData.append('front_hub_width', frontHubWidth);
        updatedData.append('material', material);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateForkItem(selectedItem.fork_id, updatedData);
        setShowResponseModal(true);

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


    // Archive item
    const handleArchiveItem = async (fork_id) => {
        try {
            await archiveForkItem(fork_id);
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
    const handleRestoreItem = async (fork_id) => {
        try {
            await restoreForkItem(fork_id);
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
    const handleDeleteItem = async (fork_id) => {
        try {
            await deleteForkItem(fork_id);
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
                handleArchiveItem(selectedItem.fork_id);
                break;
            case 'delete':     
                handleDeleteItem(selectedItem.fork_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.fork_id);
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
                <ImageUploadButton onFileSelect={handleFileSelect} part={'fork'}/>
            )}

            <ImagePreviewModal
                show={showModal}
                handleClose={handleCloseModal}
                src={itemImage}
            />

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
                <textarea
                    type="text"
                    id="item-description-fork"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                ></textarea>
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
                    <option value="Non Tapered">Non Tapered</option>
                    <option value="Tapered">Tapered</option>
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
                    <option value='1 1/8"'>1 1/8"</option>
                    <option value='1 1/4"'>1 1/4"</option>
                    <option value='1.5"'>1.5"</option>
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
                    <option value='1 1/8"'>1 1/8"</option>
                    <option value='1 1/4"'>1 1/4"</option>
                    <option value='1.5"'>1.5"</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Fork Travel</div>
                <select
                    className="dropdown"
                    id="fork-travel"
                    name="forkTravel"
                    value={forkTravel}
                    onChange={(e) => setForkTravel(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Travel</option>
                    <option value="80mm to 120mm">80mm to 120mm</option>
                    <option value="120mm to 160mm">120mm to 160mm</option>
                    <option value="150mm to 180mm">150mm to 180mm</option>
                    <option value="180mm to 200mm">180mm to 200mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Fork Axle Type</div>
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
                <div className="title">Fork Axle Diameter</div>
                <select
                    className="dropdown"
                    id="axle-diameter"
                    name="axleDiameter"
                    value={axleDiameter}
                    onChange={(e) => setAxleDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Diameter</option>
                    <option value="9mm (QR)">9mm (QR)</option>
                    <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                    <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Fork Suspension Type</div>
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
                    <option value="Air">Air</option>
                    <option value="Coil">Coil</option>
                    <option value="N/A (Rigid)">N/A (Rigid)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Fork Rotor Size</div>
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
                    <option value="160mm">160mm</option>
                    <option value="180mm">180mm</option>
                    <option value="203mm">203mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Fork Max Tire Width</div>
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
                    <option value='2.1'>2.1</option>
                    <option value='2.25'>2.25</option>
                    <option value='2.4'>2.4</option>
                    <option value='2.6'>2.6</option>
                    <option value='2.8'>2.8</option>
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