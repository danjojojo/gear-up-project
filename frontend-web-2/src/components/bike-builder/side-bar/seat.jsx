import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getSeatItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const Seat = ({ onAddToBuild, selectedFrame }) => {
    const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(true);
    const { typeTag } = useParams();
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
            const data = await getSeatItems(typeTag);

            // Apply filtering logic based on selected frame attributes
            const filteredSeats = data.filter(item => {
                const isSeatpostDiameterMatch = item.seatpost_diameter === selectedFrame.seatpost_diameter;

                // Return only if seatpost diameter matches
                return isSeatpostDiameterMatch;
            });

            // Sort the filtered results based on the sort order
            const sortedSeats = filteredSeats.sort((a, b) => {
                return sortOrder === "asc" ? a.item_price - b.item_price : b.item_price - a.item_price;
            });

            setItems(sortedSeats);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching seat items:", error);
        }
    }, [sortOrder, selectedFrame]);

    useEffect(() => {
        if (selectedFrame) {
            fetchItems();
        }
    }, [fetchItems, selectedFrame]);

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
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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

            {!loading && <div className="parts-cards">
                {items.map((item) => (
                    <div className="parts-card" key={item.seat_id} onClick={() => openModal(item)}>
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
                            {item.seatpost_diameter} - {item.saddle_material}
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Details</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>{item.description}</Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Tech Specs</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>
                                    <div className='specs-container'>Seatpost Diameter: {item.seatpost_diameter}</div>
                                    <div className='specs-container'>Seatpost Length: {item.seatpost_length}</div>
                                    <div className='specs-container'>Seat Clamp Type: {item.seat_clamp_type}</div>
                                    <div className='specs-container'>Saddle Material: {item.saddle_material}</div>
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
                                <div className="modal-image"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    {selectedItem.item_image ? (
                                        <img
                                            src={`data:image/png;base64,${selectedItem.item_image}`}
                                            alt="frame"
                                            style={{
                                                width: "auto",
                                                height: "350px",
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
                                        <li>Seatpost Diameter: {selectedItem.seatpost_diameter}</li>
                                        <li>Seatpost Length: {selectedItem.seatpost_length}</li>
                                        <li>Seat Clamp Type: {selectedItem.seat_clamp_type}</li>
                                        <li>Saddle Material: {selectedItem.saddle_material}</li>
                                    </ul>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                )
            }
        </div>
    );
};

export default Seat;
