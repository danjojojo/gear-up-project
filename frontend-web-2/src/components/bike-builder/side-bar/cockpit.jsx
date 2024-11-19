import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getCockpitItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { Modal } from 'react-bootstrap';

const Cockpit = ({ onAddToBuild, selectedFrame, selectedFork }) => {
    const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
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
            const data = await getCockpitItems();

            // Apply filtering logic based on selected frame and fork attributes
            const filteredCockpits = data.filter(item => {
                const isStemForkDiameterMatch = item.stem_fork_diameter === selectedFork.fork_tube_upper_diameter;
                const isHeadsetTypeMatch = item.headset_type === selectedFrame.head_tube_type;
                const isHeadsetUpperDiameterMatch = item.headset_upper_diameter === selectedFrame.head_tube_upper_diameter;
                const isHeadsetLowerDiameterMatch = item.headset_lower_diameter === selectedFrame.head_tube_lower_diameter;

                // Return only if all conditions are met
                return isStemForkDiameterMatch && isHeadsetTypeMatch && isHeadsetUpperDiameterMatch && isHeadsetLowerDiameterMatch;
            });

            // Apply sorting based on the sortOrder state
            const sortedCockpits = filteredCockpits.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.item_price - b.item_price;
                } else {
                    return b.item_price - a.item_price;
                }
            });

            setItems(sortedCockpits);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cockpit items:", error);
        }
    }, [sortOrder, selectedFrame, selectedFork]); // Include dependencies

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
            {!loading && <div className='parts-cards'>
                {items.map((item) => (
                    <div className="parts-card" key={item.cockpit_id} onClick={() => openModal(item)}>
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
                            {item.handlebar_type} {item.handlebar_length} Handlebar
                            <br />
                            {item.stem_length} Stem - {item.stem_angle}
                            <br />
                            {item.headset_type} {item.headset_cup_type} Headset
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Details</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>{item.description}</Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Tech Specs</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>
                                    <div className='specs-container'>
                                        Handlebar Length: {item.handlebar_length}
                                    </div>
                                    <div className='specs-container'>
                                        Handlebar Clamp Diameter: {item.handlebar_clamp_diameter}
                                    </div>
                                    <div className='specs-container'>
                                        Handlebar Type: {item.handlebar_type}
                                    </div>
                                    <div className='specs-container'>
                                        Stem Clamp Diameter: {item.stem_clamp_diameter}
                                    </div>
                                    <div className='specs-container'>
                                        Stem Length: {item.stem_length}
                                    </div>
                                    <div className='specs-container'>
                                        Stem Angle: {item.stem_angle}
                                    </div>
                                    <div className='specs-container'>
                                        Stem Fork Diameter: {item.stem_fork_diameter}
                                    </div>
                                    <div className='specs-container'>
                                        Headset Type: {item.headset_type}
                                    </div>
                                    <div className='specs-container'>
                                        Headset Cup Type: {item.headset_cup_type}
                                    </div>
                                    <div className='specs-container'>
                                        Headset Upper Diameter: {item.headset_upper_diameter}
                                    </div>
                                    <div className='specs-container'>
                                        Headset Lower Diameter: {item.headset_lower_diameter}
                                    </div>
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
                        <Modal.Header closeButton >
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
                                                height: "200px",
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
                                        <li>Handlebar Length: {selectedItem.handlebar_length}</li>
                                        <li>Handlebar Clamp Diameter: {selectedItem.handlebar_clamp_diameter}</li>
                                        <li>Handlebar Type: {selectedItem.handlebar_type}</li>
                                        <li>Stem Clamp Diameter: {selectedItem.stem_clamp_diameter}</li>
                                        <li>Stem Length: {selectedItem.stem_length}</li>
                                        <li>Stem Angle: {selectedItem.stem_angle}</li>
                                        <li>Stem Fork Diameter: {selectedItem.stem_fork_diameter}</li>
                                        <li>Headset Type: {selectedItem.headset_type}</li>
                                        <li>Headset Cup Type: {selectedItem.headset_cup_type}</li>
                                        <li>Headset Upper Diameter: {selectedItem.headset_upper_diameter}</li>
                                        <li>Headset Lower Diameter: {selectedItem.headset_lower_diameter}</li>
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

export default Cockpit;
