import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getFrameItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { Modal } from 'react-bootstrap';

const Frame = ({ onAddToBuild }) => {
    const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc"); // State to manage sort order
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setShowModal(false);
    };

    const fetchItems = useCallback(async () => {
        try {
            let data = await getFrameItems();

            // Apply sorting based on the sortOrder state
            data = data.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.item_price - b.item_price;
                } else {
                    return b.item_price - a.item_price;
                }
            });

            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching frame items:", error);
        }
    }, [sortOrder]); // Include sortOrder in the dependencies to update when sortOrder changes

    useEffect(() => {
        fetchItems();
    }, [fetchItems]); // Properly include fetchItems

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    return (
        <div className="parts-container">
            <div className="sort-container">
                <div className='sort-title'>
                    Sort Price :
                </div>
                <button
                    className="btn"
                    onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                >
                    {sortOrder === "asc" ? (
                        <img src={arrowDown} alt="Sort Descending" />
                    ) : (
                        <img src={arrowUp} alt="Sort Ascending" />
                    )}
                </button>
            </div>

            {loading &&
                <div className='loading'>
                    <i className='fa-solid fa-gear fa-spin'></i>
                </div>
            }
            {!loading &&
                <div className="parts-cards">
                    {items.map((item) => (
                        <div className="parts-card" key={item.frame_id} onClick={() => openModal(item)}>
                            <div className="item-image" onClick={(e) => { e.stopPropagation(); onAddToBuild(item); }}>
                                {item.item_image ? (
                                    <img src={`data:image/png;base64,${item.item_image}`} alt="frame" />
                                ) : (
                                    <p>No Image Available</p>
                                )}
                            </div>
                            <div className="item-name">{item.item_name} 
                                <div className="item-price-1">{PesoFormat.format(item.item_price)}</div>
                            </div>
                            <div className="item-price">
                                {PesoFormat.format(item.item_price)}
                                <br />
                                {item.purpose}
                                <br />
                                {item.frame_size} - {item.head_tube_type}
                            </div>

                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header onClick={(e) => e.stopPropagation()}>Details</Accordion.Header>
                                    <Accordion.Body onClick={(e) => e.stopPropagation()}>{item.description}</Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header onClick={(e) => e.stopPropagation()}>Tech Specs</Accordion.Header>
                                    <Accordion.Body onClick={(e) => e.stopPropagation()}>
                                        <div className='specs-container'>Purpose: {item.purpose}</div>
                                        <div className='specs-container'>Frame Size: {item.frame_size}</div>
                                        <div className='specs-container'>Head Tube Type: {item.head_tube_type}</div>
                                        <div className='specs-container'>Head Tube Upper Diameter: {item.head_tube_upper_diameter}</div>
                                        <div className='specs-container'>Head Tube Lower Diameter: {item.head_tube_lower_diameter}</div>
                                        <div className='specs-container'>Seatpost Diameter: {item.seatpost_diameter}</div>
                                        <div className='specs-container'>Frame Axle Type: {item.axle_type}</div>
                                        <div className='specs-container'>Frame Axle Diameter: {item.axle_diameter}</div>
                                        <div className='specs-container'>Frame Bottom Bracket Type: {item.bottom_bracket_type}</div>
                                        <div className='specs-container'>Frame Bottom Bracket Width: {item.bottom_bracket_width}</div>
                                        <div className='specs-container'>Frame Rotor Size: {item.rotor_size}</div>
                                        <div className='specs-container'>Frame Max Tire Width: {item.max_tire_width}</div>
                                        <div className='specs-container'>Rear Hub Width: {item.rear_hub_width}</div>
                                        <div className='specs-container'>Material: {item.material}</div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    ))}
                </div>
            }

            {/* Modal Component */}
            {
                selectedItem && (
                    <Modal show={showModal} onHide={closeModal}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal-content">
                                <div className="modal-image">
                                    {selectedItem.item_image ? (
                                        <img
                                            src={`data:image/png;base64,${selectedItem.item_image}`}
                                            alt="frame"
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                padding: "50px",
                                                borderRadius: "10px",
                                            }}
                                        />
                                    ) : (
                                        <p>No Image Available</p>
                                    )}
                                </div>
                                <div className="modal-details">
                                    <h4 className='ps-3 fw-bold'>{selectedItem.item_name}</h4>
                                    <h5 className='ps-3'>Price: {PesoFormat.format(selectedItem.item_price)}</h5>
                                    <h6 className='p-3'>{selectedItem.description}</h6>
                                    <h6 className='ps-3'>Technical Specifications:</h6>
                                    <ul>
                                        <li>Purpose: {selectedItem.purpose}</li>
                                        <li>Frame Size: {selectedItem.frame_size}</li>
                                        <li>Head Tube Type: {selectedItem.head_tube_type}</li>
                                        <li>Head Tube Upper Diameter: {selectedItem.head_tube_upper_diameter}</li>
                                        <li>Head Tube Lower Diameter: {selectedItem.head_tube_lower_diameter}</li>
                                        <li>Seatpost Diameter: {selectedItem.seatpost_diameter}</li>
                                        <li>Frame Axle Type: {selectedItem.axle_type}</li>
                                        <li>Frame Axle Diameter: {selectedItem.axle_diameter}</li>
                                        <li>Frame Bottom Bracket Type: {selectedItem.bottom_bracket_type}</li>
                                        <li>Frame Bottom Bracket Width: {selectedItem.bottom_bracket_width}</li>
                                        <li>Frame Rotor Size: {selectedItem.rotor_size}</li>
                                        <li>Frame Max Tire Width: {selectedItem.max_tire_width}</li>
                                        <li>Rear Hub Width: {selectedItem.rear_hub_width}</li>
                                        <li>Material: {selectedItem.material}</li>
                                    </ul>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                )
            }
        </div >
    );
};

export default Frame;
