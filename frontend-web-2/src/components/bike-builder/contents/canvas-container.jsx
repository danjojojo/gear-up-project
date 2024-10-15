import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Transformer, Rect } from 'react-konva';
import useImage from 'use-image'; // Correct import from use-image
import bikeguide from "../../../assets/images/bike-guide.png"; // Correct path for background image
import reset from "../../../assets/icons/reset.png";

const CanvasContainer = ({
    partPrice, frameImage, forkImage, groupsetImage, wheelsetImage, seatImage, cockpitImage,
    partPositions, setPartPositions, handleDragEnd, budget, buildStatsPrice, hitRegions, currentPart,
    lockedParts, resetBuild, captureCallback
}) => {
    const transformerRef = useRef(null); // Reference for the transformer (for rotation)
    const [selectedPart, setSelectedPart] = useState(null); // To keep track of selected parts for rotation
    const [backgroundImage] = useImage(bikeguide); // Correct usage of useImage for background
    const stageRef = useRef(null);
    // Define the steps in order
    const steps = ["frame", "fork", "groupset", "wheelset", "seat", "cockpit"];

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

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    useEffect(() => {
        // If a captureCallback function is provided, assign the captureBuildImage function to it
        if (captureCallback) {
            captureCallback.current = captureBuildImage;
        }
    }, [captureCallback]);

    // Function to capture the current canvas as an image
    const captureBuildImage = () => {
        const stage = stageRef.current; // Get the stage reference
        return stage.toDataURL();  // Convert the current canvas to a base64 image
    };

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
                                Total Price: {PesoFormat.format(buildStatsPrice)}
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
                            ref={stageRef}
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
                                {/* Front Wheel */}
                                {wheelsetImage && (
                                    <Image
                                        name="frontWheel"
                                        image={wheelsetImage}
                                        x={partPositions.frontWheel.x}
                                        y={partPositions.frontWheel.y}
                                        rotation={partPositions.frontWheel.rotation}
                                        height={240}
                                        width={240}
                                        draggable={selectedPart?.name() === 'frontWheel' && !lockedParts.includes("frontWheel")}
                                        listening={!lockedParts.includes("frontWheel")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 240, 240, stageWidth, stageHeight)} // Correct dimensions for front wheel
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("frontWheel", e)}
                                    />
                                )}
                                {/* Fork */}
                                {forkImage && (
                                    <Image
                                        name="fork"
                                        image={forkImage}
                                        x={partPositions.fork.x}
                                        y={partPositions.fork.y}
                                        rotation={partPositions.fork.rotation}
                                        height={251}
                                        width={97}
                                        draggable={selectedPart?.name() === 'fork' && !lockedParts.includes("fork")}
                                        listening={!lockedParts.includes("fork")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 97, 251, stageWidth, stageHeight)} // Correct dimensions for fork
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("fork", e)}
                                    />
                                )}
                                {cockpitImage && (
                                    <Image
                                        name="cockpit"
                                        image={cockpitImage}
                                        x={partPositions.cockpit.x}
                                        y={partPositions.cockpit.y}
                                        rotation={partPositions.cockpit.rotation}
                                        height={39}
                                        width={46}
                                        draggable={selectedPart?.name() === 'cockpit' && !lockedParts.includes("cockpit")}
                                        listening={!lockedParts.includes("cockpit")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 46, 39, stageWidth, stageHeight)} // Correct dimensions for cockpit
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("cockpit", e)}
                                    />
                                )}
                                {/* Seat */}
                                {seatImage && (
                                    <Image
                                        name="seat"
                                        image={seatImage}
                                        x={partPositions.seat.x}
                                        y={partPositions.seat.y}
                                        rotation={partPositions.seat.rotation}
                                        height={154}
                                        width={96}
                                        draggable={selectedPart?.name() === 'seat' && !lockedParts.includes("seat")}
                                        listening={!lockedParts.includes("seat")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 96, 154, stageWidth, stageHeight)} // Correct dimensions for seat
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
                                        rotation={partPositions.frame.rotation}
                                        height={214}
                                        width={340}
                                        draggable={selectedPart?.name() === 'frame' && !lockedParts.includes("frame")}
                                        listening={!lockedParts.includes("frame")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 340, 214, stageWidth, stageHeight)} // Correct dimensions for frame
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("frame", e)}
                                    />
                                )}
                                {/* Rear Wheel */}
                                {wheelsetImage && (
                                    <Image
                                        name="rearWheel"
                                        image={wheelsetImage}
                                        x={partPositions.rearWheel.x}
                                        y={partPositions.rearWheel.y}
                                        rotation={partPositions.rearWheel.rotation}
                                        height={240}
                                        width={240}
                                        draggable={selectedPart?.name() === 'rearWheel' && !lockedParts.includes("rearWheel")}
                                        listening={!lockedParts.includes("rearWheel")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 240, 240, stageWidth, stageHeight)} // Correct dimensions for rear wheel
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("rearWheel", e)}
                                    />
                                )}
                                {/* Groupset */}
                                {groupsetImage && (
                                    <Image
                                        name="groupset"
                                        image={groupsetImage}
                                        x={partPositions.groupset.x}
                                        y={partPositions.groupset.y}
                                        rotation={partPositions.groupset.rotation}
                                        height={92}
                                        width={240}
                                        draggable={selectedPart?.name() === 'groupset' && !lockedParts.includes("groupset")}
                                        listening={!lockedParts.includes("groupset")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 240, 92, stageWidth, stageHeight)} // Correct dimensions for groupset
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("groupset", e)}
                                    />
                                )}

                                <Transformer
                                    ref={transformerRef}
                                    rotateEnabled={true}
                                    resizeEnabled={false}
                                    anchorSize={8}
                                />

                            </Layer>
                        </Stage>

                        <div className="step-progress-bar">
                            {steps.map((step, index) => (
                                <div key={index} className={`step ${step === currentPart ? 'active' : ''}`}>
                                    <div className="oblong"></div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="guide-container">
                    <div className="content-container">

                    </div>
                </div>
                <div className="summary-container">
                    <div className="content-container">
                        <div className='part-price'>
                            <div className='price'>
                                Frame:  {PesoFormat.format(partPrice?.frame?.item_price || 0)}
                            </div>
                        </div>
                        <div className='part-price'>
                            <div className='price'>
                                Fork:  {PesoFormat.format(partPrice?.fork?.item_price || 0)}
                            </div>
                        </div>
                        <div className='part-price'>
                            <div className='price'>
                                Groupset:  {PesoFormat.format(partPrice?.groupset?.item_price || 0)}
                            </div>
                        </div>
                        <div className='part-price'>
                            <div className='price'>
                                Wheelset:  {PesoFormat.format(partPrice?.wheelset?.item_price || 0)}
                            </div>
                        </div>
                        <div className='part-price'>
                            <div className='price'>
                                Seat:  {PesoFormat.format(partPrice?.seat?.item_price || 0)}
                            </div>
                        </div>
                        <div className='part-price'>
                            <div className='price'>
                                Cockpit:  {PesoFormat.format(partPrice?.cockpit?.item_price || 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanvasContainer;
