import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getGroupsetItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const Groupset = ({ onAddToBuild, selectedFrame, selectedFork }) => {
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
            const data = await getGroupsetItems(typeTag);

            // Apply filtering logic based on selected frame and fork attributes
            const filteredGroupsets = data.filter(item => {
                const isBottomBracketTypeMatch = item.bottom_bracket_type === selectedFrame.bottom_bracket_type;
                const isBottomBracketWidthMatch = item.bottom_bracket_width === selectedFrame.bottom_bracket_width;

                // Rotor size should match both frame and fork rotor sizes
                const isRotorSizeMatch =
                    item.rotor_size === selectedFrame.rotor_size &&
                    item.rotor_size === selectedFork.rotor_size;

                // Return only if all conditions are met
                return isBottomBracketTypeMatch && isBottomBracketWidthMatch && isRotorSizeMatch;
            });

            // Sort the filtered results based on the sort order
            const sortedGroupsets = filteredGroupsets.sort((a, b) => {
                return sortOrder === "asc" ? a.item_price - b.item_price : b.item_price - a.item_price;
            });

            setItems(sortedGroupsets);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching groupset items:", error);
        }
    }, [sortOrder, selectedFrame, selectedFork]);

    useEffect(() => {
        if (selectedFrame && selectedFork) {
            fetchItems();
        }
    }, [fetchItems, selectedFrame, selectedFork]);

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
                    <div className="parts-card" key={item.groupset_id} onClick={() => openModal(item)}>
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
                            {item.bottom_bracket_type}
                            <br />
                            {item.chainring_speed} x {item.cassette_speed}
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Details</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>{item.description}</Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Tech Specs</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>
                                    <div className='specs-container'>Chainring Speed: {item.chainring_speed}</div>
                                    <div className='specs-container'>Crank Arm Length: {item.crank_arm_length}</div>
                                    <div className='specs-container'>Front Derailleur Speed: {item.front_derailleur_speed}</div>
                                    <div className='specs-container'>Rear Derailleur Speed: {item.rear_derailleur_speed}</div>
                                    <div className='specs-container'>Cassette Type: {item.cassette_type}</div>
                                    <div className='specs-container'>Cassette Speed: {item.cassette_speed}</div>
                                    <div className='specs-container'>Chain Speed: {item.chain_speed}</div>
                                    <div className='specs-container'>Bottom Bracket Type: {item.bottom_bracket_type}</div>
                                    <div className='specs-container'>Bottom Bracket Width: {item.bottom_bracket_width}</div>
                                    <div className='specs-container'>Brake Type: {item.brake_type}</div>
                                    <div className='specs-container'>Rotor Mount Type: {item.rotor_mount_type}</div>
                                    <div className='specs-container'>Rotor Size: {item.rotor_size}</div>
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
                                        <li>Chainring Speed: {selectedItem.chainring_speed}</li>
                                        <li>Crank Arm Length: {selectedItem.crank_arm_length}</li>
                                        <li>Front Derailleur Speed: {selectedItem.front_derailleur_speed}</li>
                                        <li>Rear Derailleur Speed: {selectedItem.rear_derailleur_speed}</li>
                                        <li>Cassette Type: {selectedItem.cassette_type}</li>
                                        <li>Cassette Speed: {selectedItem.cassette_speed}</li>
                                        <li>Chain Speed: {selectedItem.chain_speed}</li>
                                        <li>Bottom Bracket Type: {selectedItem.bottom_bracket_type}</li>
                                        <li>Bottom Bracket Width: {selectedItem.bottom_bracket_width}</li>
                                        <li>Brake Type: {selectedItem.brake_type}</li>
                                        <li>Rotor Mount Type: {selectedItem.rotor_mount_type}</li>
                                        <li>Rotor Size: {selectedItem.rotor_size}</li>
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

export default Groupset;
