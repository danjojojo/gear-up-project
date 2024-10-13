import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Transformer, Rect } from 'react-konva';
import useImage from 'use-image'; // Correct import from use-image
import bikeguide from "../../../assets/images/bike-guide.png"; // Correct path for background image
import reset from "../../../assets/icons/reset.png";

const CanvasContainer = ({
    frameImage, forkImage, groupsetImage, wheelsetImage, seatImage, cockpitImage,
    partPositions, handleDragEnd, budget, buildStatsPrice, hitRegions, currentPart,
    lockedParts, resetBuild
}) => {
    const transformerRef = useRef(null); // Reference for the transformer (for rotation)
    const [selectedPart, setSelectedPart] = useState(null); // To keep track of selected parts for rotation
    const [backgroundImage] = useImage(bikeguide); // Correct usage of useImage for background

    // Function to ensure the drag stays within the canvas bounds
    const constrainDrag = (pos, imageWidth, imageHeight, stageWidth, stageHeight) => {
        const newX = Math.max(0, Math.min(pos.x, stageWidth - imageWidth));
        const newY = Math.max(0, Math.min(pos.y, stageHeight - imageHeight));
        return { x: newX, y: newY };
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            // If the click is not inside the Stage
            if (!e.target.closest('.konvajs-content')) {
                setSelectedPart(null); // Unselect part
                if (transformerRef.current) {
                    transformerRef.current.nodes([]); // Clear the transformer
                }
            }
        };

        // Add event listener for clicks anywhere in the document
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [transformerRef]);

    // Confirm rotation by clicking outside the selected part
    const confirmRotation = (e) => {
        const clickedOnEmptySpace = e.target === e.target.getStage();
        if (clickedOnEmptySpace) {
            setSelectedPart(null); // Unselect part
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
            }
        }
    };

    // Handle rotation
    useEffect(() => {
        if (selectedPart && transformerRef.current && !lockedParts.includes(selectedPart.name())) {
            transformerRef.current.nodes([selectedPart]);
            transformerRef.current.getLayer().batchDraw();
        } else {
            transformerRef.current.nodes([]); // Clear transformer if part is locked
        }
    }, [selectedPart, lockedParts]);

    // Fixed canvas width and height (adjustable)
    const stageWidth = 900;
    const stageHeight = 600;

    return (
        <div className="bike-content d-flex">
            <div className="left-container">
                <div className="budget-stat-container d-flex">
                    <div className="budget">
                        <div className="content d-flex">
                            {budget && (
                                <div className="price">
                                    Your Budget <br />
                                    Price: ₱ {budget}
                                </div>
                            )}
                            <div className="price">
                                Build Stats <br />
                                Total Price: ₱ {buildStatsPrice}
                            </div>
                        </div>
                    </div>

                    <div className="message">
                        <div className="content"></div>
                    </div>
                </div>

                <div className="canvas-container">
                    <div className="canvas-content">
                        <img src={reset} alt="reset" onClick={resetBuild} />
                        <Stage
                            width={stageWidth}
                            height={stageHeight}
                            onMouseDown={confirmRotation}
                        >
                            <Layer>
                                {/* Background Image */}
                                {backgroundImage && (
                                    <Image
                                        image={backgroundImage}
                                        x={(stageWidth - 600) / 2} // Centering horizontally
                                        y={(stageHeight - 600) / 2} // Centering vertically
                                        width={600}
                                        height={600}
                                        opacity={0.1}
                                    />
                                )}
                                {selectedPart && (
                                    currentPart === "wheelset" ? (
                                        <>
                                            {/* Front Wheel Hit Region */}
                                            {selectedPart.name() === "frontWheel" && (
                                                <Rect
                                                    x={hitRegions.frontWheel.x}
                                                    y={hitRegions.frontWheel.y}
                                                    width={hitRegions.frontWheel.width}
                                                    height={hitRegions.frontWheel.height}
                                                    stroke="green"
                                                    strokeWidth={2}
                                                    dash={[10, 5]} // Dashed line for visualizing hit region
                                                />
                                            )}
                                            {/* Rear Wheel Hit Region */}
                                            {selectedPart.name() === "rearWheel" && (
                                                <Rect
                                                    x={hitRegions.rearWheel.x}
                                                    y={hitRegions.rearWheel.y}
                                                    width={hitRegions.rearWheel.width}
                                                    height={hitRegions.rearWheel.height}
                                                    stroke="green"
                                                    strokeWidth={2}
                                                    dash={[10, 5]} // Dashed line for visualizing hit region
                                                />
                                            )}
                                        </>
                                    ) : (
                                        hitRegions[selectedPart.name()] && (
                                            <Rect
                                                x={hitRegions[selectedPart.name()].x}
                                                y={hitRegions[selectedPart.name()].y}
                                                width={hitRegions[selectedPart.name()].width}
                                                height={hitRegions[selectedPart.name()].height}
                                                stroke="green"
                                                strokeWidth={2}
                                                dash={[10, 5]} // Dashed line for visualizing hit region
                                                rotation={hitRegions[selectedPart.name()].rotation}
                                            />
                                        )
                                    )
                                )}
                                {/* Cockpit */}
                                {cockpitImage && (
                                    <Image
                                        name="cockpit"
                                        image={cockpitImage}
                                        x={partPositions.cockpit.x}
                                        y={partPositions.cockpit.y}
                                        height={39}
                                        width={46}
                                        draggable={selectedPart?.name() === 'cockpit' && !lockedParts.includes("cockpit")}
                                        listening={!lockedParts.includes("cockpit")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, cockpitImage.width, cockpitImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("cockpit", e)}
                                    />
                                )}
                                {/* Fork */}
                                {forkImage && (
                                    <Image
                                        name="fork"
                                        image={forkImage}
                                        x={partPositions.fork.x}
                                        y={partPositions.fork.y}
                                        height={251}
                                        width={97}
                                        draggable={selectedPart?.name() === 'fork' && !lockedParts.includes("fork")}
                                        listening={!lockedParts.includes("fork")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, forkImage.width, forkImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("fork", e)}
                                    />
                                )}
                                {seatImage && (
                                    <Image
                                        name="seat"
                                        image={seatImage}
                                        x={partPositions.seat.x}
                                        y={partPositions.seat.y}
                                        height={154}
                                        width={96}
                                        draggable={selectedPart?.name() === 'seat' && !lockedParts.includes("seat")}
                                        listening={!lockedParts.includes("seat")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, seatImage.width, seatImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("seat", e)}
                                    />
                                )}
                                {/* Frame */}
                                {frameImage && (
                                    <Image
                                        name="frame"
                                        image={frameImage}
                                        x={partPositions.frame.x}
                                        y={partPositions.frame.y}
                                        height={214}
                                        width={340}
                                        draggable={selectedPart?.name() === 'frame' && !lockedParts.includes("frame")}
                                        listening={!lockedParts.includes("frame")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, frameImage.width, frameImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("frame", e)}
                                    />
                                )}
                                {/* Groupset */}
                                {groupsetImage && (
                                    <Image
                                        name="groupset"
                                        image={groupsetImage}
                                        x={partPositions.groupset.x}
                                        y={partPositions.groupset.y}
                                        height={92}
                                        width={240}
                                        draggable={selectedPart?.name() === 'groupset' && !lockedParts.includes("groupset")}
                                        listening={!lockedParts.includes("groupset")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, groupsetImage.width, groupsetImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("groupset", e)}
                                    />
                                )}
                                {/* Front Wheel */}
                                {wheelsetImage && (
                                    <Image
                                        name="frontWheel"
                                        image={wheelsetImage}
                                        x={partPositions.frontWheel.x}
                                        y={partPositions.frontWheel.y}
                                        height={240}
                                        width={240}
                                        draggable={selectedPart?.name() === 'frontWheel' && !lockedParts.includes("frontWheel")}
                                        listening={!lockedParts.includes("frontWheel")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, wheelsetImage.width, wheelsetImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("frontWheel", e)}
                                    />
                                )}
                                {/* Rear Wheel */}
                                {wheelsetImage && (
                                    <Image
                                        name="rearWheel"
                                        image={wheelsetImage}
                                        x={partPositions.rearWheel.x}
                                        y={partPositions.rearWheel.y}
                                        height={240}
                                        width={240}
                                        draggable={selectedPart?.name() === 'rearWheel' && !lockedParts.includes("rearWheel")}
                                        listening={!lockedParts.includes("rearWheel")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, wheelsetImage.width, wheelsetImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("rearWheel", e)}
                                    />
                                )}
                                {/* Seat */}

                                <Transformer
                                    ref={transformerRef}
                                    enabledAnchors={["rotate"]} // Only allow rotation
                                />

                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="guide-container"></div>
            </div>
        </div>
    );
};

export default CanvasContainer;
