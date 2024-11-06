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
import { updateGroupsetItem, archiveGroupsetItem, restoreGroupsetItem, deleteGroupsetItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";
import "./groupset.scss";
import {Modal, Button} from 'react-bootstrap';

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived, isEditing, setIsEditing, functionKey, setFunctionKey, setShowResponseModal }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [chainringSpeed, setChainringSpeed] = useState('');
    const [crankArmLength, setCrankArmLength] = useState('');
    const [frontDerailleurSpeed, setFrontDerailleurSpeed] = useState('');
    const [rearDerailleurSpeed, setRearDerailleurSpeed] = useState('');
    const [cassetteType, setCassetteType] = useState('');
    const [cassetteSpeed, setCassetteSpeed] = useState('');
    const [chainSpeed, setChainSpeed] = useState('');
    const [bottomBracketType, setBottomBracketType] = useState('');
    const [bottomBracketWidth, setBottomBracketWidth] = useState('');
    const [brakeType, setBrakeType] = useState('');
    const [rotorMountType, setRotorMountType] = useState('');
    const [rotorSize, setRotorSize] = useState('');;
    const [itemImage, setItemImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const { userRole } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [fdError, setFdError] = useState('');
    const [rdError, setRdError] = useState('');

    const [fdIsCorrect, setFdIsCorrect] = useState(false);
    const [rdIsCorrect, setRdIsCorrect] = useState(false);

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
            setChainringSpeed(selectedItem.chainring_speed || '');
            setCrankArmLength(selectedItem.crank_arm_length || '');
            setFrontDerailleurSpeed(selectedItem.front_derailleur_speed || '');
            setRearDerailleurSpeed(selectedItem.rear_derailleur_speed || '');
            setCassetteType(selectedItem.cassette_type || '');
            setCassetteSpeed(selectedItem.cassette_speed || '');
            setChainSpeed(selectedItem.chain_speed || '');
            setBottomBracketType(selectedItem.bottom_bracket_type || '');
            setBottomBracketWidth(selectedItem.bottom_bracket_width || '');
            setBrakeType(selectedItem.brake_type || '');
            setRotorMountType(selectedItem.rotor_mount_type || '');
            setRotorSize(selectedItem.rotor_size || '');
            setItemImage(imageBase64);
            setOriginalItem({ ...selectedItem });

            if (imageFile) {
                handleFileSelect(imageFile);
            }
        }
    }, [selectedItem]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!fdIsCorrect || !rdIsCorrect) return;

        const updatedData = new FormData();
        updatedData.append('description', description);
        updatedData.append('chainring_speed', chainringSpeed);
        updatedData.append('crank_arm_length', crankArmLength);
        updatedData.append('front_derailleur_speed', frontDerailleurSpeed);
        updatedData.append('rear_derailleur_speed', rearDerailleurSpeed);
        updatedData.append('cassette_type', cassetteType);
        updatedData.append('cassette_speed', cassetteSpeed);
        updatedData.append('chain_speed', chainSpeed);
        updatedData.append('bottom_bracket_type', bottomBracketType);
        updatedData.append('bottom_bracket_width', bottomBracketWidth);
        updatedData.append('brake_type', brakeType);
        updatedData.append('rotor_mount_type', rotorMountType);
        updatedData.append('rotor_size', rotorSize);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateGroupsetItem(selectedItem.groupset_id, updatedData);
        setShowResponseModal(true);

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.groupset_id === selectedItem.groupset_id ? updatedItem : item
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
    const handleArchiveItem = async (groupset_id) => {
        try {
            await archiveGroupsetItem(groupset_id);
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
    const handleRestoreItem = async (groupset_id) => {
        try {
            await restoreGroupsetItem(groupset_id);
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
    const handleDeleteItem = async (groupset_id) => {
        try {
            await deleteGroupsetItem(groupset_id);
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
                handleArchiveItem(selectedItem.groupset_id);
                break;
            case 'delete':     
                handleDeleteItem(selectedItem.groupset_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.groupset_id);
                break;
            default:
                break;
        }
    }

    function chainringSpeedCorrect(){
        // if chainring is 1x, front derailleur speed should be N/A
        if(chainringSpeed === "Single (1x)" && frontDerailleurSpeed !== "N/A (1x Chainring speed)"){
            setFdError("Front Derailleur Speed should be N/A (1x Chainring speed)");
            return setFdIsCorrect(false);
        } 
        // if chainring is 2x, front derailleur speed should be 2-speed
        if(chainringSpeed === "Double (2x)" && frontDerailleurSpeed !== "2-speed"){
            setFdError("Front Derailleur Speed should be 2-speed");
            return setFdIsCorrect(false);
        }

        // if chainring is 3x, front derailleur speed should be 3-speed
        if(chainringSpeed === "Triple (3x)" && frontDerailleurSpeed !== "3-speed"){
            setFdError("Front Derailleur Speed should be 3-speed");
            return setFdIsCorrect(false);
        }

        setFdError('');
        return setFdIsCorrect(true);
    }

    function cassetteSpeedCorrect(){
        // rear derailleur speed is 9-speed, cassette speed should be 9-speed, chain speed should be 9-speed
        if(cassetteSpeed !== rearDerailleurSpeed  || chainSpeed !== rearDerailleurSpeed ){
            setRdError(`Cassette Speed and Chain Speed should be ${rearDerailleurSpeed}`);
            return setRdIsCorrect(false);
        }
        setRdError('');
        return setRdIsCorrect(true);
    }

    useEffect(() => {
        chainringSpeedCorrect();
        cassetteSpeedCorrect();
    },[chainringSpeed, frontDerailleurSpeed, rearDerailleurSpeed, cassetteSpeed, chainSpeed]);

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
                <ImageUploadButton onFileSelect={handleFileSelect} part={'groupset'} />
            )}

            <ImagePreviewModal
                show={showModal}
                handleClose={handleCloseModal}
                src={itemImage}
            />

            <div className="input-container form-group">
                <label htmlFor="item-name-groupset">Name</label>
                <input
                    type="text"
                    id="item-name-groupset"
                    name="itemName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-price-groupset">Price</label>
                <input
                    type="text"
                    id="item-price-groupset"
                    name="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled
                />
            </div>

            <div className="input-container form-group">
                <label htmlFor="item-description-groupset">Description</label>
                <textarea
                    type="text"
                    id="item-description-groupset"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                ></textarea>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Chainring Speed</div>
                <select
                    className="dropdown"
                    id="chainring-speed"
                    name="chainringSpeed"
                    value={chainringSpeed}
                    onChange={(e) => setChainringSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Speed</option>
                    <option value="Single (1x)">Single (1x)</option>
                    <option value="Double (2x)">Double (2x)</option>
                    <option value="Triple (3x)">Triple (3x)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Crank Arm Length</div>
                <select
                    className="dropdown"
                    id="crank-arm-length"
                    name="crankArmLength"
                    value={crankArmLength}
                    onChange={(e) => setCrankArmLength(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Length</option>
                    <option value="165mm">165mm</option>
                    <option value="170mm">170mm</option>
                    <option value="175mm">175mm</option>
                    <option value="180mm">180mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Front Derailleur Speed</div>
                <select
                    className="dropdown"
                    id="front-derailleur-speed"
                    name="frontDerailleurSpeed"
                    value={frontDerailleurSpeed}
                    onChange={(e) => setFrontDerailleurSpeed(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Speed</option>
                    <option value="2-speed">2-speed</option>
                    <option value="3-speed">3-speed</option>
                    <option value="N/A (1x Chainring speed)">N/A (1x Chainring speed)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rear Derailleur Speed</div>
                <select
                    className="dropdown"
                    id="rear-derailleur-speed"
                    name="rearDerailleurSpeed"
                    value={rearDerailleurSpeed}
                    onChange={(e) => setRearDerailleurSpeed(e.target.value)}
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
                <div className="title">Cassette Type</div>
                <select
                    className="dropdown"
                    id="cassette-type"
                    name="cassetteType"
                    value={cassetteType}
                    onChange={(e) => setCassetteType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Cassette">Cassette</option>
                    <option value="Threaded">Threaded</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Cassette Speed</div>
                <select
                    className="dropdown"
                    id="cassette-speed"
                    name="cassetteSpeed"
                    value={cassetteSpeed}
                    onChange={(e) => setCassetteSpeed(e.target.value)}
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
                <div className="title">Chain Speed</div>
                <select
                    className="dropdown"
                    id="chain-speed"
                    name="chainrSpeed"
                    value={chainSpeed}
                    onChange={(e) => setChainSpeed(e.target.value)}
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
                <div className="title">Bottom Bracket Type</div>
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
                <div className="title">Bottom Bracket Width</div>
                <select
                    className="dropdown"
                    id="bottom-bracket-width"
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
                <div className="title">Brake Type</div>
                <select
                    className="dropdown"
                    id="brake-type"
                    name="brakeType"
                    value={brakeType}
                    onChange={(e) => setBrakeType(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Type</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Hydraulic">Hydraulic</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Rotor Mount Type</div>
                <select
                    className="dropdown"
                    id="rotor-mount-type"
                    name="rotorMountType"
                    value={rotorMountType}
                    onChange={(e) => setRotorMountType(e.target.value)}
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
                    <option value="160mm">160mm</option>
                    <option value="180mm">180mm</option>
                    <option value="203mm">203mm</option>
                </select>
            </div>

             {(fdError || rdError )&& 
            <div className="error-message">
                <p>{fdError}</p>
                <p>{rdError}</p>
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