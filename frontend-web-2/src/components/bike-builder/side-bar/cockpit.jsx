import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getCockpitItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';

const Cockpit = ({ onAddToBuild, selectedFrame, selectedFork }) => {
    const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");

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
            <div className='parts-cards'>
                {items.map((item) => (
                    <div className="parts-card" key={item.cockpit_id}>
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
                            {item.handlebar_type} {item.handlebar_length} Handlebar
                            <br />
                            {item.stem_length} Stem - {item.stem_angle}
                            <br />
                            {item.headset_type} {item.headset_cup_type} Headset
                        </div>

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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cockpit;
