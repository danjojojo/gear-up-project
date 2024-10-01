import './waitlist.scss';
import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../components/page-layout/page-layout';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';
import arrowUp from "../../assets/icons/arrow-up.png";
import arrowDown from "../../assets/icons/arrow-down.png";
import { getWaitlistItems } from '../../services/waitlistService';

// Parts Form
import FrameForm from './parts-form/frame-form';
import ForkForm from './parts-form/fork-form';
import GroupsetForm from './parts-form/groupset-form';
import WheelsetForm from './parts-form/wheelset-form';
import CockpitForm from './parts-form/cockpit-form';
import HeadsetForm from './parts-form/headset-form';
import HandlebarForm from './parts-form/handlebar-form';
import StemForm from './parts-form/stem-form';
import HubsForm from './parts-form/hubs-form';

const Waitlist = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortCriteria, setSortCriteria] = useState("name"); // Default sorting by name
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedPart, setSelectedPart] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const showMiddleSection = showFilter || showSort;

    // Fetch waitlist items when the component mounts
    const fetchItems = useCallback(async () => {
        try {
            const data = await getWaitlistItems();

            // Filter items by selected part
            const filteredItems = data.filter((item) => {
                return selectedPart ? item.bike_parts === selectedPart : true;
            });

            // Sort items by item name or date added
            const sortedItems = filteredItems.sort((a, b) => {
                let aValue, bValue;

                // Determine sorting criteria based on sortCriteria state
                if (sortCriteria === "name") {
                    aValue = a.item_name.toLowerCase(); // Normalize case for comparison
                    bValue = b.item_name.toLowerCase();
                } else if (sortCriteria === "date") {
                    aValue = new Date(a.date_created);
                    bValue = new Date(b.date_created);
                }

                // Perform comparison based on sort order
                if (sortOrder === "asc") {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });

            setItems(sortedItems);
        } catch (error) {
            console.error("Error fetching waitlist items:", error);
        }
    }, [selectedPart, sortCriteria, sortOrder]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Assuming items is an array of item objects
    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const refreshWaitlist = () => {
        fetchItems();
    };

    // Handle click on an item
    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // Handle closing the form
    const handleCloseView = () => {
        setSelectedItem(null);
    };

    return (
        <div className='waitlist p-3'>
            <PageLayout
                leftContent={
                    <div className='waitlist-content'>
                        <div className='upper-container d-flex'>
                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Toggle filter visibility */}
                            <button className="filter" onClick={() => setShowFilter(!showFilter)}>
                                <img src={filter} alt="Filter" className="button-icon" />
                            </button>

                            {/* Toggle sort visibility */}
                            <button className="sort" onClick={() => setShowSort(!showSort)}>
                                <img src={sort} alt="Sort" className="button-icon" />
                            </button>
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
                                                onChange={(e) => setSelectedPart(e.target.value)}
                                                value={selectedPart}
                                            >
                                                <option value="">Bike Parts</option>
                                                {["Frame", "Fork", "Groupset", "Wheelset", "Cockpit",
                                                    "Headset", "Handlebar", "Stem", "Hubs"].map((parts) => (
                                                        <option key={parts} value={parts}>{parts}</option>
                                                    ))}
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

                        <div className='lower-container'>
                            <div className='lower-content'>
                                <div className="item-container-title d-flex p-4 bg-secondary">
                                    <div className="item-name fw-bold text-light">
                                        Item Name
                                    </div>

                                    <div className="bike-part fw-bold text-light">
                                        Bike Part
                                    </div>

                                    <div className="date fw-bold text-light">
                                        Date Added
                                    </div>

                                    <div className="time fw-bold text-light">
                                        Time Added
                                    </div>
                                </div>

                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <div
                                            key={item.waitlist_item_id}
                                            className="item-container d-flex p-4"
                                            onClick={() => handleItemClick(item)} // Add click handler
                                        >
                                            <div className="item-name fw-bold">
                                                {item.item_name}
                                            </div>

                                            <div className="bike-part">
                                                {item.bike_parts}
                                            </div>

                                            <div className="date">
                                                {new Date(item.date_created).toLocaleDateString()}
                                            </div>

                                            <div className="time">
                                                {new Date(item.date_created).toLocaleTimeString(
                                                    [], { hour: 'numeric', minute: '2-digit' }
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='no-item'>
                                        No items in the waitlist
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                rightContent={
                    selectedItem ? (
                        <div className="form-container">

                            {selectedItem.bike_parts === 'Frame' && (
                                <FrameForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Fork' && (
                                <ForkForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Groupset' && (
                                <GroupsetForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Wheelset' && (
                                <WheelsetForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Cockpit' && (
                                <CockpitForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Headset' && (
                                <HeadsetForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Handlebar' && (
                                <HandlebarForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Stem' && (
                                <StemForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}

                            {selectedItem.bike_parts === 'Hubs' && (
                                <HubsForm
                                    waitlistItemID={selectedItem.waitlist_item_id}
                                    itemID={selectedItem.item_id}
                                    itemName={selectedItem.item_name}
                                    itemPrice={selectedItem.item_price}
                                    onClose={handleCloseView}
                                    refreshWaitlist={refreshWaitlist}
                                />
                            )}


                        </div>
                    ) : (
                        <div className="no-selection">
                            Select an item to view details
                        </div>
                    )
                }
            />
        </div >
    );
};

export default Waitlist;