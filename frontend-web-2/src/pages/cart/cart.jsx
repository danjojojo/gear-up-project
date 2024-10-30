import "./cart.scss"
import React, {useState, useEffect, useRef} from "react";
import { 
    getBUCartItems,
    checkPartInBUCart,
    updateBuPartQty,
    removeFromBUCart,
    updateBuCartStockCounts,

    getBBCartItems,
    checkPartInBBCart,
    removeFromBBCart
} from "../../utils/cartDB";
import {Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import { useCartItems } from "../../utils/cartItems";

const Cart = () => {
    const { bbParts, buParts, totalPrice, loading, fetchCartItems } = useCartItems();
    const [checkedBbParts, setCheckedBbParts] = useState(0);
    const [checkedBbPartsTotalPrice, setCheckedBbPartsTotalPrice] = useState(0);
    
    const [editBbParts, setEditBbParts] = useState(false);
    const [editBuParts, setEditBuParts] = useState(false);
    
    const [checkedBuParts, setCheckedBuParts] = useState(0);
    const [checkedBuPartsTotalPrice, setCheckedBuPartsTotalPrice] = useState(0);

    const navigate = useNavigate();
   
    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    const handleCheckPartInBUCart = async (partId) => {
        await checkPartInBUCart(partId);
        fetchCartItems();
    }
    const handleBuPartQty = (partId, qty) => {
        updateBuPartQty(partId, qty);
        fetchCartItems(); // Re-fetch to sync with the database
    }
    const handleRemoveBuPart = async (partId) => {
        await removeFromBUCart(partId);
        fetchCartItems();
    }
    const getAllCheckedAndTotalPriceBuParts = () => {
        const allCheckedBuParts = buParts.filter(part => part.checked === 1);
        const totalPriceBuParts = allCheckedBuParts.reduce((acc, part) => 
            acc + Number(part.item_price) * part.qty, 0
        );
        setCheckedBuPartsTotalPrice(totalPriceBuParts);
        setCheckedBuParts(allCheckedBuParts.length);
    }

    const handleCheckPartInBBCart = async (partId) => {
        await checkPartInBBCart(partId);
        fetchCartItems();
    }
    const handleRemoveBbPart = async (partId) => {
        await removeFromBBCart(partId);
        fetchCartItems();
    }
    const getAllCheckedAndTotalPriceBbParts = () => {
        const allCheckedBbParts = bbParts.filter(part => part.checked === 1);
        const totalPriceBbParts = allCheckedBbParts.reduce((acc, part) => 
            acc + Number(part.build_price), 0
        );
        setCheckedBbPartsTotalPrice(totalPriceBbParts);
        setCheckedBbParts(allCheckedBbParts.length);
    }

    const proceedCheckout = () => {
        navigate("/checkout");
    }

    useEffect(() => {
        getAllCheckedAndTotalPriceBuParts();
        getAllCheckedAndTotalPriceBbParts();
    }, [buParts, bbParts]);

    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showPreviewBUModal, setShowPreviewBUModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageBBClick = (image) => {
        setSelectedImage(image); // Set the selected image
        setShowPreviewModal(true); // Open the modal
    };

    const handleImageBUClick = (image) => {
        setSelectedImage(image); // Set the selected image
        setShowPreviewBUModal(true); // Open the modal
    };

    function PreviewBBModal({ image, ...props}) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{zIndex: '10000'}}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Preview
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%' 
                    }}
                >
                    <img src={image} alt="Preview" 
                        style={{width: "100%", height: "auto", scale: "1.5", imageRendering: 'auto'}}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    function PreviewBUModal({ image, ...props}) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Preview
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body 
                    style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%' 
                    }}
                >
                    <img 
                        src={`data:image/jpeg;base64,${image}`} 
                        alt="Preview" 
                        style={{ height: "350px", imageRendering: 'auto' }}
                    />
                </Modal.Body>
            </Modal>
        );
    }   

    return (
        <>
            <PreviewBBModal 
                show={showPreviewModal}
                onHide={() => setShowPreviewModal(false)}
                image={selectedImage}
            />
            <PreviewBUModal 
                show={showPreviewBUModal}
                onHide={() => setShowPreviewBUModal(false)}
                image={selectedImage}
            />
            <div className="cart">
                <div className="title">
                    <h4>Cart [{buParts.length + bbParts.length}]</h4>
                </div>
                <div className="upper">

                    <div className="left">
                        <div className="nav">
                            <h4>Bike Builder [{bbParts.length}]</h4>
                            {!editBbParts && <p onClick={() => setEditBbParts(true)}>Edit</p>}
                            {editBbParts && <p onClick={() => setEditBbParts(false)}>Done</p>}
                        </div>
                        {loading && <div className="loading">
                                <i className="fa-solid fa-gear fa-spin"></i>
                        </div>
                        }
                        {!loading && <div className="cart-items">
                            {/* if buParts is empty */}
                            {bbParts.length === 0 && 
                                <p className="empty-cart">No builds from Bike Builder were added to cart.</p>
                            }
                            {bbParts.map((part, index) => 
                                <div className="item" key={index}>
                                    <div className="left-item-content">
                                        <input 
                                        type="checkbox"
                                        onChange={() => handleCheckPartInBBCart(part.id)}
                                        checked={part.checked === 1 ? true : false}
                                        />
                                        <div className="img-container">
                                            <img 
                                                src={part.image}
                                                style={{width: "100%", height: "150px", objectFit: "cover", paddingLeft: "auto"}}
                                                alt="part" 
                                                onClick={() => {
                                                    handleImageBBClick(part.image);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="right-item-content">
                                        <div className="top">
                                            <div className="top-nav">
                                                <h5>Bike Build {part.id}</h5>
                                                {editBbParts && 
                                                    <>
                                                        <i onClick={() => handleRemoveBbPart(part.id)}
                                                        className="fa-solid fa-trash"></i>
                                                    </>
                                                }
                                            </div>
                                            <p className="subtitle">{part.build_id}</p>
                                        </div>
                                        <div className="bottom">
                                            <p>{PesoFormat.format(part.build_price)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>}
                        <div className="subtotal">
                            <h4>Subtotal</h4>
                            <p>{PesoFormat.format(checkedBbPartsTotalPrice)}</p>
                        </div>
                    </div>
                    <div className="right">
                        <div className="nav">
                            <h4>Bike Upgrader [{buParts.length}]</h4>
                            {!editBuParts && <p onClick={() => setEditBuParts(true)}>Edit</p>}
                            {editBuParts && <p onClick={() => setEditBuParts(false)}>Done</p>}
                        </div>
                        {loading && <div className="loading">
                                <i className="fa-solid fa-gear fa-spin"></i>
                        </div>
                        }
                        {!loading && <div className="cart-items">
                            {/* if buParts is empty */}
                            {buParts.length === 0 && 
                                <p className="empty-cart">No parts from Bike Upgrader were added to cart.</p>
                            }
                            {buParts.map((part, index) => 
                                <div className="item" key={index}>
                                    <div className="left-item-content">
                                        <input 
                                        type="checkbox"
                                        onChange={() => handleCheckPartInBUCart(part.id)}
                                        checked={part.checked === 1 && part.stock_count !== 0 ? true : false}
                                        disabled={part.stock_count === 0}
                                        />
                                        {/* img */}
                                        {/* <img src="https://via.placeholder.com/150" alt="part" /> */}
                                        <div className="img-container">
                                            <img 
                                                src={`data:image/jpeg;base64,${part.item_image}`}
                                                alt="part" 
                                                onClick={() => {
                                                    handleImageBUClick(part.item_image);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="right-item-content">
                                        <div className="top">
                                            <div className="top-nav">
                                                <h5>{part.item_name}</h5>
                                                {editBuParts && 
                                                    <>
                                                        <i onClick={() => handleRemoveBuPart(part.id)}
                                                        className="fa-solid fa-trash"></i>
                                                    </>
                                                }
                                            </div>
                                            <p>{part.bike_parts}</p>
                                        </div>
                                        <div className="bottom">
                                            <p>{PesoFormat.format(part.item_price * part.qty)}</p>
                                                {part.stock_count !== 0 && 
                                                    <div className="qty">
                                                        {part.qty === part.stock_count && <p className="max"> Max </p>}
                                                        <button
                                                            onClick={() => {handleBuPartQty(part.id, -1)}}
                                                            disabled={part.qty === 1} // Disable if quantity is 1
                                                            className={part.qty === 1 ? "minus disabled" : "minus"}
                                                        >-</button>
                                                        <p>{part.qty}</p>
                                                        <button
                                                            onClick={() => handleBuPartQty(part.id, 1)}
                                                            disabled={part.qty === part.stock_count}
                                                            className={part.qty === part.stock_count ? "plus disabled" : "plus"}
                                                        >+</button>
                                                    </div>
                                                }
                                                {part.stock_count === 0 && 
                                                    <div className="no-stock">
                                                        <p>No stock</p>
                                                    </div>
                                                }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>}
                        <div className="subtotal">
                            <h4>Subtotal</h4>
                            <p>{PesoFormat.format(checkedBuPartsTotalPrice)}</p>
                        </div>
                    </div>
                </div>
                <div className="lower">
                    <h4 className="price">
                        Total: {PesoFormat.format(totalPrice)}
                    </h4>
                    <button
                        onClick={proceedCheckout}
                        disabled={checkedBuParts + checkedBbParts === 0}
                        className={checkedBuParts + checkedBbParts > 0 ? "enabled" : "disabled"}
                    >
                        Proceed to Checkout [{checkedBuParts + checkedBbParts}]
                    </button>
                </div>
            </div>
        </>
    );

};

export default Cart;