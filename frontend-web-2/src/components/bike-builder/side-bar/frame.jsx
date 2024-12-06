import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getFrameItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';
import { useParams } from 'react-router-dom';

const Frame = ({ onAddToBuild }) => {
    const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc"); // State to manage sort order
    const [loading, setLoading] = useState(true);
    const { typeTag } = useParams();

    const fetchItems = useCallback(async () => {
        try {
            let data = await getFrameItems(typeTag);

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
                    <div className="parts-card" key={item.frame_id}>
                        <div className="item-image" onClick={() => onAddToBuild(item)}>
                            {item.item_image ? (
                                <img src={`data:image/png;base64,${item.item_image}`} alt="frame" />
                            ) : (
                                <p>No Image Available</p>
                            )}
                        </div>
                        <div className="item-name">{item.item_name}</div>
                        <div className="item-price">
                            {PesoFormat.format(item.item_price)}
                            <br />
                            {item.purpose}
                            <br />
                            {item.frame_size} - {item.head_tube_type}
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Details</Accordion.Header>
                                <Accordion.Body>{item.description}</Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Tech Specs</Accordion.Header>
                                <Accordion.Body>
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
        </div>
    );
};

export default Frame;
