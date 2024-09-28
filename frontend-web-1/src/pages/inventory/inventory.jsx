import "./inventory.scss";
import PageLayout from "../../components/page-layout/page-layout";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/search-bar/search-bar";
import filter from "../../assets/icons/filter.png";
import sort from "../../assets/icons/sort.png";
import exit from "../../assets/icons/exit.png";
import edit from "../../assets/icons/edit.png";
import del from "../../assets/icons/delete.png";
import cancel from "../../assets/icons/cancel.png";
import archive from "../../assets/icons/archive.png";
import restore from "../../assets/icons/restore.png";
import ImageUploadButton from "../../components/img-upload-button/img-upload-button";
import {
    addItem,
    displayItems,
    dashboardData,
    getItemDetails,
    updateItem,
} from "../../services/inventoryService";
import { base64ToFile } from "../../utility/imageUtils";
import { archiveItem, restoreItem, deleteItem } from "../../services/inventoryService";
import ImagePreviewModal from "../../components/image-preview-modal/image-preview";

const Inventory = () => {
    // State management
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const [addToBikeBuilder, setAddToBikeBuilder] = useState(false);
    const [lowStockAlert, setLowStockAlert] = useState(false);
    const [lowStockThreshold, setLowStockThreshold] = useState("");
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockInput, setStockInput] = useState(0);
    const [confirmedStock, setConfirmedStock] = useState(0);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [category, setCategory] = useState("Accessories");
    const [bikeParts, setBikeParts] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [itemImage, setItemImage] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const [showArchived, setShowArchived] = useState(false);
    const [displayItem, setDisplayItem] = useState(true);
    const [selectedItem, setSelectedItem] = useState({
        item_name: "",
        item_price: "",
        stock_count: 0,
        category_name: "",
        low_stock_alert: false,
        low_stock_count: "",
        add_part: false,
        bike_parts: "",
        item_image: "",
        bb_bu_status: ""
    });
    const [data, setData] = useState({
        totalItems: 0,
        lowStockItems: 0,
        stockCounts: 0,
        stockValue: "₱ 0",
    });

    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const result = await dashboardData();
            setData(result); // Update the dashboard data
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    // Fetch and display items
    const fetchItems = useCallback(async () => {
        try {
            const data = await displayItems(displayItem);
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }, [displayItem]);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
        fetchItems();
    }, [fetchItems]);

    // Handle form submission (Add item)
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const itemData = new FormData();
        itemData.append("itemName", itemName);
        itemData.append("itemPrice", parseFloat(itemPrice));
        itemData.append("stock", parseInt(stockInput, 10));
        itemData.append("category", category);
        itemData.append("lowStockAlert", lowStockAlert ? "true" : "false");
        itemData.append(
            "lowStockThreshold",
            lowStockAlert ? parseInt(lowStockThreshold, 10).toString() : null,
        );
        itemData.append("addToBikeBuilder", addToBikeBuilder ? "true" : "false");
        itemData.append("bikeParts", addToBikeBuilder ? bikeParts : null);
        if (selectedFile) {
            itemData.append("itemImage", selectedFile);
        }

        try {
            const result = await addItem(itemData);
            alert("Item added successfully");
            if (result && result.items) {
                setItems(result.items);
            }
            resetForm();
            await fetchDashboardData();
        } catch (error) {
            alert("An error occurred while adding the item");
        }
    };

    // Handle item click
    const handleItemClick = async (item) => {
        setSelectedItem(item);
        setViewingItem(true);
        setIsAddingItem(false);
        setIsAddingStock(false);
        setIsEditing(false);

        try {
            const itemDetails = await getItemDetails(item.item_id);
            populateFormWithDetails(itemDetails);
        } catch (error) {
            console.error("Error fetching item details:", error);
        }
    };

    // Populate form with item details
    const populateFormWithDetails = (item) => {
        // Determine the file extension based on the image type
        const fileExtension = item.item_image && item.item_image.startsWith("data:image/png")
            ? "png"
            : "jpg"; // Default to jpg if it's not a png

        const imageBase64 =
            item.item_image && !item.item_image.startsWith("data:image/")
                ? `data:image/${fileExtension};base64,${item.item_image}`
                : item.item_image;

        // Create a file with the correct extension (either .jpg or .png)
        const imageFile = imageBase64
            ? base64ToFile(imageBase64, `image.${fileExtension}`)
            : null;

        setSelectedItem((prev) => ({
            ...prev,
            item_name: item.item_name,
            item_price: item.item_price,
            stock_count: item.stock_count,
            category_name: item.category_name,
            low_stock_alert: item.low_stock_alert,
            low_stock_count: item.low_stock_count || "",
            add_part: item.add_part,
            bike_parts: item.bike_parts || "",
            item_image: imageBase64,
            bb_bu_status: item.bb_bu_status,
        }));

        setItemImage(imageBase64);

        if (imageFile) {
            handleFileSelect(imageFile);
        }
    };

    // Handle closing the item view
    const handleCloseView = () => {
        setViewingItem(null);
    };

    // Handle adding a new item click
    const handleAddItemClick = () => {
        resetForm();
        setIsAddingItem(true);
        setViewingItem(null);
        setIsAddingStock(false);
    };

    // Handle editing an item
    const handleEditClick = () => {
        setOriginalItem({ ...selectedItem });
        setIsEditing(true);
    };

    // Handle canceling the edit
    const handleCancelEdit = async () => {
        setSelectedItem(originalItem);
        setIsAddingStock(false);
        setIsEditing(false);
    };

    // Handle saving the edited item
    const handleSaveClick = async (event) => {
        event.preventDefault();

        const updatedData = new FormData();
        updatedData.append("itemName", selectedItem.item_name);
        updatedData.append("itemPrice", parseFloat(selectedItem.item_price));
        updatedData.append("stock", parseInt(selectedItem.stock_count, 10));
        updatedData.append("category", selectedItem.category_name);
        updatedData.append(
            "lowStockAlert",
            selectedItem.low_stock_alert ? "true" : "false",
        );
        updatedData.append(
            "lowStockThreshold",
            selectedItem.low_stock_alert
                ? parseInt(selectedItem.low_stock_count, 10).toString()
                : null,
        );
        updatedData.append(
            "addToBikeBuilder",
            selectedItem.add_part ? "true" : "false",
        );
        updatedData.append(
            "bikeParts",
            selectedItem.add_part ? selectedItem.bike_parts : null,
        );

        if (selectedFile) {
            updatedData.append("itemImage", selectedFile);
        }

        try {
            await updateItem(selectedItem.item_id, updatedData);
            alert("Item updated successfully");

            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.item_id === selectedItem.item_id ? { ...selectedItem } : item,
                ),
            );

            await fetchDashboardData();
            setIsEditing(false);
            setIsAddingStock(false);
            setViewingItem(false)
        } catch (error) {
            alert("An error occurred while updating the item");
        }
    };

    // Handle stock input change
    const handleStockInputChange = (event) => {
        const value = Number(event.target.value);
        // Allow only valid inputs (numbers >= 0)
        if (!isNaN(value) && value >= 0) {
            setStockInput(value);
        }
    };

    // Handle file selection for image upload
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    // Handle archive item click
    const handleActiveItemClick = () => {
        setDisplayItem(true)
        setShowArchived(false)
        setViewingItem(null);
    }
    // Handle archive item click
    const handleArchiveItemClick = () => {
        setDisplayItem(false)
        setShowArchived(true)
        setViewingItem(null);
    }

    // Archive item
    const handleArchiveItem = async (item_id) => {
        try {
            await archiveItem(item_id);
            alert("Item archived successfully");

            setViewingItem(false);
            fetchDashboardData();
            fetchItems();
        } catch (error) {
            console.error("Error archiving item:", error);
            alert("An error occurred while archiving the item");
        }
    }

    // Restore item
    const handleRestoreItem = async (item_id) => {
        try {
            await restoreItem(item_id);
            alert("Item restored successfully");

            setViewingItem(false);
            fetchDashboardData();
            fetchItems();
        } catch (error) {
            console.error("Error restoring item:", error);
            alert("An error occurred while restoring the item");
        }
    }

    // Delete item
    const handleDeleteItem = async (item_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

        if (!confirmDelete) return;

        try {
            await deleteItem(item_id);
            alert("Item deleted successfully");

            setViewingItem(false);
            fetchDashboardData();
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("An error occurred while deleting the item");
        }
    }

    // Reset the form fields
    const resetForm = () => {
        setItemName("");
        setItemPrice("");
        setStockInput(0);
        setConfirmedStock(0);
        setCategory("");
        setLowStockAlert(false);
        setLowStockThreshold("");
        setAddToBikeBuilder(false);
        setBikeParts("");
        setItemImage(null);
        setSelectedFile(null);
        setIsAddingItem(false);
    };


    const handleConfirm = () => {
        setConfirmedStock(stockInput);
        setIsAddingStock(false);
    };

    return (
        <div className="inventory p-3">
            <PageLayout
                leftContent={
                    <div className="inventory-content">
                        <div className="upper-container d-flex">
                            <button className="add-btn" onClick={handleAddItemClick}>
                                Add Item +
                            </button>
                            <SearchBar />
                            <button className="filter">
                                <img src={filter} alt="Filter" className="button-icon" />
                            </button>
                            <button className="sort">
                                <img src={sort} alt="Sort" className="button-icon" />
                            </button>
                            {showArchived ? (
                                <button className="active" onClick={handleActiveItemClick}>
                                    Active Items
                                </button>
                            ) : (
                                <button className="archive" onClick={handleArchiveItemClick}>
                                    Archived Items
                                </button>
                            )}
                        </div>

                        <div className="lower-container">
                            <div className="lower-content">
                                <div className="item-container-title d-flex p-4 bg-secondary ">
                                    <div className="item-name fw-bold text-light">Item Name</div>

                                    <div className="item-category fw-bold text-light">
                                        Category
                                    </div>

                                    <div className="item-price fw-bold text-light">
                                        Price
                                    </div>

                                    <div className="item-stocks fw-bold text-light">
                                        Stock
                                    </div>

                                    <div className="item-stock-status fw-bold text-light">
                                        Status
                                    </div>
                                </div>

                                {items.length === 0 ? (
                                    <div className="no-items-message">
                                        {displayItem === false ? 'No archived items' : 'No active items'}
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div
                                            key={item.item_id}
                                            className="item-container d-flex p-4"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="item-name fw-bold">{item.item_name}</div>
                                            <div className="item-category">{item.category_name}</div>
                                            <div className="item-price">₱ {item.item_price}</div>
                                            <div className="item-stocks">{item.stock_count}</div>
                                            <div className="item-stock-status">
                                                <div
                                                    className="status-container"
                                                    style={{
                                                        backgroundColor:
                                                            item.stock_count === 0
                                                                ? "#DA7777" // No stock
                                                                : item.low_stock_alert &&
                                                                    item.stock_count <= item.low_stock_count
                                                                    ? "#DABE77" // Low stock
                                                                    : "#77DA87", // In stock
                                                    }}
                                                >
                                                    {item.low_stock_alert
                                                        ? item.stock_count === 0
                                                            ? "No stock"
                                                            : item.stock_count <= item.low_stock_count
                                                                ? "Low stock"
                                                                : "In stock"
                                                        : item.stock_count === 0
                                                            ? "No stock"
                                                            : "In stock"}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                }
                rightContent={
                    <div className="inventory-containers">
                        {/* VIEW ITEM */}
                        {viewingItem && !isAddingItem && selectedItem ? (
                            <div className="form-container" onSubmit={handleSaveClick}>
                                <form className="form-content">
                                    <div className="container-1 d-flex">
                                        <div className="exit-btn">
                                            <img
                                                src={exit}
                                                alt="Exit"
                                                className="exit-icon"
                                                onClick={handleCloseView}
                                            />
                                        </div>
                                        <div className="edit-btn">
                                            {showArchived ? (
                                                <img
                                                    src={restore}
                                                    alt="Restore"
                                                    className="restore-icon"
                                                    onClick={() => handleRestoreItem(selectedItem.item_id)}
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
                                                    onClick={() => handleDeleteItem(selectedItem.item_id)}
                                                />
                                            ) : (
                                                <img
                                                    src={archive}
                                                    alt="Archive"
                                                    className="archive-icon"
                                                    onClick={() => handleArchiveItem(selectedItem.item_id)}
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

                                    <div className="item-name form-group">
                                        <label htmlFor="item-name">Name</label>
                                        <input
                                            type="text"
                                            id="item-name"
                                            name="itemName"
                                            value={selectedItem.item_name || ""}
                                            onChange={(e) =>
                                                setSelectedItem((prev) => ({
                                                    ...prev,
                                                    item_name: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter item name"
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>

                                    <div className="item-price form-group">
                                        <label htmlFor="item-price">Price</label>
                                        <input
                                            type="text"
                                            id="item-price"
                                            name="itemPrice"
                                            value={selectedItem.item_price || ""}
                                            onChange={(e) =>
                                                setSelectedItem((prev) => ({
                                                    ...prev,
                                                    item_price: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter item price"
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>

                                    <div className="stock-container d-flex justify-content-between">
                                        <div className="title">Stock Count</div>

                                        <div className="count">{selectedItem.stock_count}</div>

                                        <button
                                            className="stock-btn"
                                            type="button"
                                            disabled={!isEditing}
                                            onClick={() => {
                                                if (isAddingStock) {
                                                    // Add the input value to the existing stock count
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        stock_count: parseInt(prev.stock_count, 10) + parseInt(prev.stock_input || 0, 10), // Add input to stock count
                                                        stock_input: 0, // Reset the input after adding
                                                    }));
                                                    setIsAddingStock(false);
                                                } else {
                                                    // Switch to stock adding mode
                                                    setIsAddingStock(true);
                                                }
                                            }}
                                        >
                                            {isAddingStock ? "Confirm" : "Add Stock"}
                                        </button>
                                    </div>

                                    {isAddingStock && (
                                        <div className="add-stock-container form-group d-flex justify-content-between">
                                            <input
                                                type="text"
                                                id="add-stock"
                                                name="addStock"
                                                value={selectedItem.stock_input || ""} // Use stock_input for the input field
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    // Allow only valid inputs (numbers >= 0)
                                                    if (!isNaN(value) && value >= 0) {
                                                        setSelectedItem((prev) => ({
                                                            ...prev,
                                                            stock_input: value, // Set the valid numeric value
                                                        }));
                                                    }
                                                }}
                                                placeholder="Enter stock amount"
                                                disabled={!isEditing}
                                                required
                                            />

                                            <button
                                                className="increment-btn"
                                                type="button"
                                                disabled={!isEditing}
                                                onClick={() => {
                                                    // Increment the input value by 1 when clicked
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        stock_input: parseInt(prev.stock_input || 0, 10) + 1, // Increment stock_input by 1
                                                    }));
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}

                                    <div className="category-container d-flex justify-content-between">
                                        <div className="title">Category</div>
                                        <select
                                            className="dropdown"
                                            id="category-select"
                                            name="category"
                                            value={selectedItem.category_name}
                                            onChange={(e) =>
                                                setSelectedItem((prev) => ({
                                                    ...prev,
                                                    category_name: e.target.value,
                                                }))
                                            }
                                            disabled={!isEditing}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div className="low-stock-container d-flex justify-content-between">
                                        <div className="title">Low Stock Alert</div>
                                        <div className="switch form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="lowStock"
                                                name="lowStockAlert"
                                                checked={selectedItem.low_stock_alert || false}
                                                onChange={() =>
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        low_stock_alert: !prev.low_stock_alert,
                                                    }))
                                                }
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    {selectedItem.low_stock_alert && (
                                        <div className="low-stock-threshold form-group">
                                            <input
                                                type="text"
                                                id="low-stock-threshold"
                                                name="lowStockThreshold"
                                                value={selectedItem.low_stock_count || ""}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (!isNaN(value) && value >= 0) {
                                                        setSelectedItem((prev) => ({
                                                            ...prev,
                                                            low_stock_count: value,
                                                        }));
                                                    }
                                                }}
                                                placeholder="Enter stock threshold"
                                                disabled={!isEditing}
                                                min="0"
                                                required
                                            />
                                        </div>
                                    )}

                                    {viewingItem && (
                                        <>
                                            {/* Check if the item is already added to Bike Builder and Upgrader */}
                                            {selectedItem.bb_bu_status ? (
                                                <div className="item-status">
                                                    Added to bike builder and upgrader
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Show the switch to add the item to the Bike Builder and Upgrader if not added */}
                                                    <div className="bbu-container d-flex justify-content-between">
                                                        <div className="title">Add to Bike Builder and Upgrader</div>
                                                        <div className="switch form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="addPart"
                                                                name="addPart"
                                                                checked={selectedItem.add_part || false}
                                                                onChange={() =>
                                                                    setSelectedItem((prev) => ({
                                                                        ...prev,
                                                                        add_part: !prev.add_part,
                                                                    }))
                                                                }
                                                                disabled={!isEditing}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Only show the dropdown if the item has been toggled on to be added */}
                                                    {selectedItem.add_part && (
                                                        <div className="bike-part-container d-flex justify-content-between">
                                                            <div className="title">Bike Part</div>
                                                            <select
                                                                className="dropdown"
                                                                id="bike-part-select"
                                                                name="bikeParts"
                                                                value={selectedItem.bike_parts || ""}
                                                                onChange={(e) =>
                                                                    setSelectedItem((prev) => ({
                                                                        ...prev,
                                                                        bike_parts: e.target.value,
                                                                    }))
                                                                }
                                                                disabled={!isEditing}
                                                            >
                                                                <option value="">Select a part</option>
                                                                <option value="Frame">Frame</option>
                                                                <option value="Fork">Fork</option>
                                                                <option value="Groupset">Groupset</option>
                                                                <option value="Wheelset">Wheelset</option>
                                                                <option value="Cockpit">Cockpit</option>
                                                                <option value="Headset">Headset</option>
                                                                <option value="Handlebar">Handlebar</option>
                                                                <option value="Stem">Stem</option>
                                                                <option value="Hubs">Hubs</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}

                                    {isEditing && (
                                        <div className="submit-container">
                                            <button type="submit" className="submit-btn">
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        ) : // ADD ITEM
                            isAddingItem ? (
                                <div className="form-container">
                                    <form className="form-content" onSubmit={handleFormSubmit}>
                                        <div className="container-1 d-flex">
                                            <div className="exit-btn">
                                                <img
                                                    src={exit}
                                                    alt="Exit"
                                                    className="exit-icon"
                                                    onClick={() => { setIsAddingItem(false); setIsAddingStock(false); }}
                                                />
                                            </div>
                                        </div>

                                        <ImageUploadButton onFileSelect={handleFileSelect} />

                                        <div className=" item-name form-group">
                                            <label htmlFor="item-name-add">Name</label>
                                            <input
                                                type="text"
                                                id="item-name-add"
                                                name="itemName"
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                placeholder="Enter item name"
                                                required
                                            />
                                        </div>

                                        <div className="item-price form-group">
                                            <label htmlFor="item-price-add">Price</label>
                                            <input
                                                type="text"
                                                id="item-price-add"
                                                name="itemPrice"
                                                value={itemPrice}
                                                onChange={(e) => setItemPrice(e.target.value)}
                                                placeholder="Enter item price"
                                                required
                                            />
                                        </div>

                                        <div className="stock-container d-flex justify-content-between">
                                            <div className="title">Stock Count</div>

                                            <div className="count">{confirmedStock}</div> {/* Show confirmed stock */}
                                            <button
                                                className="stock-btn"
                                                type="button"
                                                onClick={() => {
                                                    if (isAddingStock) {
                                                        handleConfirm(); // Confirm input
                                                    } else {
                                                        setIsAddingStock(true); // Show input field
                                                    }
                                                }}
                                            >
                                                {isAddingStock ? "Confirm" : "Add Stock"}
                                            </button>
                                        </div>

                                        {isAddingStock && (
                                            <div className="add-stock-container d-flex justify-content-between">
                                                <input
                                                    type="text"
                                                    value={stockInput === 0 ? "" : stockInput}
                                                    min="0"
                                                    onChange={handleStockInputChange}
                                                    placeholder="Enter stock count"
                                                />
                                                <button
                                                    className="increment-btn"
                                                    type="button"
                                                    onClick={() => setStockInput(stockInput + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        <div className="category-container d-flex justify-content-between">
                                            <div className="title">Category</div>
                                            <select
                                                className="dropdown"
                                                id="category-select-add"
                                                name="category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            >
                                                <option value="">Select category</option>
                                                <option value="Accessories">Accessories</option>
                                            </select>
                                        </div>

                                        <div className="low-stock-container d-flex justify-content-between">
                                            <div className="title">Low Stock Alert</div>
                                            <div className="switch form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="lowStock-add"
                                                    name="lowStockAlert"
                                                    checked={lowStockAlert}
                                                    onChange={() => setLowStockAlert(!lowStockAlert)}
                                                />
                                            </div>
                                        </div>

                                        {lowStockAlert && (
                                            <div className="low-stock-threshold form-group">
                                                <input
                                                    type="text" // Change to number input
                                                    id="low-stock-threshold-add"
                                                    name="lowStockThreshold"
                                                    value={lowStockThreshold || ""} // Display threshold or empty string if undefined
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        // Allow only valid inputs (numbers >= 0)
                                                        if (!isNaN(value) && value >= 0) {
                                                            setLowStockThreshold(value); // Update state with valid value
                                                        }
                                                    }}
                                                    placeholder="Enter stock threshold"
                                                    min="0" // Ensure no negative values
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="bbu-container d-flex justify-content-between">
                                            <div className="title">
                                                Add to Bike Builder and Upgrader
                                            </div>
                                            <div className="switch form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="addPart-add"
                                                    name="addPart"
                                                    checked={addToBikeBuilder}
                                                    onChange={() => setAddToBikeBuilder(!addToBikeBuilder)}
                                                />
                                            </div>
                                        </div>

                                        {addToBikeBuilder && (
                                            <div className="bike-part-container d-flex justify-content-between">
                                                <div className="title">Bike Part</div>
                                                <select
                                                    className="dropdown"
                                                    id="bike-part-select-add"
                                                    name="bikeParts"
                                                    value={bikeParts}
                                                    onChange={(e) => setBikeParts(e.target.value)}
                                                >
                                                    <option value="">Select a part</option>
                                                    <option value="Frame">Frame</option>
                                                    <option value="Fork">Fork</option>
                                                    <option value="Groupset">Groupset</option>
                                                    <option value="Wheelset">Wheelset</option>
                                                    <option value="Cockpit">Cockpit</option>
                                                    <option value="Headset">Headset</option>
                                                    <option value="Handlebar">Handlebar</option>
                                                    <option value="Stem">Stem</option>
                                                    <option value="Hubs">Hubs</option>
                                                </select>
                                            </div>
                                        )}

                                        <div className="submit-container">
                                            <button type="submit" className="submit-btn">
                                                Add
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <div className="container-content">
                                        <div className="main-content">
                                            <div className="number">{data.totalItems}</div>
                                            <div className="title">Items Available</div>
                                        </div>
                                    </div>

                                    <div className="container-content">
                                        <div className="main-content">
                                            <div className="number">{data.lowStockItems}</div>
                                            <div className="title">Low Stock Items</div>
                                        </div>
                                    </div>

                                    <div className="container-content">
                                        <div className="main-content">
                                            <div className="number">{data.stockCounts}</div>
                                            <div className="title">Stock Counts</div>
                                        </div>
                                    </div>

                                    <div className="container-content">
                                        <div className="main-content">
                                            <div className="number">{data.stockValue}</div>
                                            <div className="title">Stock Value</div>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>
                }
            />
        </div>
    );
};

export default Inventory;
