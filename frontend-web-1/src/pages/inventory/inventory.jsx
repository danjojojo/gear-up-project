import './inventory.scss'
import PageLayout from '../../components/page-layout/page-layout';
import { useState } from 'react';

const Inventory = () => {

    const [isAddingItem, setIsAddingItem] = useState(false);

    return (
        <div className='inventory p-3'>
            <PageLayout
                leftContent={
                    <div>
                        <div>
                            <button className='add-btn' onClick={() => setIsAddingItem(true)}>
                                Add Item +
                            </button>
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
                            <div className='add-container'>
                                <button className='cancel-btn' onClick={() => setIsAddingItem(false)}>
                                    Cancel
                                </button>

                            </div>
                        )}
                    </div>
                }
            />
        </div>
    );
};

export default Inventory;