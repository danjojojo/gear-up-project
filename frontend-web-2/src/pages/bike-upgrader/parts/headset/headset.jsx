import "./headset.scss";
import React, { useRef, useEffect, useState } from 'react';
import backbutton from "../../../../assets/icons/back-button.png";
import { useNavigate } from 'react-router-dom';
import leftarrow from "../../../../assets/icons/left-arrow.png";
import rightarrow from "../../../../assets/icons/right-arrow.png";
import { getHeadsetItems } from "../../../../services/bikeUpgraderService";

const Headset = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [headsetType, setHeadsetType] = useState("");
    const [headsetUpperDiameter, setHeadsetUpperDiameter] = useState("");
    const [headsetLowerDiameter, setHeadsetLowerDiameter] = useState("");
    const [searched, setSearched] = useState(false); // To track if the user has searched
    const [showScrollButtons, setShowScrollButtons] = useState(false); // Track if scroll buttons should be visible
    const navigate = useNavigate();
    const contentRef = useRef(null);

    const scrollCarousel = (direction) => {
        const scrollAmount = 420; // Adjust to match the width of each item card + margin

        if (contentRef.current) {
            if (direction === 1) {
                // Scroll right
                contentRef.current.scrollLeft += scrollAmount;
            } else {
                // Scroll left
                contentRef.current.scrollLeft -= scrollAmount;
            }
        }
    };

    const fetchItems = async () => {
        try {
            const data = await getHeadsetItems();
            setItems(data);
        } catch (error) {
            console.error("Error fetching headset items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleFindParts = () => {
        // Mark as searched to show results or message accordingly
        setSearched(true);

        // Filter items based on the selected specifications
        const filtered = items.filter(item =>
            item.headset_type === headsetType &&
            item.headset_upper_diameter === headsetUpperDiameter &&
            item.headset_lower_diameter === headsetLowerDiameter
        );
        setFilteredItems(filtered);

        // Check if scroll buttons should be visible based on the content's scroll width
        if (contentRef.current && contentRef.current.scrollWidth > contentRef.current.clientWidth) {
            setShowScrollButtons(true);
        } else {
            setShowScrollButtons(false);
        }
    };

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });


    return (
        <div className="headset">
            <div className="left-container">
                <div className="title">
                    <img className="me-4"
                        src={backbutton}
                        alt="back-button"
                        onClick={() => navigate('/bike-upgrader')}
                    />
                    <div>Headset</div>
                </div>
                <div className="specs-container">
                    <div className="content">
                        <div>
                            <div className="title">
                                <div>Tell us your headset’s current specifications</div>
                            </div>

                            <div className="specs">
                                <div className="specs-title">
                                    Headset Type
                                </div>
                                <div className="dropdown">
                                    <select value={headsetType} onChange={(e) => setHeadsetType(e.target.value)}>
                                        <option value="">Select Type</option>
                                        <option value="Tapered">Tapered</option>
                                        <option value="Non-tapered">Non-tapered</option>
                                    </select>
                                </div>
                            </div>

                            <div className="specs">
                                <div className="specs-title">
                                    Headset Upper Diameter
                                </div>
                                <div className="dropdown">
                                    <select value={headsetUpperDiameter} onChange={(e) => setHeadsetUpperDiameter(e.target.value)}>
                                        <option value="">Select Diameter</option>
                                        <option value="44 mm">44 mm</option>
                                        <option value="49 mm">49 mm</option>
                                        <option value="55 mm">55 mm</option>
                                    </select>
                                </div>
                            </div>

                            <div className="specs">
                                <div className="specs-title">
                                    Headset Lower Diameter
                                </div>
                                <div className="dropdown">
                                    <select value={headsetLowerDiameter} onChange={(e) => setHeadsetLowerDiameter(e.target.value)}>
                                        <option value="">Select Diameter</option>
                                        <option value="44 mm">44 mm</option>
                                        <option value="55 mm">55 mm</option>
                                        <option value="56 mm">56 mm</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="find-part-container">
                    <button onClick={handleFindParts}>
                        Find Parts
                    </button>
                </div>
            </div>

            <div className="right-container">
                <div className="title">
                    <div>Parts</div>
                </div>
                <div className="item-container">
                    {!searched ? (
                        <div className="message">
                            <p>Enter the specifications and press "Find Parts".</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="message">
                            <p>No matching parts found for the selected specifications. Please try different options.</p>
                        </div>
                    ) : (
                        <>
                            {showScrollButtons && (
                                <>
                                    <button className="scroll-btn left-btn" onClick={() => scrollCarousel(-1)}>
                                        <img src={leftarrow} alt="left-arrow" />
                                    </button>
                                    <button className="scroll-btn right-btn" onClick={() => scrollCarousel(1)}>
                                        <img src={rightarrow} alt="right-arrow" />
                                    </button>
                                </>
                            )}
                            <div className="content" ref={contentRef}>
                                {filteredItems.map((item, index) => (
                                    <div className="item-card" key={index}>
                                        <div className="upper-content">
                                            {item.item_image ? (
                                                <img src={`data:image/png;base64,${item.item_image}`} alt="frame" />
                                            ) : (
                                                <p>No Image Available</p>
                                            )}
                                        </div>
                                        <div className="lower-content">
                                            <div className="part-content">
                                                {item.item_name}
                                            </div>
                                            <div className="part-content fw-light">
                                                {PesoFormat.format(item.item_price)}
                                            </div>
                                            <div
                                                className="part-content fw-light"
                                                style={{ color: item.stock_count > 0 ? "green" : "red" }}
                                            >
                                                {item.stock_count > 0 ? "In Stock" : "Out of Stock"}
                                            </div>
                                            <div className="part-content">
                                                <div className="quantity fw-light">Quantity</div>
                                                <div className="qty-btn">
                                                    <div className="btn-content">
                                                        <button className="indc-btn">-</button>
                                                        <div className="qty-num fw-light">1</div>
                                                        <button className="indc-btn">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="part-content">
                                                <button>Add to Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Headset;
