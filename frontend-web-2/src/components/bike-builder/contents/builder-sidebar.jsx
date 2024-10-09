import React from 'react';
import Frame from '../side-bar/frame';
import Fork from '../side-bar/fork';
import Groupset from '../side-bar/groupset';
import Wheelset from '../side-bar/wheelset';
import Seat from '../side-bar/seat';
import Cockpit from '../side-bar/cockpit';
import backbutton from "../../../assets/icons/back-button.png"

const BuilderSidebar = ({ step, goBackToPreviousPart, proceedToNextPart, isPartSelectedForCurrentStep, handleAddToBuild, handleReset }) => (
    <div className="bike-parts-sidebar">
        <div className="upper-container">
            {/* Back Button */}
            <div className="back-button" onClick={handleReset}>
                <img src={backbutton} alt="back-button" />
            </div>
            <div className="part-title">
                {step === 1 && "Choose Frame"}
                {step === 2 && "Choose Fork"}
                {step === 3 && "Choose Groupset"}
                {step === 4 && "Choose Wheelset"}
                {step === 5 && "Choose Seat"}
                {step === 6 && "Choose Cockpit"}
            </div>

            <div className="btn-container">
                <button className="btn-1" onClick={goBackToPreviousPart}>Go Back</button>
                <button
                    className="btn-2"
                    onClick={proceedToNextPart}
                    disabled={!isPartSelectedForCurrentStep()}
                >
                    Proceed
                </button>
            </div>
        </div>

        <div className="lower-container">
            {step === 1 && <Frame onAddToBuild={(item) => handleAddToBuild("frame", item)} />}
            {step === 2 && <Fork onAddToBuild={(item) => handleAddToBuild("fork", item)} />}
            {step === 3 && <Groupset onAddToBuild={(item) => handleAddToBuild("groupset", item)} />}
            {step === 4 && <Wheelset onAddToBuild={(item) => handleAddToBuild("wheelset", item)} />}
            {step === 5 && <Seat onAddToBuild={(item) => handleAddToBuild("seat", item)} />}
            {step === 6 && <Cockpit onAddToBuild={(item) => handleAddToBuild("cockpit", item)} />}
        </div>
    </div>
);

export default BuilderSidebar;
