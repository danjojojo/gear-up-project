import React, { useState, useEffect, useContext } from "react";
import exit from "../../../../../assets/icons/exit.png";
import edit from "../../../../../assets/icons/edit.png";
import cancel from "../../../../../assets/icons/cancel.png";
import del from "../../../../../assets/icons/delete.png";
import restore from "../../../../../assets/icons/restore.png";
import ImageUploadButton from "../../../../../components/img-upload-button/img-upload-button";
import { base64ToFile } from "../../../../../utility/imageUtils";
import { AuthContext } from "../../../../../context/auth-context";
import { updateFrameItem, archiveFrameItem, restoreFrameItem, deleteFrameItem } from "../../../../../services/bbuService";
import ImagePreviewModal from "../../../../../components/image-preview-modal/image-preview";
import './frame.scss';
import {Modal, Button} from 'react-bootstrap';

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing, functionKey, setFunctionKey, setShowResponseModal }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [purpose, setPurpose] = useState('');
    const [frameSize, setFrameSize] = useState('');
    const [headTubeType, setHeadTubeType] = useState('');
    const [htUpperDiameter, setHtUpperDiameter] = useState('');
    const [htLowerDiameter, setHtLowerDiameter] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [axleType, setAxleType] = useState('');
    const [axleDiameter, setAxleDiameter] = useState('');
    const [bottomBracketType, setBottomBracketType] = useState('');
    const [bottomBracketWidth, setBottomBracketWidth] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [maxTireWidth, setMaxTireWidth] = useState('');
    const [rearHubWidth, setRearHubWidth] = useState('');
    const [material, setMaterial] = useState('');
    const [itemImage, setItemImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const { userRole } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [showCropModal, setShowCropModal] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [headTubeError, setHeadTubeError] = useState('');
    const [frameAxleError, setFrameAxleError] = useState('');

    const [headTubeIsCorrect, setHeadTubeIsCorrect] = useState(false);
    const [frameAxleIsCorrect, setFrameAxleIsCorrect] = useState(false);

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
            setPurpose(selectedItem.purpose || '');
            setFrameSize(selectedItem.frame_size || '');
            setHeadTubeType(selectedItem.head_tube_type || '');
            setHtUpperDiameter(selectedItem.head_tube_upper_diameter || '');
            setHtLowerDiameter(selectedItem.head_tube_lower_diameter || '');
            setSeatpostDiameter(selectedItem.seatpost_diameter || '');
            setAxleType(selectedItem.axle_type || '');
            setAxleDiameter(selectedItem.axle_diameter || '');
            setBottomBracketType(selectedItem.bottom_bracket_type || '');
            setBottomBracketWidth(selectedItem.bottom_bracket_width || '');
            setRotorSize(selectedItem.rotor_size || '');
            setMaxTireWidth(selectedItem.max_tire_width || '');
            setRearHubWidth(selectedItem.rear_hub_width || '');
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

        if (!headTubeIsCorrect || !frameAxleIsCorrect) return;
        
        const updatedData = new FormData();
        updatedData.append('description', description);
        updatedData.append('purpose', purpose);
        updatedData.append('frame_size', frameSize);
        updatedData.append('head_tube_type', headTubeType);
        updatedData.append('head_tube_upper_diameter', htUpperDiameter);
        updatedData.append('head_tube_lower_diameter', htLowerDiameter);
        updatedData.append('seatpost_diameter', seatpostDiameter);
        updatedData.append('axle_type', axleType);
        updatedData.append('axle_diameter', axleDiameter);
        updatedData.append('bottom_bracket_type', bottomBracketType);
        updatedData.append('bottom_bracket_width', bottomBracketWidth);
        updatedData.append('rotor_size', rotorSize);
        updatedData.append('max_tire_width', maxTireWidth);
        updatedData.append('rear_hub_width', rearHubWidth);
        updatedData.append('material', material);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateFrameItem(selectedItem.frame_id, updatedData);
        setShowResponseModal(true);

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.frame_id === selectedItem.frame_id ? updatedItem : item
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
    const handleArchiveItem = async (frame_id) => {
        try {
            await archiveFrameItem(frame_id);
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
    const handleRestoreItem = async (frame_id) => {
        try {
            await restoreFrameItem(frame_id);
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
    const handleDeleteItem = async (frame_id) => {
        try {
            await deleteFrameItem(frame_id);
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
                handleArchiveItem(selectedItem.frame_id);
                break;
            case 'delete':     
                handleDeleteItem(selectedItem.frame_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.frame_id);
                break;
            default:
                break;
        }
    }

    function headTubeCorrect(){
        if(headTubeType === 'Tapered' && htUpperDiameter === '44mm' && htLowerDiameter === '44mm'){
            setHeadTubeError('Incorrect specifications for Tapered Head Tube Type');
            return setHeadTubeIsCorrect(false);
        }
        if(headTubeType === 'Non Tapered' && htUpperDiameter === '44mm' && (htLowerDiameter === '55mm' || htLowerDiameter === '56mm')){
            setHeadTubeError('Incorrect specifications for Non Tapered Head Tube Type');
            return setHeadTubeIsCorrect(false);
        }
        setHeadTubeError('');
        return setHeadTubeIsCorrect(true);
    }

    function frameAxleCorrect(){
        if(axleType === 'Quick Release (QR)' && axleDiameter !== '9mm (QR)'){
            setFrameAxleError('Incorrect specifications for Quick Release Axle Type');
            return setFrameAxleIsCorrect(false);
        }
        if(axleType === 'Thru-Axle (TA)' && (axleDiameter !== '12mm (Thru-Axle)' || axleDiameter !== '15mm (Thru-Axle)' || axleDiameter !== '20mm (Thru-Axle)')){
            setFrameAxleError('Incorrect specifications for Thru-Axle Axle Type');
            return setFrameAxleIsCorrect(false);
        }
        setFrameAxleError('');
        return setFrameAxleIsCorrect(true);
    }

    useEffect(() => {
        headTubeCorrect();
        frameAxleCorrect();
    }, [headTubeType, htUpperDiameter, htLowerDiameter, axleType, axleDiameter]);

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
                    <>
                        <div className="item-image-container" onClick={handleOpenModal}>
                            <img
                                src={itemImage}
                                alt="Item"
                                className="item-image"
                            />
                        </div>
                    </>
                ) : (
                    <div className="no-image-container">
                        No image attached
                    </div>
                )
            ) : (
                <ImageUploadButton onFileSelect={handleFileSelect} part={'frame'}/>
            )}

            <ImagePreviewModal
                show={showModal}
                handleClose={handleCloseModal}
                src={itemImage}
            />

            <div className="input-container form-group">
                <label htmlFor="item-name-frame">Name</label>
                <input
                    type="text"
                    id="item-name-frame"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-frame">Price</label>
                <input
                    type="text"
                    id="item-price-frame"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-frame">Description</label>
                <textarea
                    type="text"
                    id="item-description-frame"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                ></textarea>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Purpose</div>
                <select
                    className="dropdown"
                    id="purpose"
                    name="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Purpose</option>
                    <option value="Cross-country (XC)">Cross-country (XC)</option>
                    <option value="Trail">Trail</option>
                    <option value="Enduro">Enduro</option>
                    <option value="Downhill (DH)">Downhill (DH)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Size</div>
                <select
                    className="dropdown"
                    id="frame-size"
                    name="frameSize"
                    value={frameSize}
                    onChange={(e) => setFrameSize(e.target.value)}
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
                <div className="title">Head Tube Type</div>
                <select
                    className="dropdown"
                    id="head-tube-type"
                    name="headTubeType"
                    value={headTubeType}
                    onChange={(e) => setHeadTubeType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Non Tapered">Non Tapered</option>
                    <option value="Tapered">Tapered</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Head Tube Upper Diameter</div>
                <select
                    className="dropdown"
                    id="ht-upper-diameter"
                    name="htUpperDiameter"
                    value={htUpperDiameter}
                    onChange={(e) => setHtUpperDiameter(e.target.value)}
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
                <div className="title">Head Tube Lower Diameter</div>
                <select
                    className="dropdown"
                    id="ht-lower-diameter"
                    name="htLowerDiameter"
                    value={htLowerDiameter}
                    onChange={(e) => setHtLowerDiameter(e.target.value)}
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
                <div className="title">Frame Axle Type</div>
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
                <div className="title">Frame Axle Diameter</div>
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
                    <option value="12mm (Thru-Axle)">12mm (Thru-Axle)</option>
                    <option value="15mm (Thru-Axle)">15mm (Thru-Axle)</option>
                    <option value="20mm (Thru-Axle)">20mm (Thru-Axle)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Bottom Bracket Type</div>
                <select
                    className="dropdown"
                    id="bottom-bracket-type"
                    name="bottomBracketType"
                    value={bottomBracketType}
                    onChange={(e) => setBottomBracketType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Threaded (BSA)">Threaded (BSA)</option>
                    <option value="Press-Fit (PF30, BB86, BB92)">Press-Fit (PF30, BB86, BB92)</option>
                    <option value="BB30">BB30</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Bottom Bracket Width</div>
                <select
                    className="dropdown"
                    id="bottom-bracket-Width"
                    name="bottomBracketWidth"
                    value={bottomBracketWidth}
                    onChange={(e) => setBottomBracketWidth(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Width</option>
                    <option value="68mm">68mm</option>
                    <option value="73mm (MTB)">73mm (MTB)</option>
                    <option value="83mm (Downhill)">83mm (Downhill)</option>
                    <option value="86mm (Press-Fit)">86mm (Press-Fit)</option>
                    <option value="92mm (MTB)">92mm (MTB)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Frame Rotor Size</div>
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
                <div className="title">Frame Max Tire Width</div>
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

            <div className="input-container form-group">
                <label htmlFor="item-material-frame">Material</label>
                <input
                    type="text"
                    id="item-material-frame"
                    name="itemMaterial"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Enter item material"
                    required
                    disabled={!isEditing}
                />
            </div>

            {(headTubeError || frameAxleError)&& 
            <div className="error-message">
                <p>{headTubeError}</p>
                <p>{frameAxleError}</p>
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