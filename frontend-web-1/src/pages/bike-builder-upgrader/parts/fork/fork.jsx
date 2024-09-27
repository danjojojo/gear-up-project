import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './fork.scss';
import PageLayout from '../../../../components/page-layout/page-layout';
import filter from '../../../../assets/icons/filter.png';
import sort from '../../../../assets/icons/sort.png';
import SearchBar from '../../../../components/search-bar/search-bar';
import { getForkItems } from '../../../../services/bbuService';
import Form from './form';

const Fork = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showArchived, setShowArchived] = useState(false);
    const [displayItem, setDisplayItem] = useState(true);


    const fetchItems = useCallback(async () => {
        try {
            const data = await getForkItems(displayItem);
            setItems(data);
        } catch (error) {
            console.error('Error fetching fork items:', error);
        }
    }, [displayItem]);


    useEffect(() => {
        fetchItems();
    }, [fetchItems]);


    const handleBackClick = () => {
        navigate('/bike-builder-upgrader');
    };


    // Handle click on an item
    const handleItemClick = (item) => {
        setSelectedItem(item);
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
    }


    // Handle archive item click
    const handleArchiveItemClick = () => {
        setDisplayItem(false)
        setShowArchived(true)
        handleCloseView();
    }

    return (
        <div className='fork p-3'>
            <PageLayout
                leftContent={
                    <div className='parts-content'>
                        <div className='upper-container d-flex'>

                            <div className='title'>
                                Fork
                            </div>

                            <button className='back-btn' onClick={handleBackClick}>
                                Back
                            </button>

                            <SearchBar />

                            <button className='filter'>
                                <img src={filter} alt='Filter' className='button-icon' />
                            </button>

                            <button className='sort'>
                                <img src={sort} alt='Sort' className='button-icon' />
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

                        <div className='lower-container'>
                            <div className='lower-content'>
                                {items.length === 0 ? (
                                    <div className="no-items-message">
                                        {displayItem === false ? 'No archived items' : 'No active items'}
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div
                                            key={item.fork_id}
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

export default Fork;
