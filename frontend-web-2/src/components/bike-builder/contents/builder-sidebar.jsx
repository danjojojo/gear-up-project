import React from 'react';
import Frame from '../side-bar/frame';
import Fork from '../side-bar/fork';
import Groupset from '../side-bar/groupset';
import Wheelset from '../side-bar/wheelset';
import Seat from '../side-bar/seat';
import Cockpit from '../side-bar/cockpit';
import backbutton from "../../../assets/icons/back-button.png";

const BuilderSidebar = ({
    currentPart, // Now we use currentPart instead of step
    goBackToPreviousPart,
    proceedToNextPart,
    isPartSelectedForCurrentPart, // Updated to use currentPart instead of step
    handleAddToBuild,
    handleReset,
    selectedParts,
    lockedParts // Added lockedParts to disable button logic
}) => (
    <div className="bike-parts-sidebar">
        <div className="upper-container">
            {/* Back Button */}
            <div className="back-button" onClick={handleReset}>
                <img src={backbutton} alt="back-button" />
            </div>
            <div className="part-title">
                {currentPart === "frame" && "Choose Frame"}
                {currentPart === "fork" && "Choose Fork"}
                {currentPart === "groupset" && "Choose Groupset"}
                {currentPart === "wheelset" && "Choose Wheelset"}
                {currentPart === "seat" && "Choose Seat"}
                {currentPart === "cockpit" && "Choose Cockpit"}
            </div>

            <div className="btn-container">
                {/* Disable the Back button if the current part is locked */}
                <button
                    className="btn-1"
                    onClick={goBackToPreviousPart}
                    disabled={lockedParts.includes(currentPart)} // Disable if the current part is locked
                >
                    Go Back
                </button>

                {/* Disable the Proceed button if the current part is not selected or is locked */}
                <button
                    className="btn-2"
                    onClick={proceedToNextPart}
                    disabled={!isPartSelectedForCurrentPart() || lockedParts.includes(currentPart)} // Disable if part is not selected or locked
                >
                    Proceed
                </button>
            </div>
        </div>

        <div className="lower-container">
            {/* Render part-specific components based on currentPart */}
            {currentPart === "frame" && (
                <Frame onAddToBuild={(item) => handleAddToBuild("frame", item)} />
            )}

            {currentPart === "fork" && (
                <Fork
                    onAddToBuild={(item) => handleAddToBuild("fork", item)}
                    selectedFramePurpose={selectedParts.frame?.purpose}
                    selectedFrame={selectedParts.frame}
                />
            )}

            {currentPart === "groupset" && (
                <Groupset
                    onAddToBuild={(item) => handleAddToBuild("groupset", item)}
                    selectedFrame={selectedParts.frame}
                    selectedFork={selectedParts.fork}
                />
            )}

            {currentPart === "wheelset" && (
                <Wheelset
                    onAddToBuild={(item) => handleAddToBuild("wheelset", item)}
                    selectedFrame={selectedParts.frame}
                    selectedFork={selectedParts.fork}
                    selectedGroupset={selectedParts.groupset}
                />
            )}

            {currentPart === "seat" && (
                <Seat
                    onAddToBuild={(item) => handleAddToBuild("seat", item)}
                    selectedFrame={selectedParts.frame}
                />
            )}

            {currentPart === "cockpit" && (
                <Cockpit
                    onAddToBuild={(item) => handleAddToBuild("cockpit", item)}
                    selectedFrame={selectedParts.frame}
                    selectedFork={selectedParts.fork}
                />
            )}
        </div>
    </div>
);

export default BuilderSidebar;