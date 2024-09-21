import './waitlist.scss';
import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/page-layout/page-layout';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';
import { getWaitlistItems } from '../../services/waitlistService';

// Parts Form
import FrameForm from './parts-form/frame-form';
import ForkForm from './parts-form/fork-form';
import GroupsetForm from './parts-form/groupset-form';
import WheelsetForm from './parts-form/wheelset-form';
import CockpitForm from './parts-form/cockpit-form';

const Waitlist = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch waitlist items when the component mounts
    const fetchItems = async () => {
        try {
            const data = await getWaitlistItems();
            setItems(data);
        } catch (error) {
            console.error('Error fetching waitlist items:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

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
                            <SearchBar />
                            <button className='filter'>
                                <img src={filter} alt='Filter' className='button-icon' />
                            </button>
                            <button className='sort'>
                                <img src={sort} alt='Sort' className='button-icon' />
                            </button>
                        </div>

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

                                {items.length > 0 ? (
                                    items.map((item) => (
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