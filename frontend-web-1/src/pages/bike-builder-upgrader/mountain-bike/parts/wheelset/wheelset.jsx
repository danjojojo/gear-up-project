import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from "../../../../../context/auth-context";
import { useNavigate } from 'react-router-dom';
import './wheelset.scss';
import ResponsivePageLayout from '../../../../../components/responsive-page-layout/responsive-page-layout';
import sort from '../../../../../assets/icons/sort.png';
import arrowUp from "../../../../../assets/icons/arrow-up.png";
import arrowDown from "../../../../../assets/icons/arrow-down.png";
import SearchBar from '../../../../../components/search-bar/search-bar';
import { getWheelsetItems } from '../../../../../services/bbuService';
import Form from './form';
import LoadingPage from '../../../../../components/loading-page/loading-page';
import { Modal, Button } from 'react-bootstrap';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const Wheelset = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showArchived, setShowArchived] = useState(false);
    const [displayItem, setDisplayItem] = useState(true);
    const [sortCriteria, setSortCriteria] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState('');
    const [showSort, setShowSort] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const showMiddleSection = showSort;
    const [loading, setLoading] = useState(true);
    const { userRole } = useContext(AuthContext);


    const fetchItems = useCallback(async () => {
        try {
            const data = await getWheelsetItems(displayItem);

            // Sort items based on selected sort criteria
            const sortedItems = data.sort((a, b) => {
                let aValue, bValue;

                // Determine sorting criteria
                if (sortCriteria === "name") {
                    aValue = a.item_name.toLowerCase(); // Sort by name (case-insensitive)
                    bValue = b.item_name.toLowerCase();
                } else if (sortCriteria === "price") {
                    aValue = a.item_price; // Sort by price
                    bValue = b.item_price;
                } else {
                    aValue = new Date(a.date_created); // Sort by date created
                    bValue = new Date(b.date_created);
                }

                // Determine sort order (ascending or descending)
                if (sortOrder === "asc") {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });

            setItems(sortedItems);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching wheelset items:", error);
        }
    }, [displayItem, sortCriteria, sortOrder]);


    useEffect(() => {
        fetchItems();
    }, [fetchItems]);


    const filteredItems = items.filter(item =>
        item?.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleBackClick = () => {
        navigate('/bike-builder-upgrader/mountain-bike');
    };


    // Handle click on an item
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsEditing(false)
        setRightContainerStyle("right-container");
    };


    // Handle closing the form
    const handleCloseView = () => {
        setSelectedItem(null);
        if (window.innerWidth < 900) {
            setRightContainerStyle("right-container-close");
        }
    };


    const refreshWaitlist = () => {
        setLoading(true);
        fetchItems();
    };


    // Handle archive item click
    const handleActiveItemClick = () => {
        setDisplayItem(true)
        setShowArchived(false)
        handleCloseView();
        setSortCriteria("name");
        setSortOrder("asc");
        setShowSort(false);
    }


    // Handle archive item click
    const handleArchiveItemClick = () => {
        setDisplayItem(false)
        setShowArchived(true)
        handleCloseView();
        setSortCriteria("name");
        setSortOrder("asc");
        setShowSort(false);
    }

    const [isVisible, setIsVisible] = useState(true);
    const [partsContainerStyle, setPartsContainerStyle] = useState("parts-content");
    const [rightContainerStyle, setRightContainerStyle] = useState("right-container");
    const [originalHeight, setOriginalHeight] = useState(window.innerHeight);

    const handleResize = () => {
        const isKeyboardOpen = window.innerHeight < originalHeight; // Check if keyboard is open
        if (!isKeyboardOpen) {
            if (window.innerWidth < 900) {
                setIsVisible(true);
                setPartsContainerStyle("parts-content");
                setRightContainerStyle("right-container-close");
            } else {
                setIsVisible(true);
                setPartsContainerStyle("parts-content");
                setRightContainerStyle("right-container");
            }
        }
    }

    useEffect(() => {
        handleResize();

        setOriginalHeight(window.innerHeight); // Store original height on mount
        const handleResizeDebounced = debounce(handleResize, 100);

        // Setup resize listener only if width is greater than 900
        const checkWindowSizeAndAddListener = () => {
            if (window.innerWidth > 900) {
                window.addEventListener("resize", handleResizeDebounced);
            }
        };

        checkWindowSizeAndAddListener(); // Check size and possibly add listener

        return () => {
            window.removeEventListener("resize", handleResizeDebounced);
        };
    }, []);


    const [functionKey, setFunctionKey] = useState('');
    const [showResponseModal, setShowResponseModal] = useState(false);

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
                        <p>Wheelset successfully archived. This wheelset will be stored in the Archive.</p>
                    }
                    {functionKey === 'delete' &&
                        <p>Wheelset successfully deleted.</p>
                    }
                    {functionKey === 'restore' &&
                        <p>Wheelset successfully restored.</p>
                    }
                    {functionKey === 'edit' &&
                        <p>Wheelset successfully edited.</p>
                    }
                </Modal.Body>
            </Modal>
        );
    }

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    if (loading) return <LoadingPage classStyle={"loading-in-page"} />

    return (
        <div className='wheelset p-3'>
            <ResponsivePageLayout
                rightContainer={rightContainerStyle}
                leftContent={
                    <div className={partsContainerStyle}>
                        <ResponseModal
                            show={showResponseModal}
                            onHide={() => {
                                setShowResponseModal(false);
                            }}
                        />
                        <div className='upper-container d-flex'>

                            <div className='title'>
                                <button className='back-btn' onClick={handleBackClick}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <h4>Wheelset</h4>
                            </div>

                            <div className="bottom">

                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={"Search for a frame"}
                                />

                                <button className="sort" onClick={() => setShowSort(!showSort)}>
                                    <img src={sort} alt="Sort" className="button-icon" />
                                </button>

                                {(userRole === 'admin' && showArchived) &&
                                    <button className="active" onClick={handleActiveItemClick}>
                                        <span>Active</span>
                                        <i className="fa-solid fa-check"></i>
                                    </button>
                                }
                                {(userRole === 'admin' && !showArchived) &&
                                    <button className="archive" onClick={handleArchiveItemClick}>
                                        <span>Archive</span>
                                        <i className="fa-solid fa-clock-rotate-left"></i>
                                    </button>
                                }
                            </div>
                        </div>

                        {showMiddleSection && (
                            <div className="middle-container">
                                <div className="middle-content">
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
                                                <option value="price">Price</option>
                                                <option value="date">Date Added</option>
                                            </select>

                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                                    fetchItems(); // Fetch items after changing sort order
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

                        <div className='lower-container'>
                            <div className='lower-content'>
                                {filteredItems.length === 0 ? (
                                    <div className="no-items-message">
                                        <p>{displayItem === false ? 'No archived parts' : 'No active parts'}</p>
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <div
                                            key={item.wheelset_id}
                                            className="item-container d-flex"
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <div className="content">
                                                <div className="item-image">
                                                    {item.item_image ? (
                                                        <img
                                                            src={`data:image/jpeg;base64,${item.item_image}`}
                                                            alt={item.item_name}
                                                        />
                                                    ) : (
                                                        <div className="no-image">
                                                            No image attached
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='details'>
                                                    <div className="item-name fw-bold">
                                                        {item.item_name}
                                                    </div>

                                                    <div className="item-price fw-light">
                                                        {PesoFormat.format(item.item_price)}
                                                    </div>
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
                    selectedItem ? (
                        <div className="form-container">
                            <Form
                                selectedItem={selectedItem}
                                setSelectedItem={setSelectedItem}
                                setItems={setItems}
                                refreshWaitlist={refreshWaitlist}
                                onClose={handleCloseView}
                                showArchived={showArchived}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                functionKey={functionKey}
                                setFunctionKey={setFunctionKey}
                                setShowResponseModal={setShowResponseModal}
                            />
                        </div>
                    ) : (
                        <div className="no-selection">
                            Select an item to view details
                        </div>
                    )
                }
            />
        </div>
    );
};

export default Wheelset;
