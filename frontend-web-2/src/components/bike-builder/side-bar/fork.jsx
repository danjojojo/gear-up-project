import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getForkItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const Fork = ({ onAddToBuild, selectedFramePurpose, selectedFrame }) => {
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
            const data = await getForkItems(typeTag);

            // Apply filtering logic based on selected frame attributes
            const filteredForks = data.filter(item => {
                const isPurposeMatch =
                    (selectedFramePurpose === "Cross-country (XC)" && item.fork_travel === "80mm to 120mm") ||
                    (selectedFramePurpose === "Trail" && item.fork_travel === "120mm to 160mm") ||
                    (selectedFramePurpose === "Enduro" && item.fork_travel === "150mm to 180mm") ||
                    (selectedFramePurpose === "Downhill (DH)" && item.fork_travel === "180mm to 200mm");

                const isSizeMatch = item.fork_size === selectedFrame.frame_size;
                const isHeadTubeMatch = item.fork_tube_type === selectedFrame.head_tube_type;
                const isAxleTypeMatch = item.axle_type === selectedFrame.axle_type;
                const isAxleDiameterMatch = item.axle_diameter === selectedFrame.axle_diameter;
                const isRotorSizeMatch = item.rotor_size >= selectedFrame.rotor_size;
                const isTireWidthMatch = item.max_tire_width >= selectedFrame.max_tire_width;

                // Return only if all conditions are met
                return isPurposeMatch && isSizeMatch && isHeadTubeMatch && isAxleTypeMatch && isAxleDiameterMatch && isRotorSizeMatch && isTireWidthMatch;
            });

            // Sort the filtered results based on the sort order
            const sortedForks = filteredForks.sort((a, b) => {
                return sortOrder === "asc" ? a.item_price - b.item_price : b.item_price - a.item_price;
            });

            setItems(sortedForks);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching fork items:", error);
        }
    }, [sortOrder, selectedFramePurpose, selectedFrame]);

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
                    <div className="parts-card" key={item.fork_id} onClick={() => openModal(item)}>
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
                            {item.fork_size} - {item.fork_tube_type}
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Details</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>{item.description}</Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header onClick={(e) => e.stopPropagation()}>Tech Specs</Accordion.Header>
                                <Accordion.Body onClick={(e) => e.stopPropagation()}>
                                    <div className='specs-container'>Fork Size: {item.fork_size}</div>
                                    <div className='specs-container'>Fork Tube Type: {item.fork_tube_type}</div>
                                    <div className='specs-container'>Fork Tube Upper Diameter: {item.fork_tube_upper_diameter}</div>
                                    <div className='specs-container'>Fork Tube Lower Diameter: {item.fork_tube_lower_diameter}</div>
                                    <div className='specs-container'>Fork Travel: {item.fork_travel}</div>
                                    <div className='specs-container'>Fork Axle Type: {item.axle_type}</div>
                                    <div className='specs-container'>Fork Axle Diameter: {item.axle_diameter}</div>
                                    <div className='specs-container'>Fork Suspension Type: {item.suspension_type}</div>
                                    <div className='specs-container'>Fork Rotor Size: {item.rotor_size}</div>
                                    <div className='specs-container'>Fork Max Tire Width: {item.max_tire_width}</div>
                                    <div className='specs-container'>Front Hub Width: {item.front_hub_width}</div>
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
                                                height: "300px",
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
                                        <li>Fork Size: {selectedItem.fork_size}</li>
                                        <li>Fork Tube Type: {selectedItem.fork_tube_type}</li>
                                        <li>Fork Tube Upper Diameter: {selectedItem.fork_tube_upper_diameter}</li>
                                        <li>Fork Tube Lower Diameter: {selectedItem.fork_tube_lower_diameter}</li>
                                        <li>Fork Travel: {selectedItem.fork_travel}</li>
                                        <li>Fork Axle Type: {selectedItem.axle_type}</li>
                                        <li>Fork Axle Diameter: {selectedItem.axle_diameter}</li>
                                        <li>Fork Suspension Type: {selectedItem.suspension_type}</li>
                                        <li>Fork Rotor Size: {selectedItem.rotor_size}</li>
                                        <li>Fork Max Tire Width: {selectedItem.max_tire_width}</li>
                                        <li>Front Hub Width: {selectedItem.front_hub_width}</li>
                                        <li>Material: {selectedItem.material}</li>
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

export default Fork;
