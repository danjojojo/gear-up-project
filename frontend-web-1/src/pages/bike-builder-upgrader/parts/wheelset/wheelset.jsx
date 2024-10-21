import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './wheelset.scss';
import PageLayout from '../../../../components/page-layout/page-layout';
import sort from '../../../../assets/icons/sort.png';
import arrowUp from "../../../../assets/icons/arrow-up.png";
import arrowDown from "../../../../assets/icons/arrow-down.png";
import SearchBar from '../../../../components/search-bar/search-bar';
import { getWheelsetItems } from '../../../../services/bbuService';
import Form from './form';

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
        navigate('/bike-builder-upgrader');
    };


    // Handle click on an item
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsEditing(false)
    };


    // Handle closing the form
    const handleCloseView = () => {
        setSelectedItem(null);
    };


    const refreshWaitlist = () => {
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


    return (
        <div className='wheelset p-3'>
            <PageLayout
                leftContent={
                    <div className='parts-content'>
                        <div className='upper-container d-flex'>

                            <div className='title'>
                                Wheelset
                            </div>

                            <button className='back-btn' onClick={handleBackClick}>
                                Back
                            </button>

                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <button className="sort" onClick={() => setShowSort(!showSort)}>
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
                                        {displayItem === false ? 'No archived items' : 'No active items'}
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <div
                                            key={item.wheelset_id}
                                            className="item-container d-flex"
                                            onClick={() => handleItemClick(item)}
                                        >
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
                                                    ₱ {item.item_price}
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
