import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getSeatItems } from '../../../services/bikeBuilderService';

const Seat = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const data = await getSeatItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching seat items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="parts-container">
            {items.map((item) => (
                <div className="parts-card" key={item.seat_id}>
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
                                    Seatpost Diameter: {item.seatpost_diameter}
                                </div>

                                <div className='specs-container'>
                                    Seatpost Length: {item.seatpost_length}
                                </div>

                                <div className='specs-container'>
                                    Seat Clamp Type: {item.seat_clamp_type}
                                </div>

                                <div className='specs-container'>
                                    Saddle Material: {item.saddle_material}
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

export default Seat;
