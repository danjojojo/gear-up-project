import './inventory.scss'
import PageLayout from '../../components/page-layout/page-layout';
import { useState } from 'react';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';
import exit from '../../assets/icons/exit.png';
import edit from '../../assets/icons/edit.png';
import del from '../../assets/icons/delete.png';


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
                            <div className='lower-content'>

                            </div>
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
                                <div className='container-1 d-flex'>
                                    <div className='exit-btn'>
                                        <img src={exit} alt='Filter' className='exit-icon' onClick={() => setIsAddingItem(false)} />
                                    </div>

                                    <div className='edit-btn'>
                                        <img src={edit} alt='Filter' className='edit-icon' />
                                    </div>

                                    <div className='del-btn'>
                                        <img src={del} alt='Sort' className='del-icon' />
                                    </div>
                                </div>

                                <div className='container-2'>

                                </div>

                                <div className='container-3'>

                                </div>

                                <div className='container-4'>

                                </div>

                                <div className='container-5'>

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