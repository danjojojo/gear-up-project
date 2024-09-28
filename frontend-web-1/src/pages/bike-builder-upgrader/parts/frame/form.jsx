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
import { updateFrameItem, archiveFrameItem, restoreFrameItem, deleteFrameItem } from "../../../../services/bbuService";
import ImagePreviewModal from "../../../../components/image-preview-modal/image-preview";

const Form = ({ selectedItem, setSelectedItem, setItems, refreshWaitlist, onClose, showArchived }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [frameSize, setFrameSize] = useState('');
    const [headTubeType, setHeadTubeType] = useState('');
    const [htUpperDiameter, setHtUpperDiameter] = useState('');
    const [htLowerDiameter, setHtLowerDiameter] = useState('');
    const [seatpostDiameter, setSeatpostDiameter] = useState('');
    const [axleType, setAxleType] = useState('');
    const [axleWidth, setAxleWidth] = useState('');
    const [bottomBracketType, setBottomBracketType] = useState('');
    const [bbDiameter, setBbDiameter] = useState('');
    const [rotorSize, setRotorSize] = useState('');
    const [maxTireWidth, setMaxTireWidth] = useState('');
    const [brakeMount, setBrakeMount] = useState('');
    const [cableRouting, setCableRouting] = useState('');
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
            setFrameSize(selectedItem.frame_size || '');
            setHeadTubeType(selectedItem.head_tube_type || '');
            setHtUpperDiameter(selectedItem.head_tube_upper_diameter || '');
            setHtLowerDiameter(selectedItem.head_tube_lower_diameter || '');
            setSeatpostDiameter(selectedItem.seatpost_diameter || '');
            setAxleType(selectedItem.axle_type || '');
            setAxleWidth(selectedItem.axle_width || '');
            setBottomBracketType(selectedItem.bottom_bracket_type || '');
            setBbDiameter(selectedItem.bottom_bracket_diameter || '');
            setRotorSize(selectedItem.rotor_size || '');
            setMaxTireWidth(selectedItem.max_tire_width || '');
            setBrakeMount(selectedItem.brake_mount || '');
            setCableRouting(selectedItem.cable_routing || '');
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
        updatedData.append('frame_size', frameSize);
        updatedData.append('head_tube_type', headTubeType);
        updatedData.append('head_tube_upper_diameter', htUpperDiameter);
        updatedData.append('head_tube_lower_diameter', htLowerDiameter);
        updatedData.append('seatpost_diameter', seatpostDiameter);
        updatedData.append('axle_type', axleType);
        updatedData.append('axle_width', axleWidth);
        updatedData.append('bottom_bracket_type', bottomBracketType);
        updatedData.append('bottom_bracket_diameter', bbDiameter);
        updatedData.append('rotor_size', rotorSize);
        updatedData.append('max_tire_width', maxTireWidth);
        updatedData.append('brake_mount', brakeMount);
        updatedData.append('cable_routing', cableRouting);
        updatedData.append('material', material);
        updatedData.append('weight', weight);

        if (selectedFile) {
            updatedData.append('item_image', selectedFile);
        }

        const updatedItem = await updateFrameItem(selectedItem.frame_id, updatedData);
        alert("Item updated successfully");

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
    const handleRestoreItem = async (frame_id) => {
        try {
            await restoreFrameItem(frame_id);
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
    const handleDeleteItem = async (frame_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteFrameItem(frame_id);
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
                            onClick={() => handleRestoreItem(selectedItem.frame_id)}
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
                            onClick={userRole === 'admin' ? () => handleDeleteItem(selectedItem.frame_id) : null}
                            style={{ opacity: userRole === 'admin' ? 1 : 0.5, cursor: userRole === 'admin' ? 'pointer' : 'not-allowed' }} // Adjust appearance based on role
                        />
                    ) : (
                        <img
                            src={archive}
                            alt="Archive"
                            className="archive-icon"
                            onClick={() => handleArchiveItem(selectedItem.frame_id)}
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
                <input
                    type="text"
                    id="item-description-frame"
                    name="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    required
                    disabled={!isEditing}
                />
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
                    <option value="Tapered">Tapered</option>
                    <option value="Straight">Straight</option>
                    <option value="Integrated">Integrated</option>
                    <option value="External">External</option>
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
                    <option value='1 1/8" (28.6 mm)'>1 1/8" (28.6 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
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
                    <option value='1.5" (38.1 mm)'>1.5" (38.1 mm)</option>
                    <option value='1 1/4" (31.75 mm)'>1 1/4" (31.75 mm)</option>
                    <option value='1 3/8" (34.9 mm)'>1 3/8" (34.9 mm)</option>
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
                    <option value="27.2 mm">27.2 mm</option>
                    <option value="30.9 mm">30.9 mm</option>
                    <option value="31.6 mm">31.6 mm</option>
                    <option value="34.9 mm">34.9 mm</option>
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
                <div className="title">Axle Width</div>
                <select
                    className="dropdown"
                    id="axle-width"
                    name="axleWidth"
                    value={axleWidth}
                    onChange={(e) => setAxleWidth(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Width</option>
                    <option value="135 mm">135 mm</option>
                    <option value="142 mm">142 mm</option>
                    <option value="148 mm (Boost)">148 mm (Boost)</option>
                    <option value="150 mm">150 mm</option>
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
                    <option value="BSA (Threaded)">BSA (Threaded)</option>
                    <option value="Press Fit (PF30)">Press Fit (PF30)</option>
                    <option value="BB30">BB30</option>
                    <option value="BB92">BB92</option>
                    <option value="BB86">BB86</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Bottom Bracket Diameter</div>
                <select
                    className="dropdown"
                    id="bb-diameter"
                    name="bbDiameter"
                    value={bbDiameter}
                    onChange={(e) => setBbDiameter(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Diameter</option>
                    <option value="24 mm">24 mm</option>
                    <option value="30 mm">30 mm</option>
                    <option value="41 mm">41 mm</option>
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
                    <option value="160 mm">160 mm</option>
                    <option value="180 mm">180 mm</option>
                    <option value="203 mm">203 mm</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Max Tire Width</div>
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
                    <option value='2.1"'>2.1"</option>
                    <option value='2.25"'>2.25"</option>
                    <option value='2.4"'>2.4"</option>
                    <option value='2.6"'>2.6"</option>
                    <option value='2.8"'>2.8"</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Brake Mount</div>
                <select
                    className="dropdown"
                    id="brake-mount"
                    name="brakeMount"
                    value={brakeMount}
                    onChange={(e) => setBrakeMount(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Mount</option>
                    <option value="Post Mount">Post Mount</option>
                    <option value="Flat Mount">Flat Mount</option>
                    <option value="IS (International Standard)">IS (International Standard)</option>
                </select>
            </div>

            <div className="dropdown-container d-flex justify-content-between">
                <div className="title">Cable Routing</div>
                <select
                    className="dropdown"
                    id="cable-routing"
                    name="cableRouting"
                    value={cableRouting}
                    onChange={(e) => setCableRouting(e.target.value)}
                    required
                    disabled={!isEditing}
                >
                    <option value="">Select Routing</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
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

            <div className="input-container form-group">
                <label htmlFor="item-weight-frame">Weight</label>
                <input
                    type="text"
                    id="item-weight-frame"
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