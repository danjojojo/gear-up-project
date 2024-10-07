import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getGroupsetItems } from '../../../services/bikeBuilderService';

const Groupset = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const data = await getGroupsetItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching groupset items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="parts-container">
            {items.map((item) => (
                <div className="parts-card" key={item.groupset_id}>
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
                                    Chainring Speed: {item.chainring_speed}
                                </div>

                                <div className='specs-container'>
                                    Crank Arm Length: {item.crank_arm_length}
                                </div>

                                <div className='specs-container'>
                                    Front Derailleur Speed: {item.front_derailleur_speed}
                                </div>

                                <div className='specs-container'>
                                    Rear Derailleur Speed: {item.rear_derailleur_speed}
                                </div>

                                <div className='specs-container'>
                                    Cassette Type: {item.cassette_type}
                                </div>

                                <div className='specs-container'>
                                    Cassette Speed: {item.cassette_speed}
                                </div>

                                <div className='specs-container'>
                                    Chain Speed: {item.chain_speed}
                                </div>

                                <div className='specs-container'>
                                    Bottom Bracket Type: {item.bottom_bracket_type}
                                </div>

                                <div className='specs-container'>
                                    Bottom Bracket Width: {item.bottom_bracket_width}
                                </div>

                                <div className='specs-container'>
                                    Brake Type: {item.brake_type}
                                </div>

                                <div className='specs-container'>
                                    Rotor Mount Type: {item.rotor_mount_type}
                                </div>

                                <div className='specs-container'>
                                    Rotor Size: {item.rotor_size}
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

export default Groupset;
