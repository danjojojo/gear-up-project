import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getWheelsetItems } from '../../../services/bikeBuilderService';

const Wheelset = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const data = await getWheelsetItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching wheelset items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="parts-container">
            {items.map((item) => (
                <div className="parts-card" key={item.wheelset_id}>
                    <div className="item-image">
                        {item.item_image ? (
                            <img src={`data:image/png;base64,${item.item_image}`} alt="Wheelset" />
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
                                    Tire Size: {item.tire_size}
                                </div>

                                <div className='specs-container'>
                                    Tire Width: {item.tire_width}
                                </div>

                                <div className='specs-container'>
                                    Rim Holes: {item.rim_holes}
                                </div>

                                <div className='specs-container'>
                                    Rim Width: {item.rim_width}
                                </div>

                                <div className='specs-container'>
                                    Hub Type: {item.hub_type}
                                </div>

                                <div className='specs-container'>
                                    Hub Speed: {item.hub_speed}
                                </div>

                                <div className='specs-container'>
                                    Hub Holes: {item.hub_holes}
                                </div>

                                <div className='specs-container'>
                                    Spokes: {item.spokes}
                                </div>

                                <div className='specs-container'>
                                    Axle Type: {item.axle_type}
                                </div>

                                <div className='specs-container'>
                                    Rotor Type: {item.rotor_type}
                                </div>

                                <div className='specs-container'>
                                    Rotor Size: {item.rotor_size}
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

export default Wheelset;
