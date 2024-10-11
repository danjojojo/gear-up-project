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
        frame: { x: 230, y: 145, width: 370, height: 270 },
        fork: { x: 485, y: 100, width: 200, height: 300 },
        groupset: { x: 210, y: 290, width: 300, height: 150 },
        frontWheel: { x: 503, y: 225, width: 250, height: 250 },
        rearWheel: { x: 145, y: 225, width: 250, height: 250 },
        seat: { x: 280, y: 100, width: 150, height: 210 },
        cockpit: { x: 505, y: 90, width: 100, height: 100 }
    };

    const [currentPart, setCurrentPart] = useState("frame"); // Tracks the current part being worked on
    const [lockedParts, setLockedParts] = useState([]);
    const [isHitRegionCorrect, setIsHitRegionCorrect] = useState(false); // New state to track if part is in the hit region

    // Handle the Back Button and Reset Everything
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

    const proceedToNextPart = () => {
        if (isHitRegionCorrect) {
            if (buildStatsPrice <= budget || !budget) {
                // Lock the part now, since the user is proceeding
                setLockedParts((prev) => [...prev, currentPart]);

                setIsHitRegionCorrect(false);

                // Move to the next part manually
                switch (currentPart) {
                    case "frame": setCurrentPart("fork"); break;
                    case "fork": setCurrentPart("groupset"); break;
                    case "groupset": setCurrentPart("wheelset"); break;
                    case "wheelset": setCurrentPart("seat"); break;
                    case "seat": setCurrentPart("cockpit"); break;
                    case "cockpit": break; // Last part, no further parts to move to
                    default: break;
                }
            } else {
                alert("You cannot proceed. The total price exceeds your budget.");
            }
        } else {
            alert("Please place the current part in the correct position before proceeding.");
        }
    };

    const goBackToPreviousPart = () => {
        switch (currentPart) {
            case "fork": setCurrentPart("frame"); break;
            case "groupset": setCurrentPart("fork"); break;
            case "wheelset": setCurrentPart("groupset"); break;
            case "seat": setCurrentPart("wheelset"); break;
            case "cockpit": setCurrentPart("seat"); break;
            default: break;
        }
    };

    const handleAddToBuild = (partType, item) => {
        if (selectedParts[partType]?.item_id === item.item_id) {
            return; // Prevent incrementing the price when the same item is selected
        }

        // Remove old part's price if a part is already selected
        if (selectedParts[partType]) {
            setBuildStatsPrice((prev) => prev - Number(selectedParts[partType].item_price));
        }

        // Add the new part's price
        setBuildStatsPrice((prev) => prev + Number(item.item_price));

        // Set the selected part
        setSelectedParts((prev) => ({
            ...prev,
            [partType]: item
        }));
    };

    // Load base64 images
    const frameImage = useBase64Image(selectedParts.frame?.item_image);
    const forkImage = useBase64Image(selectedParts.fork?.item_image);
    const groupsetImage = useBase64Image(selectedParts.groupset?.item_image);
    const wheelsetImage = useBase64Image(selectedParts.wheelset?.item_image);
    const seatImage = useBase64Image(selectedParts.seat?.item_image);
    const cockpitImage = useBase64Image(selectedParts.cockpit?.item_image);

    const isPartSelectedForCurrentPart = () => {
        console.log("Selected part:", selectedParts[currentPart]);
        console.log("Is hit region correct:", isHitRegionCorrect);
        return !!selectedParts[currentPart] && isHitRegionCorrect;
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
        setPartPositions((prev) => ({
            ...prev,
            [partType]: { x: e.target.x(), y: e.target.y() }
        }));

        const pos = { x: e.target.x(), y: e.target.y() };
        if (isInHitRegion(partType, pos)) {
            setIsHitRegionCorrect(true); // Part is correctly placed
            // Don't lock the part yet, wait for "Proceed"
        } else {
            setIsHitRegionCorrect(false); // Part is not correctly placed
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
                    />
                </div>
            )}
        </div>
    );
};

export default BikeBuilder;
