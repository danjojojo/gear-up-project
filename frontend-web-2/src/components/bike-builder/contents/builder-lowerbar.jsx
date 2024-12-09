import React from 'react';
import Frame from '../side-bar/frame';
import Fork from '../side-bar/fork';
import Groupset from '../side-bar/groupset';
import Wheelset from '../side-bar/wheelset';
import Seat from '../side-bar/seat';
import Cockpit from '../side-bar/cockpit';
import backbutton from "../../../assets/icons/back-button.png";

const BuilderLowerbar = ({
    currentPart, // Now we use currentPart instead of step
    goBackToPreviousPart,
    proceedToNextPart,
    isPartSelectedForCurrentPart, // Updated to use currentPart instead of step
    handleAddToBuild,
    handleReset,
    selectedParts,
    lockedParts, // Added lockedParts to disable button logic
    handleFinalizeBuild
}) => {
    return (
        <div className="bike-parts-lowerbar">
            <div className="upper-container">
                {/* Back Button */}
                <div className="back-button" onClick={handleReset}>
                    <img src={backbutton} alt="back-button" />
                </div>
                <div className="part-title text-center">
                    {currentPart === "frame" && "Choose Frame"}
                    {currentPart === "fork" && "Choose Fork"}
                    {currentPart === "groupset" && "Choose Groupset"}
                    {currentPart === "wheelset" && "Choose Wheelset"}
                    {currentPart === "seat" && "Choose Seat"}
                    {currentPart === "cockpit" && "Choose Cockpit"}
                    {currentPart === "finalize" && "Finalize Build"} {/* Finalize step */}
                </div>


                {/* Disable the Back button if the current part is locked */}
                <button
                    className="btn-1"
                    onClick={goBackToPreviousPart}
                    disabled={currentPart === "frame"} // Disable only if at the first part
                >
                    Go Back
                </button>

                {/* Disable the Proceed button if the current part is not selected or is locked */}
                {currentPart !== "finalize" ? (
                    <button
                        className="btn-2"
                        onClick={proceedToNextPart}
                        disabled={!isPartSelectedForCurrentPart() || lockedParts.includes(currentPart)}
                    >
                        Proceed
                    </button>
                ) : (
                    <button className="btn-2" onClick={handleFinalizeBuild}>
                        Finalize Build
                    </button>
                )}

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
                {currentPart === "finalize" && (
                    <div className="finalize-container">
                        <div className='content'>
                            <div className='fs-3 fw-bold mb-3'>
                                Your Build is Ready!
                            </div>
                            <p className='fw-light text-justify'>All parts have been selected and your bike is ready to be finalized. Click "Finalize Build" to see your summary.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuilderLowerbar;
