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
import { addItem } from '../../services/inventoryService';

const Inventory = () => {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const [addToBikeBuilder, setAddToBikeBuilder] = useState(false); // State for "Add to Bike Builder and Upgrader"
    const [lowStockAlert, setLowStockAlert] = useState(false); // State for "Low Stock Alert"
    const [lowStockThreshold, setLowStockThreshold] = useState(''); // State for stock threshold
    const [isAddingStock, setIsAddingStock] = useState(false); // To toggle between view and input
    const [stockInput, setStockInput] = useState(0);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [category, setCategory] = useState('Accessories');
    const [bikeParts, setBikeParts] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const itemData = new FormData();
        itemData.append('itemName', itemName);
        itemData.append('itemPrice', parseFloat(itemPrice));
        itemData.append('stock', parseInt(stockInput, 10));
        itemData.append('category', category);
        itemData.append('lowStockAlert', lowStockAlert);
        itemData.append('lowStockThreshold', lowStockAlert ? parseInt(lowStockThreshold, 10) : null);
        itemData.append('bikeParts', addToBikeBuilder ? bikeParts : null);
        if (selectedFile) {
            itemData.append('itemImage', selectedFile);
        }

        for (const [key, value] of itemData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            await addItem(itemData);
            alert('Item added successfully');

            setItemName('');
            setItemPrice('');
            setStockInput('');
            setCategory('Accessories');
            setLowStockAlert(false);
            setLowStockThreshold('');
            setAddToBikeBuilder(false);
            setBikeParts('');
            setSelectedFile(null);
            setIsAddingItem(false);

        } catch (error) {
            alert('An error occurred while adding the item');
        }
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

    const handleStockInputChange = (event) => {
        setStockInput(event.target.value);
    };

    const itemCount = 10;

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

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }

                rightContent={
                    <div className='inventory-containers'>
                        {viewingItem && !isAddingItem ? (

                            //VIEW ITEM
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

                                    <div className="item-name form-group">
                                        <label htmlFor="item-name">Name</label>
                                        <input
                                            type="text"
                                            id="item-name"
                                            name="itemName"
                                            value={viewingItem.name}
                                            readOnly
                                        />
                                    </div>

                                    <div className="item-price form-group">
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

                                    <div className='low-stock-container d-flex justify-content-between'>
                                        <div className='title'>Low Stock Alert</div>
                                        <div className="switch form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="lowStock"
                                                checked={lowStockAlert}
                                                onChange={() => setLowStockAlert(!lowStockAlert)}
                                            />
                                        </div>
                                    </div>

                                    {lowStockAlert && (
                                        <div className="low-stock-threshold form-group">
                                            <input
                                                type="text"
                                                id="low-stock-threshold"
                                                name="lowStockThreshold"
                                                value={lowStockThreshold}
                                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                                placeholder="Enter stock threshold"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className='bbu-container d-flex justify-content-between'>
                                        <div className='title'>Add to Bike Builder and Upgrader</div>
                                        <div className="switch form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="addPart"
                                                checked={addToBikeBuilder}
                                                onChange={() => setAddToBikeBuilder(!addToBikeBuilder)}
                                            />
                                        </div>
                                    </div>

                                    {addToBikeBuilder && (
                                        <div className='bike-part-container d-flex justify-content-between'>
                                            <div className='title'>Bike Part</div>
                                            <select className='dropdown' name="bikeParts">
                                                <option value="frame">Frame</option>
                                                <option value="wheel">Wheel</option>
                                                <option value="handlebar">Handlebar</option>
                                                {/* Add more bike parts as needed */}
                                            </select>
                                        </div>
                                    )}

                                    <ImageUploadButton />

                                    <button type="submit" className="submit-btn">
                                        Save
                                    </button>
                                </form>
                            </div>


                            // ADD ITEM
                        ) : isAddingItem ? (
                            <div className='form-container'>
                                <form className='form-content' onSubmit={handleFormSubmit}>
                                    <div className='container-1 d-flex'>
                                        <div className='exit-btn'>
                                            <img src={exit} alt='Exit' className='exit-icon' onClick={() => setIsAddingItem(false)} />
                                        </div>
                                    </div>

                                    <div className=" item-name form-group">
                                        <label htmlFor="item-name">Name</label>
                                        <input
                                            type="text"
                                            id="item-name"
                                            name="itemName"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            placeholder="Enter item name"
                                            required
                                        />
                                    </div>

                                    <div className="item-price form-group">
                                        <label htmlFor="item-price">Price</label>
                                        <input
                                            type="text"
                                            id="item-price"
                                            name="itemPrice"
                                            value={itemPrice}
                                            onChange={(e) => setItemPrice(e.target.value)}
                                            placeholder="Enter item price"
                                            required
                                        />
                                    </div>

                                    <div className='stock-container d-flex justify-content-between'>
                                        <div className='title'>Stock Count</div>
                                        {isAddingStock ? (
                                            <input
                                                type="number"
                                                className="count-input"
                                                value={stockInput}
                                                min="0"
                                                onChange={handleStockInputChange}
                                            />
                                        ) : (
                                            <div className='count'>{stockInput}</div>
                                        )}
                                        <button
                                            className='stock-btn'
                                            type='button'
                                            onClick={() => {
                                                if (isAddingStock) {
                                                    // Confirm and switch back to text view mode
                                                    setIsAddingStock(false);
                                                } else {
                                                    // Switch to input mode
                                                    setIsAddingStock(true);
                                                }
                                            }}
                                        >
                                            {isAddingStock ? 'Confirm' : 'Add Stock'}
                                        </button>
                                    </div>

                                    <div className='category-container d-flex justify-content-between'>
                                        <div className='title'>Category</div>
                                        <select
                                            className='dropdown'
                                            name="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>

                                    <div className='low-stock-container d-flex justify-content-between'>
                                        <div className='title'>Low Stock Alert</div>
                                        <div className="switch form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="lowStock"
                                                checked={lowStockAlert}
                                                onChange={() => setLowStockAlert(!lowStockAlert)}
                                            />
                                        </div>
                                    </div>

                                    {lowStockAlert && (
                                        <div className="low-stock-threshold form-group">
                                            <input
                                                type="text"
                                                id="low-stock-threshold"
                                                name="lowStockThreshold"
                                                value={lowStockThreshold}
                                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                                placeholder="Enter stock threshold"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className='bbu-container d-flex justify-content-between'>
                                        <div className='title'>Add to Bike Builder and Upgrader</div>
                                        <div className="switch form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="addPart"
                                                checked={addToBikeBuilder}
                                                onChange={() => setAddToBikeBuilder(!addToBikeBuilder)}
                                            />
                                        </div>
                                    </div>

                                    {addToBikeBuilder && (
                                        <div className='bike-part-container d-flex justify-content-between'>
                                            <div className='title'>Bike Part</div>
                                            <select
                                                className='dropdown'
                                                name="bikeParts"
                                                value={bikeParts}
                                                onChange={(e) => setBikeParts(e.target.value)}
                                            >
                                                <option value="Frame">Frame</option>
                                                <option value="Wheel">Wheel</option>
                                                <option value="Handlebar">Handlebar</option>
                                            </select>
                                        </div>
                                    )}

                                    <ImageUploadButton onFileSelect={handleFileSelect} />

                                    <button type="submit" className="submit-btn">
                                        Add
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div className='container-content'>
                                    <div className='main-content'>
                                        {/* Add content or placeholder */}
                                    </div>
                                </div>

                                <div className='container-content'>
                                    <div className='main-content'>
                                        {/* Add content or placeholder */}
                                    </div>
                                </div>

                                <div className='container-content'>
                                    <div className='main-content'>
                                        {/* Add content or placeholder */}
                                    </div>
                                </div>

                                <div className='container-content'>
                                    <div className='main-content'>
                                        {/* Add content or placeholder */}
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