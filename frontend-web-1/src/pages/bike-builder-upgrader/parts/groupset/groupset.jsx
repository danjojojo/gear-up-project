import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './groupset.scss';
import PageLayout from '../../../../components/page-layout/page-layout';
import filter from '../../../../assets/icons/filter.png';
import sort from '../../../../assets/icons/sort.png';
import SearchBar from '../../../../components/search-bar/search-bar';
import { getGroupsetItems } from '../../../../services/bbuService';
import Form from './form';

const Groupset = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);


    const fetchItems = async () => {
        try {
            const data = await getGroupsetItems();
            setItems(data);
        } catch (error) {
            console.error('Error fetching frame items:', error);
        }
    }


    useEffect(() => {
        fetchItems();
    }, []);


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

    return (
        <div className='groupset p-3'>
            <PageLayout
                leftContent={
                    <div className='parts-content'>
                        <div className='upper-container d-flex'>

                            <div className='title'>
                                Groupset
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
                        </div>

                        <div className='lower-container'>
                            <div className='lower-content'>
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <div
                                            key={item.groupset_id}
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
                                                        No image available
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
                                ) : (
                                    <div className='no-item'>
                                        No items in the groupset section
                                    </div>
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

export default Groupset;
