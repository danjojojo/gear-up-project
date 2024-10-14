import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { getForkItems } from '../../../services/bikeBuilderService';

const Fork = ({ onAddToBuild, selectedFramePurpose, selectedFrame }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getForkItems();
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

                setItems(filteredForks);
            } catch (error) {
                console.error("Error fetching fork items:", error);
            }
        };

        if (selectedFrame) {
            fetchItems();
        }
    }, [selectedFramePurpose, selectedFrame]);

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    return (
        <div className="parts-container">
            {items.map((item) => (
                <div className="parts-card" key={item.fork_id}>
                    <div className="item-image">
                        {item.item_image ? (
                            <img src={`data:image/png;base64,${item.item_image}`} alt="frame" />
                        ) : (
                            <p>No Image Available</p>
                        )}
                    </div>
                    <div className="item-name">{item.item_name}</div>
                    <div className="item-price">{PesoFormat.format(item.item_price)}</div>

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Details</Accordion.Header>
                            <Accordion.Body>{item.description}</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Tech Specs</Accordion.Header>
                            <Accordion.Body>
                                <div className='specs-container'>
                                    Fork Size: {item.fork_size}
                                </div>

                                <div className='specs-container'>
                                    Fork Tube Type: {item.fork_tube_type}
                                </div>

                                <div className='specs-container'>
                                    Fork Tube Upper Diameter: {item.fork_tube_upper_diameter}
                                </div>

                                <div className='specs-container'>
                                    Fork Tube Lower Diameter: {item.fork_tube_lower_diameter}
                                </div>

                                <div className='specs-container'>
                                    Fork Travel: {item.fork_travel}
                                </div>

                                <div className='specs-container'>
                                    Fork Axle Type: {item.axle_type}
                                </div>

                                <div className='specs-container'>
                                    Fork Axle Diameter: {item.axle_diameter}
                                </div>

                                <div className='specs-container'>
                                    Fork Suspension Type: {item.suspension_type}
                                </div>

                                <div className='specs-container'>
                                    Fork Rotor Size: {item.rotor_size}
                                </div>

                                <div className='specs-container'>
                                    Fork Max Tire Width: {item.max_tire_width}
                                </div>

                                <div className='specs-container'>
                                    Front Hub Width: {item.front_hub_width}
                                </div>

                                <div className='specs-container'>
                                    Material: {item.material}
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

export default Fork;
