import './waitlist.scss';
import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/page-layout/page-layout';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';
import { getWaitlistItems } from '../../services/waitlistService';

const Waitlist = () => {
    const [items, setItems] = useState([]);

    // Fetch waitlist items when the component mounts
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getWaitlistItems();
                setItems(data);
            } catch (error) {
                console.error('Error fetching waitlist items:', error);
            }
        };

        fetchItems();
    }, []);

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
                                            key={item.item_id} // Use item_id as key
                                            className="item-container d-flex p-4"
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
                rightContent={<div></div>}
            />
        </div>
    );
};

export default Waitlist;