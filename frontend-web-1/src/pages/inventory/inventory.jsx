import "./inventory.scss";
import PageLayout from "../../components/page-layout/page-layout";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/search-bar/search-bar";
import filter from "../../assets/icons/filter.png";
import sort from "../../assets/icons/sort.png";
import arrowUp from "../../assets/icons/arrow-up.png";
import arrowDown from "../../assets/icons/arrow-down.png";
import exit from "../../assets/icons/exit.png";
import edit from "../../assets/icons/edit.png";
import del from "../../assets/icons/delete.png";
import cancel from "../../assets/icons/cancel.png";
import restore from "../../assets/icons/restore.png";
import ImageUploadButton from "../../components/img-upload-button/img-upload-button";
import { addItem, displayItems, dashboardData, getItemDetails, updateItem } from "../../services/inventoryService";
import { base64ToFile } from "../../utility/imageUtils";
import { archiveItem, restoreItem, deleteItem } from "../../services/inventoryService";
import ImagePreviewModal from "../../components/image-preview-modal/image-preview";
import LoadingPage from '../../components/loading-page/loading-page';
import ErrorLoad from '../../components/error-load/error-load';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment-timezone';;

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
    const [itemCost, setItemCost] = useState("");
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
        item_cost: "",
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
        stockValue: 0,
    });

    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [sortCriteria, setSortCriteria] = useState("name"); // Default sorting by name
    const [sortOrder, setSortOrder] = useState("asc"); // Default order
    const [selectedCategory, setSelectedCategory] = useState(""); // For filtering
    const [selectedStockCount, setSelectedStockCount] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const showMiddleSection = showFilter || showSort;

    const [loading, setLoading] = useState(true);
    const [errorLoad, setErrorLoad] = useState(false);
    const [nameError, setNameError] = useState("");
    const [nameSuccess, setNameSuccess] = useState(false);

    const handleNameInput = (value) => {
        // Check if the name already exists in the items list (case-insensitive comparison)
        const nameExists = items.some(item => item.item_name.toLowerCase() === value.toLowerCase());

        if (nameExists) {
            setNameError("Item name already exist.");
            setNameSuccess(false); // Clear the success message
        } else {
            setNameError(""); // Clear the error if the name is unique
            setNameSuccess(true); // Show success message
        }
    };

    // Assuming items is an array of item objects
    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [functionKey, setFunctionKey] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);

    const [addedItemName, setAddedItemName] = useState('');

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
                        <p>If you archive this item, it will not be shown in your POS. Archived items will be stored and can be restored in the Archived tab in this page.</p>
                    }
                    {(functionKey === 'delete' && !selectedItem.bb_bu_status) &&
                        <p>If you delete this item, you won't be able to restore it.</p>
                    }
                    {(functionKey === 'delete' && selectedItem.bb_bu_status) &&
                        <p>If you delete this item, you won't be able to restore it. Also, this item will be removed from the Bike Builder and Upgrader. Are you sure with this?</p>
                    }
                    {functionKey === 'restore' &&
                        <p>If you restore this item, it can be used again in your POS. You will also be able to edit its details.</p>
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
    function ResponseModal(props) {
        return (
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Success
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {functionKey === 'archive' &&
                        <p>{selectedItem.item_name} was archived successfully. This item will be stored in the Archive.</p>
                    }
                    {functionKey === 'delete' &&
                        <p>{selectedItem.item_name} was deleted successfully.</p>
                    }
                    {functionKey === 'restore' &&
                        <p>{selectedItem.item_name} was restored successfully.</p>
                    }
                    {functionKey === 'edit' &&
                        <p>{selectedItem.item_name} was edited successfully.</p>
                    }
                    {functionKey === 'add' &&
                        <p>{addedItemName} was added successfully.</p>
                    }
                </Modal.Body>
            </Modal>
        );
    }


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

            // Filter items
            const filteredItems = data.filter((item) => {
                const categoryMatch = selectedCategory ? item.category_name === selectedCategory : true;
                const stockMatch = selectedStockCount === "" ||
                    (selectedStockCount === "no" && item.stock_count === 0) ||
                    (selectedStockCount === "low" && item.stock_count <= item.low_stock_count && item.stock_count > 0) ||
                    (selectedStockCount === "in" && item.stock_count > item.low_stock_count && item.stock_count > 0);
                return categoryMatch && stockMatch;
            });

            // Sort items
            const sortedItems = filteredItems.sort((a, b) => {
                const aValue = sortCriteria === "name" ? a.item_name : sortCriteria === "stock" ? a.stock_count : new Date(a.date_created);
                const bValue = sortCriteria === "name" ? b.item_name : sortCriteria === "stock" ? b.stock_count : new Date(b.date_created);

                if (sortOrder === "asc") {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });

            setItems(sortedItems);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching items:", error);
            setTimeout(() => {
                setLoading(false);
                setErrorLoad(true);
            }, 1000);
        }
    }, [displayItem, selectedCategory, selectedStockCount, sortCriteria, sortOrder]);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
        fetchItems();
    }, [fetchItems]);

    // Handle form submission (Add item)
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setFunctionKey('add');
        setAddedItemName(itemName);

        let costOfItem = 0;
        const itemData = new FormData();
        itemData.append("itemName", itemName);
        itemData.append("itemPrice", parseFloat(itemPrice));
        itemData.append("itemCost", parseFloat(costOfItem));
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
            setShowResponseModal(true);
            if (result && result.items) {
                setItems(result.items);
            }
            resetForm();
            fetchDashboardData();
            fetchItems();
            setDisplayItem(true);
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
        setNameError(""); // Clear the error if the name is unique
        setNameSuccess(false); // Show success message

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
            item_cost: item.item_cost,
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
        setNameError(""); // Clear the error if the name is unique
        setNameSuccess(false); // Show success message
    };

    // Handle saving the edited item
    const handleSaveClick = async (event) => {
        event.preventDefault();
        setFunctionKey('edit');

        let costOfItem = 0;
        const updatedData = new FormData();
        updatedData.append("itemName", selectedItem.item_name);
        updatedData.append("itemPrice", parseFloat(selectedItem.item_price));
        updatedData.append("itemCost", parseFloat(costOfItem));
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
            "bbBuStatus",
            selectedItem.bb_bu_status ? "true" : "false",
        );

        updatedData.append(
            "bikeParts",
            selectedItem.bike_parts
        );


        if (selectedFile) {
            updatedData.append("itemImage", selectedFile);
        }

        console.log(selectedItem.bike_parts);

        try {
            await updateItem(selectedItem.item_id, updatedData);
            setShowResponseModal(true);

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
        setDisplayItem(true);
        setShowArchived(false);
        setViewingItem(null);
        setSortCriteria("name");
        setSortOrder("asc");
        setSelectedCategory("");
        setSelectedStockCount("");
        setShowSort(false);
        setShowFilter(false);
    }
    // Handle archive item click
    const handleArchiveItemClick = () => {
        setNameError(""); // Clear the error if the name is unique
        setNameSuccess(false); // Show success message
        setDisplayItem(false);
        setShowArchived(true);
        setViewingItem(null);
        setSortCriteria("name");
        setSortOrder("asc");
        setSelectedCategory("");
        setSelectedStockCount("");
        setShowSort(false);
        setShowFilter(false);
    }

    // Archive item
    const handleArchiveItem = async (item_id) => {
        try {
            await archiveItem(item_id);
            setShowConfirmModal(false);
            setShowResponseModal(true);

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
            setShowConfirmModal(false);
            setShowResponseModal(true);

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
        try {
            await deleteItem(item_id);
            setShowConfirmModal(false);
            setShowResponseModal(true);

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
        setNameError("");
        setNameSuccess(false);
        setItemName("");
        setItemPrice("");
        setItemCost("");
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

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    function handleConfirmModal() {
        switch (functionKey) {
            case 'archive':
                handleArchiveItem(selectedItem.item_id);
                break;
            case 'delete':
                handleDeleteItem(selectedItem.item_id);
                break;
            case 'restore':
                handleRestoreItem(selectedItem.item_id);
                break;
            default:
                break;
        }
    }

    if (loading) return <LoadingPage classStyle={"loading-in-page"} />
    if (errorLoad) return <ErrorLoad classStyle={"error-in-page"} />

    return (
        <div className="inventory p-3">
            <PageLayout
                leftContent={
                    <div className="inventory-content">
                        <ConfirmModal
                            show={showConfirmModal}
                            onHide={() => {
                                setShowConfirmModal(false);
                            }}
                            onConfirm={handleConfirmModal}
                        />
                        <ResponseModal
                            show={showResponseModal}
                            onHide={() => {
                                setShowResponseModal(false);
                            }}
                        />
                        <div className="upper-container d-flex">
                            <button className="add-btn" onClick={handleAddItemClick}>
                                <span className="add-pos-user-text">Add Item</span>
                                <i className="fa-solid fa-circle-plus"></i>
                            </button>

                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder='Search item'
                            />

                            {/* Toggle filter visibility */}
                            <button className="filter" onClick={() => setShowFilter(!showFilter)}>
                                <img src={filter} alt="Filter" className="button-icon" />
                            </button>

                            {/* Toggle sort visibility */}
                            <button className="sort" onClick={() => setShowSort(!showSort)}>
                                <img src={sort} alt="Sort" className="button-icon" />
                            </button>

                            {showArchived ? (
                                <button className="active" onClick={handleActiveItemClick}>
                                    <span>Active</span>
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            ) : (
                                <button className="archive" onClick={handleArchiveItemClick}>
                                    <span>Archive</span>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </button>
                            )}
                        </div>

                        {showMiddleSection && (
                            <div className="middle-container">
                                <div className="middle-content">

                                    {/* Conditional rendering for Filter section */}
                                    {showFilter && (
                                        <>
                                            <div className="title">
                                                <img src={filter} alt="Filter" className="icon me-2" />
                                                Filter by:
                                            </div>

                                            <select
                                                className="dropdown"
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                value={selectedCategory}
                                            >
                                                <option value="">Category</option>
                                                {["Accessories", "Parts", "Components", "Sets", "Cleaning", "Tools"].map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>

                                            <select
                                                className="dropdown"
                                                onChange={(e) => setSelectedStockCount(e.target.value)}
                                                value={selectedStockCount}
                                            >
                                                <option value="">Stock Status</option>
                                                <option value="no">No Stock</option>
                                                <option value="low">Low Stock</option>
                                                <option value="in">In Stock</option>
                                            </select>
                                        </>
                                    )}

                                    {/* Conditional rendering for Sort section */}
                                    {showSort && (
                                        <>
                                            <div className="title">
                                                <img src={sort} alt="Sort" className="icon me-2" />
                                                Sort by:
                                            </div>

                                            <select
                                                className="dropdown"
                                                value={sortCriteria}
                                                onChange={(e) => setSortCriteria(e.target.value)}
                                            >
                                                <option value="name">Item Name</option>
                                                <option value="stock">Stock Count</option>
                                                <option value="date">Date Added</option>
                                            </select>

                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                                    fetchItems();
                                                }}
                                            >
                                                {sortOrder === "asc" ? (
                                                    <img src={arrowDown} alt="Sort Descending" />
                                                ) : (
                                                    <img src={arrowUp} alt="Sort Ascending" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="lower-container">
                            <div className="item-container-title d-flex">
                                <div className="legend">
                                    <i className="fa-solid fa-box"></i>
                                    <p>Inventory Item</p>
                                </div>
                                <div className="legend">
                                    <i className="fa-solid fa-ruler-horizontal"></i>
                                    <p>Waitlist Item</p>
                                </div>
                                <div className="legend">
                                    <i className="fa-solid fa-bicycle"></i>
                                    <p>Bike Builder and Upgrader Item</p>
                                </div>
                            </div>
                            <div className="item-container-title d-flex">
                                <div className="item-name">Item Name</div>

                                <div className="item-category">
                                    Category
                                </div>

                                <div className="item-price">
                                    Price
                                </div>

                                {/* <div className="item-date">
                                    Date Added
                                </div> */}

                                <div className="item-stocks">
                                    Stock
                                </div>

                                <div className="item-stock-status">
                                    Status
                                </div>
                            </div>
                            <div className="lower-content">
                                {filteredItems.length === 0 ? (
                                    <div className="no-items-message">
                                        {displayItem === false ? 'No archived items' : 'No active items'}
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <div
                                            key={item.item_id}
                                            className="item-container d-flex"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="item-name">
                                                {(!item.add_part && !item.bb_bu_status) &&
                                                    <i className="fa-solid fa-box"></i>
                                                }
                                                {(item.add_part && !item.bb_bu_status) &&
                                                    <i className="fa-solid fa-ruler-horizontal"></i>
                                                }
                                                {(!item.add_part && item.bb_bu_status) &&
                                                    <i className="fa-solid fa-bicycle"></i>
                                                }
                                                {item.item_name}
                                            </div>
                                            <div className="item-category">
                                                {item.category_name}
                                            </div>
                                            <div className="item-price">
                                                {PesoFormat.format(item.item_price)}
                                            </div>
                                            {/* <div className="item-date">
                                            {new Date(item.date_created).toLocaleDateString()}
                                        </div> */}
                                            <div className="item-stocks">
                                                {item.stock_count}
                                            </div>
                                            <div className="item-stock-status">
                                                <div
                                                    className="status-container"
                                                    style={{
                                                        backgroundColor:
                                                            item.stock_count === 0
                                                                ? "#DA7777" // No stock
                                                                : item.low_stock_alert && item.stock_count <= item.low_stock_count
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
                                <div className="container-1 d-flex">
                                    <div className="title">
                                        <h4>{isEditing ? 'Edit' : 'View'} Item</h4>
                                    </div>
                                    <div className="button-nav">
                                        <div className="edit-btn">
                                            {showArchived ? (
                                                <img
                                                    src={restore}
                                                    alt="Restore"
                                                    className="restore-icon"
                                                    onClick={() => {
                                                        // handleRestoreItem(selectedItem.item_id);
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
                                            {showArchived ? (
                                                <img
                                                    src={del}
                                                    alt="Delete"
                                                    className="del-icon"
                                                    onClick={() => {
                                                        // handleDeleteItem(selectedItem.item_id);
                                                        setShowConfirmModal(true);
                                                        setFunctionKey('delete');
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={del}
                                                    alt="Archive"
                                                    className="archive-icon"
                                                    onClick={() => {
                                                        // handleDeleteItem(selectedItem.item_id);
                                                        // handleArchiveItem(selectedItem.item_id)
                                                        setShowConfirmModal(true);
                                                        setFunctionKey('archive')
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="exit-btn">
                                            <img
                                                src={exit}
                                                alt="Exit"
                                                className="exit-icon"
                                                onClick={handleCloseView}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p>Created {moment(selectedItem.date_created).format("LLL")}</p>
                                <form className="form-content">

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
                                            onChange={(e) => {
                                                handleNameInput(e.target.value); // Check if the name exists
                                                setSelectedItem((prev) => ({
                                                    ...prev,
                                                    item_name: e.target.value,
                                                }));
                                            }}
                                            placeholder="Enter item name"
                                            disabled={!isEditing}
                                            required
                                        />
                                        {nameError && <p className='error'>{nameError}</p>}
                                        {!nameError && nameSuccess && (
                                            <p className='success'>Item name is available.</p>
                                        )}
                                    </div>

                                    <div className="item-price form-group">
                                        <label htmlFor="item-price">Price</label>
                                        <input
                                            type="text"
                                            id="item-price"
                                            name="itemPrice"
                                            value={selectedItem.item_price === 0 ? "" : selectedItem.item_price || ""} // Show placeholder when price is 0 or empty
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow empty input or valid numbers (>= 0)
                                                if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        item_price: value === "" ? "" : Number(value), // Keep empty string or valid numeric value
                                                    }));
                                                }
                                            }}
                                            placeholder="Enter item price"
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>

                                    <div className="item-cost form-group">
                                        {/* HIDDEN FOR NOW */}
                                        {/* <label htmlFor="item-cost">Cost</label> */}
                                        <input
                                            type="hidden"
                                            id="item-cost"
                                            name="itemCost"
                                            value={selectedItem.item_cost === 0 ? "" : selectedItem.item_cost || ""} // Show placeholder when cost is 0 or empty
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow empty input or valid numbers (>= 0)
                                                if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
                                                    setSelectedItem((prev) => ({
                                                        ...prev,
                                                        item_cost: value === "" ? "" : Number(value), // Keep empty string or valid numeric value
                                                    }));
                                                }
                                            }}
                                            placeholder="Enter item cost"
                                            disabled={!isEditing}
                                        // required
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
                                            <option value="Parts">Parts</option>
                                            <option value="Components">Components</option>
                                            <option value="Sets">Sets</option>
                                            <option value="Cleaning">Cleaning</option>
                                            <option value="Tools">Tools</option>
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
                                                                <option value="Seat">Seat</option>
                                                                <option value="Cockpit">Cockpit</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}

                                    {isEditing && (
                                        <div className="submit-container">
                                            <button
                                                type="submit"
                                                className="submit-btn"
                                                disabled={nameError} // Disable button if there's an error
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        ) : // ADD ITEM
                            isAddingItem ? (
                                <div className="form-container">
                                    <div className="container-1 d-flex">
                                        <div className="title">
                                            <h4>Add Item</h4>
                                        </div>
                                        <div className="exit-btn">
                                            <img
                                                src={exit}
                                                alt="Exit"
                                                className="exit-icon"
                                                onClick={() => { setIsAddingItem(false); setIsAddingStock(false); }}
                                            />
                                        </div>
                                    </div>
                                    <form className="form-content" onSubmit={handleFormSubmit}>

                                        <ImageUploadButton onFileSelect={handleFileSelect} />

                                        <div className="item-name form-group">
                                            <label htmlFor="item-name-add">Name</label>
                                            <input
                                                type="text"
                                                id="item-name-add"
                                                name="itemName"
                                                value={itemName}
                                                onChange={(e) => {
                                                    handleNameInput(e.target.value); // Check if the name exists
                                                    setItemName(e.target.value);
                                                }}
                                                placeholder="Enter item name"
                                                required
                                            />
                                            {nameError && <p className='error'>{nameError}</p>}
                                            {!nameError && nameSuccess && (
                                                <p className='success'>Item name is available.</p>
                                            )}
                                        </div>

                                        <div className="item-price form-group">
                                            <label htmlFor="item-price-add">Price</label>
                                            <input
                                                type="text"
                                                id="item-price-add"
                                                name="itemPrice"
                                                value={itemPrice === 0 ? "" : itemPrice} // Display empty string when value is 0
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Allow empty input or valid numbers (>= 0)
                                                    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
                                                        setItemPrice(value === "" ? "" : Number(value)); // Keep empty string for empty input
                                                    }
                                                }}
                                                placeholder="Enter item price"
                                                required
                                            />
                                        </div>

                                        <div className="item-cost form-group">
                                            {/* Hidden */}
                                            {/* <label htmlFor="item-cost-add">Cost</label> */}
                                            {/* <input
                                                type="hidden"
                                                id="item-cost-add"
                                                name="itemCost"
                                                // value={itemCost === 0 ? "" : itemCost} // Display empty string when value is 0
                                                onChange={(e) => {
                                                    // const value = e.target.value;
                                                    // // Allow empty input or valid numbers (>= 0)
                                                    // if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
                                                    //     setItemCost(value === "" ? "0" : Number(value)); // Keep empty string for empty input
                                                    // }
                                                    setItemCost(0);
                                                }}
                                                placeholder="Enter item cost"
                                                // required
                                            /> */}
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
                                                <option value="Parts">Parts</option>
                                                <option value="Components">Components</option>
                                                <option value="Sets">Sets</option>
                                                <option value="Cleaning">Cleaning</option>
                                                <option value="Tools">Tools</option>
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
                                                    <option value="Seat">Seat</option>
                                                    <option value="Cockpit">Cockpit</option>
                                                </select>
                                            </div>
                                        )}

                                        <div className="submit-container">
                                            <button
                                                type="submit"
                                                className="submit-btn"
                                                disabled={nameError} // Disable button if there's an error
                                            >
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
                                            <div className="title">Total Stock Count</div>
                                        </div>
                                    </div>

                                    <div className="container-content">
                                        <div className="main-content">
                                            <div className="number">{PesoFormat.format(data.stockValue)}</div>
                                            <div className="title">Total Stock Value</div>
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
