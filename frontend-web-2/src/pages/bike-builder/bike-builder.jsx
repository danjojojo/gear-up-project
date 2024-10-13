import "./bike-builder.scss";
import React, { useState } from 'react';
import BudgetContainer from "../../components/bike-builder/contents/budget-container";
import BuilderSidebar from "../../components/bike-builder/contents/builder-sidebar";
import CanvasContainer from "../../components/bike-builder/contents/canvas-container";
import useBase64Image from "../../hooks/useImage";

const BikeBuilder = () => {
    const [showBudgetStep, setShowBudgetStep] = useState(true);
    const [isSettingBudget, setIsSettingBudget] = useState(false);
    const [budget, setBudget] = useState("");
    const [selectedParts, setSelectedParts] = useState({
        frame: null,
        fork: null,
        groupset: null,
        wheelset: null,
        seat: null,
        cockpit: null
    });
    const [buildStatsPrice, setBuildStatsPrice] = useState(0); // Store the total price

    const [partPositions, setPartPositions] = useState({
        frame: { x: 100, y: 100 },
        fork: { x: 100, y: 100 },
        frontWheel: { x: 100, y: 100 },  // Separate position for front wheel
        rearWheel: { x: 150, y: 100 },   // Separate position for rear wheel
        groupset: { x: 100, y: 100 },
        seat: { x: 100, y: 100 },
        cockpit: { x: 100, y: 100 },
    });
    const hitRegions = {
        frame: { x: 230, y: 180, width: 350, height: 220, rotation: -5 },
        fork: { x: 528, y: 135, width: 110, height: 263, rotation: -5 },
        groupset: { x: 230, y: 325, width: 253, height: 105 },
        frontWheel: { x: 508, y: 240, width: 260, height: 250 },
        rearWheel: { x: 138, y: 240, width: 260, height: 250 },
        seat: { x: 290, y: 148, width: 110, height: 165, rotation: -5 },
        cockpit: { x: 520, y: 100, width: 65, height: 55 }
    };

    const [currentPart, setCurrentPart] = useState("frame"); // Tracks the current part being worked on
    const [lockedParts, setLockedParts] = useState([]);
    const [isHitRegionCorrect, setIsHitRegionCorrect] = useState(false); // New state to track if part is in the hit region

    // Handle the Back Button and Reset Everything ( when going back )
    const handleReset = () => {
        setShowBudgetStep(true);  // Show budget step again
        setIsSettingBudget(false);
        setBudget("");            // Reset the budget
        setLockedParts([]);       // Clear locked parts
        setIsHitRegionCorrect(false);  // Reset hit region status
        setCurrentPart("frame");  // Reset to the first part
        setSelectedParts({        // Reset all selected parts
            frame: null,
            fork: null,
            groupset: null,
            wheelset: null,
            seat: null,
            cockpit: null
        });
        setBuildStatsPrice(0);    // Reset total price
        setPartPositions({        // Reset part positions
            frame: { x: 100, y: 100 },
            fork: { x: 100, y: 100 },
            frontWheel: { x: 100, y: 100 },
            rearWheel: { x: 150, y: 100 },
            groupset: { x: 100, y: 100 },
            seat: { x: 100, y: 100 },
            cockpit: { x: 100, y: 100 },
        });
    };

    const handleProceed = () => {
        if (!isSettingBudget || (isSettingBudget && budget)) {
            setShowBudgetStep(false);
        }
    };

    const resetBuild = () => {
        // Reset all selected parts to null (unselected)
        setSelectedParts({
            frame: null,
            fork: null,
            groupset: null,
            wheelset: null,
            seat: null,
            cockpit: null
        });

        // Reset all part positions to their default (initial) positions
        setPartPositions({
            frame: { x: 100, y: 100 },
            fork: { x: 100, y: 100 },
            frontWheel: { x: 100, y: 100 },
            rearWheel: { x: 150, y: 100 },
            groupset: { x: 100, y: 100 },
            seat: { x: 100, y: 100 },
            cockpit: { x: 100, y: 100 }
        });

        // Reset the build stats price to zero
        setBuildStatsPrice(0);

        // Clear locked parts to allow new selections
        setLockedParts([]);

        // Reset hit region correctness (no part is placed yet)
        setIsHitRegionCorrect(false);

        // Optionally, set the current part back to the first part (e.g., frame)
        setCurrentPart("frame");

    };

    const proceedToNextPart = () => {
        if (isHitRegionCorrect || selectedParts[currentPart]) {  // If region is hit or part is already selected
            if (buildStatsPrice <= budget || !budget) {
                // Lock the current part (including both wheels if it's the wheelset)
                if (currentPart === "wheelset") {
                    setLockedParts((prev) => [...prev, "frontWheel", "rearWheel"]);
                } else {
                    setLockedParts((prev) => [...prev, currentPart]);
                }

                // Move to the next part manually
                let nextPart = "";
                switch (currentPart) {
                    case "frame": nextPart = "fork"; break;
                    case "fork": nextPart = "groupset"; break;
                    case "groupset": nextPart = "wheelset"; break;
                    case "wheelset": nextPart = "seat"; break;
                    case "seat": nextPart = "cockpit"; break;
                    case "cockpit": nextPart = ""; break; // Last part, no further parts to move to
                    default: break;
                }

                // Unlock the next part when moving forward
                if (nextPart) {
                    setCurrentPart(nextPart);

                    setLockedParts((prevLockedParts) => {
                        // Unlock the new part and remove it from lockedParts
                        if (nextPart === "wheelset") {
                            return prevLockedParts.filter((part) => !["frontWheel", "rearWheel"].includes(part));
                        } else {
                            return prevLockedParts.filter((part) => part !== nextPart);
                        }
                    });
                }

                // Reset hit region correctness only if the part hasn't been selected before
                if (!selectedParts[currentPart]) {
                    setIsHitRegionCorrect(false); // Reset if moving to a new part
                }
            } else {
                alert("You cannot proceed. The total price exceeds your budget.");
            }
        } else {
            alert("Please place the current part in the correct position before proceeding.");
        }
    };



    const goBackToPreviousPart = () => {
        let partToUnlock;
        let newCurrentPart;

        switch (currentPart) {
            case "fork":
                newCurrentPart = "frame";
                partToUnlock = "frame";
                break;
            case "groupset":
                newCurrentPart = "fork";
                partToUnlock = "fork";
                break;
            case "wheelset":
                newCurrentPart = "groupset";
                partToUnlock = "groupset";
                break;
            case "seat":
                newCurrentPart = "wheelset";
                partToUnlock = ["frontWheel", "rearWheel"];
                break;
            case "cockpit":
                newCurrentPart = "seat";
                partToUnlock = "seat";
                break;
            default:
                break;
        }

        if (newCurrentPart) {
            setCurrentPart(newCurrentPart);

            // Check if the previous part(s) are still in the hit region
            if (Array.isArray(partToUnlock)) {
                const frontWheelPos = partPositions["frontWheel"];
                const rearWheelPos = partPositions["rearWheel"];
                const frontWheelInRegion = isInHitRegion("frontWheel", frontWheelPos);
                const rearWheelInRegion = isInHitRegion("rearWheel", rearWheelPos);
                setIsHitRegionCorrect(frontWheelInRegion && rearWheelInRegion);
            } else {
                const pos = partPositions[partToUnlock];
                setIsHitRegionCorrect(isInHitRegion(partToUnlock, pos));
            }

            // Update locked parts: lock all other parts and unlock only the one being navigated to
            setLockedParts((prevLockedParts) => {
                // Add the part you are currently moving away from to lockedParts
                let updatedLockedParts = [...prevLockedParts];
                if (currentPart === "wheelset") {
                    updatedLockedParts = [...updatedLockedParts, "frontWheel", "rearWheel"];
                } else if (!updatedLockedParts.includes(currentPart)) {
                    updatedLockedParts = [...updatedLockedParts, currentPart];
                }

                // Unlock the part you're going back to
                if (Array.isArray(partToUnlock)) {
                    return updatedLockedParts.filter((part) => !partToUnlock.includes(part));
                }
                return updatedLockedParts.filter((part) => part !== partToUnlock);
            });
        }
    };




    const handleAddToBuild = (partType, item) => {
        if (selectedParts[partType]?.item_id === item.item_id) {
            return; // Prevent incrementing the price when the same item is selected
        }

        // Remove the price of invalidated parts
        let invalidatedPartsPrice = 0;

        // Adjust the stats price and reset dependent parts
        setSelectedParts((prev) => {
            let updatedParts = { ...prev, [partType]: item };

            switch (partType) {
                case "frame":
                    // Add up the prices of invalidated parts based on frame dependency
                    if (prev.fork) invalidatedPartsPrice += Number(prev.fork.item_price);
                    if (prev.groupset) invalidatedPartsPrice += Number(prev.groupset.item_price);
                    if (prev.wheelset) invalidatedPartsPrice += Number(prev.wheelset.item_price);
                    if (prev.seat) invalidatedPartsPrice += Number(prev.seat.item_price);
                    if (prev.cockpit) invalidatedPartsPrice += Number(prev.cockpit.item_price);

                    // Invalidate dependent parts
                    updatedParts.fork = null;
                    updatedParts.groupset = null;
                    updatedParts.wheelset = null;
                    updatedParts.seat = null;
                    updatedParts.cockpit = null;
                    break;

                case "fork":
                    // Add up the prices of invalidated parts based on fork dependency
                    if (prev.groupset) invalidatedPartsPrice += Number(prev.groupset.item_price);
                    if (prev.wheelset) invalidatedPartsPrice += Number(prev.wheelset.item_price);
                    if (prev.cockpit) invalidatedPartsPrice += Number(prev.cockpit.item_price);

                    // Invalidate dependent parts
                    updatedParts.groupset = null;
                    updatedParts.wheelset = null;
                    updatedParts.cockpit = null;
                    break;

                case "groupset":
                    // Add up the prices of invalidated parts based on groupset dependency
                    if (prev.wheelset) invalidatedPartsPrice += Number(prev.wheelset.item_price);

                    // Invalidate dependent parts
                    updatedParts.wheelset = null;
                    break;

                case "wheelset":
                    // No dependent part invalidation needed for wheelset
                    break;

                case "seat":
                    // No dependent part invalidation needed for seat
                    break;

                default:
                    break;
            }

            return updatedParts;
        });

        // Remove the price of the currently selected part if it was previously selected
        if (selectedParts[partType]) {
            setBuildStatsPrice((prev) => prev - Number(selectedParts[partType].item_price));
        }

        // Add the new part's price and subtract invalidated parts' price
        setBuildStatsPrice((prev) => prev + Number(item.item_price) - invalidatedPartsPrice);

        // Reset positions for the part and dependent parts
        setPartPositions((prevPositions) => {
            let updatedPositions = { ...prevPositions };

            // Reset current part's position
            updatedPositions[partType] = { x: 100, y: 100 }; // Default position for each part

            // Reset dependent parts' positions
            switch (partType) {
                case "frame":
                    updatedPositions.fork = { x: 100, y: 100 };
                    updatedPositions.groupset = { x: 100, y: 100 };
                    updatedPositions.frontWheel = { x: 100, y: 100 };
                    updatedPositions.rearWheel = { x: 150, y: 100 };
                    updatedPositions.seat = { x: 100, y: 100 };
                    updatedPositions.cockpit = { x: 100, y: 100 };
                    break;
                case "fork":
                    updatedPositions.groupset = { x: 100, y: 100 };
                    updatedPositions.frontWheel = { x: 100, y: 100 };
                    updatedPositions.rearWheel = { x: 150, y: 100 };
                    updatedPositions.cockpit = { x: 100, y: 100 };
                    break;
                case "groupset":
                    updatedPositions.frontWheel = { x: 100, y: 100 };
                    updatedPositions.rearWheel = { x: 150, y: 100 };
                    break;
                case "wheelset":
                    // No dependent part reset needed
                    break;
                case "seat":
                    // No dependent part reset needed
                    break;
                default:
                    break;
            }

            return updatedPositions;
        });
    };



    // Load base64 images
    const frameImage = useBase64Image(selectedParts.frame?.item_image);
    const forkImage = useBase64Image(selectedParts.fork?.item_image);
    const groupsetImage = useBase64Image(selectedParts.groupset?.item_image);
    const wheelsetImage = useBase64Image(selectedParts.wheelset?.item_image);
    const seatImage = useBase64Image(selectedParts.seat?.item_image);
    const cockpitImage = useBase64Image(selectedParts.cockpit?.item_image);

    const isPartSelectedForCurrentPart = () => {
        if (currentPart === "wheelset") {
            const frontWheelPos = partPositions["frontWheel"];
            const rearWheelPos = partPositions["rearWheel"];

            const frontWheelHit = isInHitRegion("frontWheel", frontWheelPos);
            const rearWheelHit = isInHitRegion("rearWheel", rearWheelPos);

            return frontWheelHit && rearWheelHit;
        } else {
            return !!selectedParts[currentPart] && isHitRegionCorrect;
        }
    };


    const isInHitRegion = (partType, pos) => {
        const region = hitRegions[partType];
        return (
            pos.x >= region.x &&
            pos.x <= region.x + region.width &&
            pos.y >= region.y &&
            pos.y <= region.y + region.height
        );
    };

    // Handle dragging the part and check if it hits the hit region
    const handleDragEnd = (partType, e) => {
        const newPos = { x: e.target.x(), y: e.target.y() };

        setPartPositions((prev) => ({
            ...prev,
            [partType]: newPos
        }));

        if (partType === "frontWheel" || partType === "rearWheel") {
            const frontWheelPos = partType === "frontWheel" ? newPos : partPositions["frontWheel"];
            const rearWheelPos = partType === "rearWheel" ? newPos : partPositions["rearWheel"];

            const frontWheelHit = isInHitRegion("frontWheel", frontWheelPos);
            const rearWheelHit = isInHitRegion("rearWheel", rearWheelPos);

            if (frontWheelHit && rearWheelHit) {
                setIsHitRegionCorrect(true);
            } else {
                setIsHitRegionCorrect(false);
            }
        } else if (isInHitRegion(partType, newPos)) {
            setIsHitRegionCorrect(true);
        } else {
            setIsHitRegionCorrect(false);
        }
    };



    return (
        <div className="bike-builder-container">
            {showBudgetStep ? (
                <BudgetContainer
                    isSettingBudget={isSettingBudget}
                    budget={budget}
                    setBudget={setBudget}
                    handleProceed={handleProceed}
                    setIsSettingBudget={setIsSettingBudget}
                />
            ) : (
                <div className="builder-container d-flex">
                    <BuilderSidebar
                        currentPart={currentPart}
                        goBackToPreviousPart={goBackToPreviousPart}
                        proceedToNextPart={proceedToNextPart}
                        isPartSelectedForCurrentPart={isPartSelectedForCurrentPart}
                        handleAddToBuild={handleAddToBuild}
                        handleReset={handleReset}
                        selectedParts={selectedParts}
                        lockedParts={lockedParts}
                    />
                    <CanvasContainer
                        frameImage={frameImage}
                        forkImage={forkImage}
                        groupsetImage={groupsetImage}
                        wheelsetImage={wheelsetImage}
                        seatImage={seatImage}
                        cockpitImage={cockpitImage}
                        partPositions={partPositions}
                        handleDragEnd={handleDragEnd}
                        budget={budget}
                        buildStatsPrice={buildStatsPrice}
                        hitRegions={hitRegions}
                        currentPart={currentPart}
                        lockedParts={lockedParts}
                        resetBuild={resetBuild}
                    />
                </div>
            )}
        </div>
    );
};

export default BikeBuilder;
