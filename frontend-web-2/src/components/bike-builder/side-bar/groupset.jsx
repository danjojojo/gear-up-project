import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import { getGroupsetItems } from '../../../services/bikeBuilderService';
import arrowUp from '../../../assets/icons/arrow-up.png';
import arrowDown from '../../../assets/icons/arrow-down.png';

const Groupset = ({ onAddToBuild, selectedFrame, selectedFork }) => {
    const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchItems = useCallback(async () => {
        try {
            const data = await getGroupsetItems();

            // Apply filtering logic based on selected frame and fork attributes
            const filteredGroupsets = data.filter(item => {
                const isBottomBracketTypeMatch = item.bottom_bracket_type === selectedFrame.bottom_bracket_type;
                const isBottomBracketWidthMatch = item.bottom_bracket_width === selectedFrame.bottom_bracket_width;

                // Rotor size should match both frame and fork rotor sizes
                const isRotorSizeMatch =
                    item.rotor_size === selectedFrame.rotor_size &&
                    item.rotor_size === selectedFork.rotor_size;

                // Return only if all conditions are met
                return isBottomBracketTypeMatch && isBottomBracketWidthMatch && isRotorSizeMatch;
            });

            // Sort the filtered results based on the sort order
            const sortedGroupsets = filteredGroupsets.sort((a, b) => {
                return sortOrder === "asc" ? a.item_price - b.item_price : b.item_price - a.item_price;
            });

            setItems(sortedGroupsets);
        } catch (error) {
            console.error("Error fetching groupset items:", error);
        }
    }, [sortOrder, selectedFrame, selectedFork]);

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
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                    {sortOrder === "asc" ? (
                        <img src={arrowDown} alt="Sort Descending" />
                    ) : (
                        <img src={arrowUp} alt="Sort Ascending" />
                    )}
                </button>
            </div>

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
                    <div className="item-price">{PesoFormat.format(item.item_price)}</div>

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Details</Accordion.Header>
                            <Accordion.Body>{item.description}</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Tech Specs</Accordion.Header>
                            <Accordion.Body>
                                <div className='specs-container'>Chainring Speed: {item.chainring_speed}</div>
                                <div className='specs-container'>Crank Arm Length: {item.crank_arm_length}</div>
                                <div className='specs-container'>Front Derailleur Speed: {item.front_derailleur_speed}</div>
                                <div className='specs-container'>Rear Derailleur Speed: {item.rear_derailleur_speed}</div>
                                <div className='specs-container'>Cassette Type: {item.cassette_type}</div>
                                <div className='specs-container'>Cassette Speed: {item.cassette_speed}</div>
                                <div className='specs-container'>Chain Speed: {item.chain_speed}</div>
                                <div className='specs-container'>Bottom Bracket Type: {item.bottom_bracket_type}</div>
                                <div className='specs-container'>Bottom Bracket Width: {item.bottom_bracket_width}</div>
                                <div className='specs-container'>Brake Type: {item.brake_type}</div>
                                <div className='specs-container'>Rotor Mount Type: {item.rotor_mount_type}</div>
                                <div className='specs-container'>Rotor Size: {item.rotor_size}</div>
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

export default Groupset;
