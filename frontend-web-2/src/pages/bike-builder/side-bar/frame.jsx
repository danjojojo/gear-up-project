import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getFrameItems } from '../../../services/bikeBuilderService';

const Frame = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const data = await getFrameItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching frame items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="parts-container">
            {items.map((item) => (
                <div className="parts-card" key={item.frame_id}>
                    <div className="item-image">
                        {item.item_image ? (
                            <img src={`data:image/png;base64,${item.item_image}`} alt="frame" />
                        ) : (
                            <p>No Image Available</p>
                        )}
                    </div>
                    <div className="item-name">{item.item_name}</div>
                    <div className="item-price">₱ {item.item_price}</div>

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Details</Accordion.Header>
                            <Accordion.Body>{item.description}</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Tech Specs</Accordion.Header>
                            <Accordion.Body>
                                <div className='specs-container'>
                                    Frame Size: {item.frame_size}
                                </div>

                                <div className='specs-container'>
                                    Head Tube Type: {item.head_tube_type}
                                </div>

                                <div className='specs-container'>
                                    Head Tube Upper Diameter: {item.head_tube_upper_diameter}
                                </div>

                                <div className='specs-container'>
                                    Head Tube Upper Diameter: {item.head_tube_lower_diameter}
                                </div>

                                <div className='specs-container'>
                                    Seatpost Diameter: {item.seatpost_diameter}
                                </div>

                                <div className='specs-container'>
                                    Axle Type: {item.axle_type}
                                </div>

                                <div className='specs-container'>
                                    Axle Width: {item.axle_width}
                                </div>

                                <div className='specs-container'>
                                    Bottom Bracket Type: {item.bottom_bracket_type}
                                </div>

                                <div className='specs-container'>
                                    Bottom Bracket Diameter: {item.bottom_bracket_diameter}
                                </div>

                                <div className='specs-container'>
                                    Rotor Size: {item.rotor_size}
                                </div>

                                <div className='specs-container'>
                                    Max Tire Width: {item.max_tire_width}
                                </div>

                                <div className='specs-container'>
                                    Brake Mount: {item.brake_mount}
                                </div>

                                <div className='specs-container'>
                                    Cable Routing: {item.cable_routing}
                                </div>

                                <div className='specs-container'>
                                    Material: {item.material}
                                </div>

                                <div className='specs-container'>
                                    Weight: {item.weight}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <button className="add-to-build">Add to Build</button>
                </div>
            ))}
        </div>
    );
};

export default Frame;
