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
    const [step, setStep] = useState(1);
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

    // Handle the Back Button and Reset Everything
    const handleReset = () => {
        setShowBudgetStep(true);  // Show budget step again
        setIsSettingBudget(false);
        setBudget("");            // Reset the budget
        setStep(1);               // Reset to first step
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
        if (buildStatsPrice <= budget || !budget) {
            setStep((prevStep) => prevStep + 1);
        } else {
            alert("You cannot proceed. The total price exceeds your budget.");
        }
    };

    const goBackToPreviousPart = () => {
        setStep((prevStep) => Math.max(1, prevStep - 1));
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

    const handleDragEnd = (partType, e) => {
        setPartPositions((prev) => ({
            ...prev,
            [partType]: { x: e.target.x(), y: e.target.y() }
        }));
    };

    // Load base64 images
    const frameImage = useBase64Image(selectedParts.frame?.item_image);
    const forkImage = useBase64Image(selectedParts.fork?.item_image);
    const groupsetImage = useBase64Image(selectedParts.groupset?.item_image);
    const wheelsetImage = useBase64Image(selectedParts.wheelset?.item_image);
    const seatImage = useBase64Image(selectedParts.seat?.item_image);
    const cockpitImage = useBase64Image(selectedParts.cockpit?.item_image);

    const isPartSelectedForCurrentStep = () => {
        switch (step) {
            case 1: return !!selectedParts.frame;
            case 2: return !!selectedParts.fork;
            case 3: return !!selectedParts.groupset;
            case 4: return !!selectedParts.wheelset;
            case 5: return !!selectedParts.seat;
            case 6: return !!selectedParts.cockpit;
            default: return false;
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
                        step={step}
                        goBackToPreviousPart={goBackToPreviousPart}
                        proceedToNextPart={proceedToNextPart}
                        isPartSelectedForCurrentStep={isPartSelectedForCurrentStep}
                        handleAddToBuild={handleAddToBuild}
                        handleReset={handleReset}
                        selectedParts={selectedParts}
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
                    />
                </div>
            )}
        </div>
    );
};

export default BikeBuilder;
