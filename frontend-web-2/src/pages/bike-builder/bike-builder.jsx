import "./bike-builder.scss";
import React, { useState } from 'react';
import Frame from "./side-bar/frame";
import Fork from "./side-bar/fork";
import Groupset from "./side-bar/groupset";
import Wheelset from "./side-bar/wheelset";
import Cockpit from "./side-bar/cockpit";

const BikeBuilder = () => {
    // State to track which step the user is in
    const [showBudgetStep, setShowBudgetStep] = useState(true);
    const [isSettingBudget, setIsSettingBudget] = useState(false); // Whether the user chose to set a budget
    const [budget, setBudget] = useState(""); // The budget value
    const [step, setStep] = useState(1);

    const handleProceed = () => {
        if (!isSettingBudget || (isSettingBudget && budget)) {
            setShowBudgetStep(false); // Proceed to the bike builder
        }
    };

    const proceedToNextPart = () => {
        setStep((prevStep) => prevStep + 1);
    };
    return (
        <div className="bike-builder-container">
            {/* Budget Container (Full-Screen Overlay) */}
            {showBudgetStep && (
                <div className="budget-container">
                    <div className="budget-content">
                        {isSettingBudget ? (
                            <div className="content">
                                <label htmlFor="budgetInput">Budget</label>
                                <input
                                    id="budgetInput"
                                    type="text"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="Enter your budget"
                                />
                                <button className="btn-2" onClick={handleProceed}>
                                    Proceed to bike builder
                                </button>
                            </div>
                        ) : (
                            <div className="content d-flex">
                                <button className="btn-1" onClick={() => setIsSettingBudget(true)}>
                                    Set a budget
                                </button>
                                <button className="btn-1" onClick={handleProceed}>
                                    Continue without a budget
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main bike-builder content (only shows after budget is set or skipped) */}
            {!showBudgetStep && (
                <div className="builder-container">
                    <div className="bike-parts-sidebar">
                        <div className="upper-container">
                            <div className="part-title">
                                {step === 1 && "Choose Frame"}
                                {step === 2 && "Choose Fork"}
                                {step === 3 && "Choose Groupset"}
                                {step === 4 && "Choose Wheelset"}
                                {step === 5 && "Choose Cockpit"}
                            </div>

                            <div className="btn-container">
                                <button className="btn-1">Filter Price</button>
                                <button className="btn-2" onClick={proceedToNextPart}>Proceed</button>
                            </div>
                        </div>

                        <div className="lower-container">
                            {step === 1 && <Frame />}
                            {step === 2 && <Fork />}
                            {step === 3 && <Groupset />}
                            {step === 4 && <Wheelset />}
                            {step === 5 && <Cockpit />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BikeBuilder;
