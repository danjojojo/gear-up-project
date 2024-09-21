import "./inventory.scss";
import PageLayout from "../../components/page-layout/page-layout";
import React, { useState, useEffect } from "react";
import SearchBar from "../../components/search-bar/search-bar";
import filter from "../../assets/icons/filter.png";
import sort from "../../assets/icons/sort.png";
import exit from "../../assets/icons/exit.png";
import edit from "../../assets/icons/edit.png";
import del from "../../assets/icons/delete.png";
import cancel from "../../assets/icons/cancel.png";
import ImageUploadButton from "../../components/img-upload-button/img-upload-button";
import {
    addItem,
    displayItems,
    dashboardData,
    getItemDetails,
    updateItem,
} from "../../services/inventoryService";
import { base64ToFile } from "../../utility/imageUtils";

const Inventory = () => {
    // State management
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const [addToBikeBuilder, setAddToBikeBuilder] = useState(false);
    const [lowStockAlert, setLowStockAlert] = useState(false);
    const [lowStockThreshold, setLowStockThreshold] = useState("");
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [stockInput, setStockInput] = useState(0);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [category, setCategory] = useState("Accessories");
    const [bikeParts, setBikeParts] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [itemImage, setItemImage] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
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

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const result = await dashboardData();
            setData(result); // Update the dashboard data
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Fetch and display items
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await displayItems();
                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

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
        const imageBase64 =
            item.item_image && !item.item_image.startsWith("data:image/")
                ? `data:image/jpeg;base64,${item.item_image}`
                : item.item_image;

        if (!imageBase64) {
            console.warn("No image data available for this item");
        }

        const imageFile = imageBase64
            ? base64ToFile(imageBase64, "image.jpg")
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
    const handleSaveClick = async () => {
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
        } catch (error) {
            alert("An error occurred while updating the item");
        }
    };

    // Handle stock input change
    const handleStockInputChange = (event) => {
        setStockInput(event.target.value);
    };

    // Handle file selection for image upload
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    // Reset the form fields
    const resetForm = () => {
        setItemName("");
        setItemPrice("");
        setStockInput(0);
        setCategory("");
        setLowStockAlert(false);
        setLowStockThreshold("");
        setAddToBikeBuilder(false);
        setBikeParts("");
        setItemImage(null);
        setSelectedFile(null);
        setIsAddingItem(false);
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

                                {items.map((item) => (
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
                                ))}
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
                                            {isEditing ? (
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
                                            <img src={del} alt="Delete" className="del-icon" />
                                        </div>
                                    </div>

                                    {!isEditing ? (
                                        itemImage ? (
                                            <div className="item-image-container">
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

                                        {isAddingStock && (
                                            <button
                                                className="increment-btn"
                                                type="button"
                                                disabled={!isEditing}
                                                onClick={() => {
                                                    // Increment stock count by 1 when clicked
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        stock_count: parseInt(prev.stock_count, 10) + 1,
                                                    }));
                                                }}
                                            >
                                                +
                                            </button>
                                        )}

                                        <button
                                            className="stock-btn"
                                            type="button"
                                            disabled={!isEditing}
                                            onClick={() => {
                                                if (isAddingStock) {
                                                    // If currently adding stock, confirm the changes
                                                    setIsAddingStock(false);
                                                } else {
                                                    // If not in adding mode, switch to adding mode
                                                    setIsAddingStock(true);
                                                }
                                            }}
                                        >
                                            {isAddingStock ? "Confirm" : "Add Stock"}
                                        </button>
                                    </div>

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
                                                value={selectedItem.low_stock_count}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        low_stock_count: e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter stock threshold"
                                                disabled={!isEditing}
                                                required
                                            />
                                        </div>
                                    )}

                                    {viewingItem && selectedItem.bb_bu_status && (
                                        <div className="item-status">
                                            Added to bike builder and upgrader
                                        </div>
                                    )}

                                    {viewingItem && !selectedItem.bb_bu_status && (
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
                                    )}

                                    {viewingItem && selectedItem.add_part && !selectedItem.bb_bu_status && (
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
                                            {isAddingStock ? (
                                                <input
                                                    type="number"
                                                    id="stock-input-add"
                                                    name="stockInput"
                                                    className="count-input"
                                                    value={stockInput}
                                                    min="0"
                                                    onChange={handleStockInputChange}
                                                />
                                            ) : (
                                                <div className="count">{stockInput}</div>
                                            )}
                                            <button
                                                className="stock-btn"
                                                type="button"
                                                onClick={() => {
                                                    if (isAddingStock) {
                                                        // Confirm and switch back to text view mode
                                                        setIsAddingStock(false);
                                                    } else {
                                                        // Switch to input mode
                                                        setIsAddingStock(true);
                                                    }
                                                }}
                                            >
                                                {isAddingStock ? "Confirm" : "Add Stock"}
                                            </button>
                                        </div>

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
                                                    type="text"
                                                    id="low-stock-threshold-add"
                                                    name="lowStockThreshold"
                                                    value={lowStockThreshold}
                                                    onChange={(e) => setLowStockThreshold(e.target.value)}
                                                    placeholder="Enter stock threshold"
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
