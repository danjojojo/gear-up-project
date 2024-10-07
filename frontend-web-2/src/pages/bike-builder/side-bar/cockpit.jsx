import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getCockpitItems } from '../../../services/bikeBuilderService';

const Cockpit = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const data = await getCockpitItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching cockpit items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="parts-container">
            {items.map((item) => (
                <div className="parts-card" key={item.cockpit_id}>
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
                                    Fork Upper Diameter: {item.fork_upper_diameter}
                                </div>

                                <div className='specs-container'>
                                    Headset Type: {item.headset_type}
                                </div>

                                <div className='specs-container'>
                                    Headset Upper Diameter: {item.headset_upper_diameter}
                                </div>

                                <div className='specs-container'>
                                    Headset Lower Diameter: {item.headset_lower_diameter}
                                </div>

                                <div className='specs-container'>
                                    Headset Cup Type: {item.headset_cup_type}
                                </div>

                                <div className='specs-container'>
                                    Stem Material: {item.stem_material}
                                </div>

                                <div className='specs-container'>
                                    Handlebar Material: {item.handlebar_material}
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

export default Cockpit;
