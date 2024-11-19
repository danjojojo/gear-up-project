import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getWheelsetItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { Modal } from 'react-bootstrap';

const Wheelset = ({ onAddToBuild, selectedFrame, selectedFork, selectedGroupset }) => {
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
            const data = await getWheelsetItems();

            // Apply filtering logic based on selected frame, fork, and groupset attributes
            const filteredWheelsets = data.filter(item => {
                const isCassetteTypeMatch = item.hub_cassette_type === selectedGroupset.cassette_type;
                const isHubSpeedMatch = item.rear_hub_speed === selectedGroupset.cassette_speed;
                const isRotorMountTypeMatch = item.hub_rotor_type === selectedGroupset.rotor_mount_type;

                const isRearHubWidthMatch = item.rear_hub_width === selectedFrame.rear_hub_width;
                const isFrontHubWidthMatch = item.front_hub_width === selectedFork.front_hub_width;

                const isRearHubAxleTypeMatch = item.rear_hub_axle_type === selectedFrame.axle_type;
                const isFrontHubAxleTypeMatch = item.front_hub_axle_type === selectedFork.axle_type;

                const isTireSizeMatch = item.tire_size === selectedFrame.frame_size;
                const isTireWidthMatch = item.tire_width <= selectedFrame.max_tire_width;

                // Return only if all conditions are met
                return isCassetteTypeMatch &&
                    isHubSpeedMatch &&
                    isRotorMountTypeMatch &&
                    isRearHubWidthMatch &&
                    isFrontHubWidthMatch &&
                    isRearHubAxleTypeMatch &&
                    isFrontHubAxleTypeMatch &&
                    isTireSizeMatch &&
                    isTireWidthMatch;
            });

            // Sort the filtered results based on the sort order
            const sortedWheelsets = filteredWheelsets.sort((a, b) => {
                return sortOrder === "asc" ? a.item_price - b.item_price : b.item_price - a.item_price;
            });

            setItems(sortedWheelsets);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching wheelset items:", error);
        }
    }, [sortOrder, selectedFrame, selectedFork, selectedGroupset]);

    useEffect(() => {
        if (selectedFrame && selectedFork && selectedGroupset) {
            fetchItems();
        }
    }, [fetchItems, selectedFrame, selectedFork, selectedGroupset]);

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
                    <div className="parts-card" key={item.wheelset_id} onClick={() => openModal(item)}>
                        <div className="item-image" onClick={(e) => { e.stopPropagation(); onAddToBuild(item); }}>
                            {item.item_image ? (
                                <img src={`data:image/png;base64,${item.item_image}`} alt="Wheelset" />
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
                            {item.tire_size} - {item.tire_width}
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Details</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>{item.description}</Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Tech Specs</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>
                                    <div className='specs-container'>Hub - Rotor Type: {item.hub_rotor_type}</div>
                                    <div className='specs-container'>Hub - Cassette Type: {item.hub_cassette_type}</div>
                                    <div className='specs-container'>Hub Holes: {item.hub_holes}</div>
                                    <div className='specs-container'>Front Hub Width: {item.front_hub_width}</div>
                                    <div className='specs-container'>Front Hub - Axle Type: {item.front_hub_axle_type}</div>
                                    <div className='specs-container'>Front Hub - Axle Diameter: {item.front_hub_axle_diameter}</div>
                                    <div className='specs-container'>Rear Hub Width: {item.rear_hub_width}</div>
                                    <div className='specs-container'>Rear Hub - Axle Type: {item.rear_hub_axle_type}</div>
                                    <div className='specs-container'>Rear Hub - Axle Diameter: {item.rear_hub_axle_diameter}</div>
                                    <div className='specs-container'>Rear Hub Speed: {item.rear_hub_speed}</div>
                                    <div className='specs-container'>Tire Size: {item.tire_size}</div>
                                    <div className='specs-container'>Tire Width: {item.tire_width}</div>
                                    <div className='specs-container'>Rim Spokes: {item.rim_spokes}</div>
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
                                        <li>Hub - Rotor Type: {selectedItem.hub_rotor_type}</li>
                                        <li>Hub - Cassette Type: {selectedItem.hub_cassette_type}</li>
                                        <li>Hub Holes: {selectedItem.hub_holes}</li>
                                        <li>Front Hub Width: {selectedItem.front_hub_width}</li>
                                        <li>Front Hub - Axle Type: {selectedItem.front_hub_axle_type}</li>
                                        <li>Front Hub - Axle Diameter: {selectedItem.front_hub_axle_diameter}</li>
                                        <li>Rear Hub Width: {selectedItem.rear_hub_width}</li>
                                        <li>Rear Hub - Axle Type: {selectedItem.rear_hub_axle_type}</li>
                                        <li>Rear Hub - Axle Diameter: {selectedItem.rear_hub_axle_diameter}</li>
                                        <li>Rear Hub Speed: {selectedItem.rear_hub_speed}</li>
                                        <li>Tire Size: {selectedItem.tire_size}</li>
                                        <li>Tire Width: {selectedItem.tire_width}</li>
                                        <li>Rim Spokes: {selectedItem.rim_spokes}</li>
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

export default Wheelset;
