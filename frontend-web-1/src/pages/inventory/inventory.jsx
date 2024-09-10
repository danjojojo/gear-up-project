import './inventory.scss'
import PageLayout from '../../components/page-layout/page-layout';
import { useState } from 'react';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';

const Inventory = () => {

    const [isAddingItem, setIsAddingItem] = useState(false);

    return (
        <div className='inventory p-3'>
            <PageLayout
                leftContent={
                    <div className='inventory-content'>
                        <div className='upper-container d-flex'>
                            <button className='add-btn' onClick={() => setIsAddingItem(true)}>
                                Add Item +
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

                        </div>

                    </div>
                }

                rightContent={
                    <div className='inventory-containers'>
                        {!isAddingItem ? (
                            <>
                                <div className='container-content'>
                                    <div className='main-content'>

                                    </div>
                                </div>

                                <div className='container-content'>
                                    <div className='main-content'>

                                    </div>
                                </div>

                                <div className='container-content'>
                                    <div className='main-content'>

                                    </div>
                                </div>

                                <div className='container-content'>
                                    <div className='main-content'>

                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='form-container'>
                                <div className='upper-container d-flex'>
                                    <button className='cancel-btn' onClick={() => setIsAddingItem(false)}>
                                        Cancel
                                    </button>
                                </div>

                                <div className='lower-container'>
                                    <div className='form-content'>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
            />
        </div>
    );
};

export default Inventory;