import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getCockpitItems } from '../../../services/bikeBuilderService';

const Cockpit = ({ onAddToBuild, selectedFrame, selectedFork }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
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

                setItems(filteredCockpits);
            } catch (error) {
                console.error("Error fetching cockpit items:", error);
            }
        };

        if (selectedFrame && selectedFork) {
            fetchItems();
        }
    }, [selectedFrame, selectedFork]);

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

                    <button className="add-to-build" onClick={() => onAddToBuild(item)}>
                        Add to Build
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Cockpit;
