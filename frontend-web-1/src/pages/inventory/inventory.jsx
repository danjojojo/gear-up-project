import './inventory.scss';
import PageLayout from '../../components/page-layout/page-layout';
import { useState } from 'react';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';
import exit from '../../assets/icons/exit.png';
import edit from '../../assets/icons/edit.png';
import del from '../../assets/icons/delete.png';
import ImageUploadButton from '../../components/img-upload-button/img-upload-button';

const Inventory = () => {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    const handleItemClick = (item) => {
        setViewingItem(item);
        setIsAddingItem(false); // Close the add item form
    };

    const handleCloseView = () => {
        setViewingItem(null);
    };

    const handleAddItemClick = () => {
        setIsAddingItem(true);
        setViewingItem(null); // Close the item view
    };

    const itemCount = 20;

    return (
        <div className='inventory p-3'>
            <PageLayout
                leftContent={
                    <div className='inventory-content'>
                        <div className='upper-container d-flex'>
                            <button className='add-btn' onClick={handleAddItemClick}>
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
                                {Array.from({ length: itemCount }, (_, index) => (
                                    <div
                                        key={index}
                                        className="item-container"
                                        onClick={() => handleItemClick({ name: `Item ${index}`, price: `$${index * 10}`, stock: 10 })}
                                    >
                                        {/* No content inside the item container */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }

                rightContent={
                    <div className='inventory-containers'>
                        {viewingItem && !isAddingItem ? (
                            <div className='form-container'>
                                <form className='form-content' onSubmit={handleFormSubmit}>
                                    <div className='container-1 d-flex'>
                                        <div className='exit-btn'>
                                            <img src={exit} alt='Exit' className='exit-icon' onClick={handleCloseView} />
                                        </div>
                                        <div className='edit-btn'>
                                            <img src={edit} alt='Edit' className='edit-icon' />
                                        </div>
                                        <div className='del-btn'>
                                            <img src={del} alt='Delete' className='del-icon' />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="item-name">Name</label>
                                        <input
                                            type="text"
                                            id="item-name"
                                            name="itemName"
                                            value={viewingItem.name}
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="item-price">Price</label>
                                        <input
                                            type="text"
                                            id="item-price"
                                            name="itemPrice"
                                            value={viewingItem.price}
                                            readOnly
                                        />
                                    </div>

                                    <div className='stock-container d-flex justify-content-between'>
                                        <div className='title'>Stock Count</div>
                                        <div className='count'>{viewingItem.stock}</div>
                                        <button className='stock-btn' type='button'>
                                            Add Stock
                                        </button>
                                    </div>

                                    <div className='category-container d-flex justify-content-between'>
                                        <div className='title'>Category</div>
                                        <select className='dropdown' name="category" disabled>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div className='soldby-container d-flex justify-content-between'>
                                        <div className='title'>Sold By</div>
                                        <select className='dropdown' name="soldBy" disabled>
                                            <option value="piece">Piece</option>
                                        </select>
                                    </div>

                                    <div className='low-stock-container d-flex justify-content-between'>
                                        <div className='title'>Low Stock Alert</div>
                                        <div className="switch form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="lowStock" disabled />
                                        </div>
                                    </div>

                                    <div className='bbu-container d-flex justify-content-between'>
                                        <div className='title'>Add to Bike Builder and Upgrader</div>
                                        <div className="switch form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="addPart" disabled />
                                        </div>
                                    </div>

                                    <div className='bike-part-container d-flex justify-content-between'>
                                        <div className='title'>Bike Part</div>
                                        <select className='dropdown' name="bikeParts" disabled>
                                            <option value="frame">Frame</option>
                                        </select>
                                    </div>

                                    <ImageUploadButton />

                                    <button type="submit" className="submit-btn">
                                        Save
                                    </button>
                                </form>
                            </div>
                        ) : isAddingItem ? (
                            <div className='form-container'>
                                <form className='form-content' onSubmit={handleFormSubmit}>
                                    <div className='container-1 d-flex'>
                                        <div className='exit-btn'>
                                            <img src={exit} alt='Exit' className='exit-icon' onClick={() => setIsAddingItem(false)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="item-name">Name</label>
                                        <input
                                            type="text"
                                            id="item-name"
                                            name="itemName"
                                            placeholder="Enter item name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="item-price">Price</label>
                                        <input
                                            type="text"
                                            id="item-price"
                                            name="itemPrice"
                                            placeholder="Enter item price"
                                            required
                                        />
                                    </div>

                                    <div className='stock-container d-flex justify-content-between'>
                                        <div className='title'>Stock Count</div>
                                        <div className='count'>10</div>
                                        <button className='stock-btn' type='button'>
                                            Add Stock
                                        </button>
                                    </div>

                                    <div className='category-container d-flex justify-content-between'>
                                        <div className='title'>Category</div>
                                        <select className='dropdown' name="category">
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div className='soldby-container d-flex justify-content-between'>
                                        <div className='title'>Sold By</div>
                                        <select className='dropdown' name="soldBy">
                                            <option value="piece">Piece</option>
                                        </select>
                                    </div>

                                    <div className='low-stock-container d-flex justify-content-between'>
                                        <div className='title'>Low Stock Alert</div>
                                        <div className="switch form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="lowStock" />
                                        </div>
                                    </div>

                                    <div className='bbu-container d-flex justify-content-between'>
                                        <div className='title'>Add to Bike Builder and Upgrader</div>
                                        <div className="switch form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="addPart" />
                                        </div>
                                    </div>

                                    <div className='bike-part-container d-flex justify-content-between'>
                                        <div className='title'>Bike Part</div>
                                        <select className='dropdown' name="bikeParts">
                                            <option value="frame">Frame</option>
                                        </select>
                                    </div>

                                    <ImageUploadButton />

                                    <button type="submit" className="submit-btn">
                                        Add
                                    </button>
                                </form>
                            </div>
                        ) : (
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
                        )}
                    </div>
                }
            />
        </div>
    );
};

export default Inventory;