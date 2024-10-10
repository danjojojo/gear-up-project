import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';

const CanvasContainer = ({
    frameImage, forkImage, groupsetImage, wheelsetImage, seatImage, cockpitImage,
    partPositions, handleDragEnd, budget, buildStatsPrice
}) => {
    const transformerRef = useRef(null); // Reference for the transformer (for rotation)
    const [selectedPart, setSelectedPart] = useState(null); // To keep track of selected parts for rotation

    // Function to ensure the drag stays within the canvas bounds
    const constrainDrag = (pos, imageWidth, imageHeight, stageWidth, stageHeight) => {
        const newX = Math.max(0, Math.min(pos.x, stageWidth - imageWidth));
        const newY = Math.max(0, Math.min(pos.y, stageHeight - imageHeight));
        return { x: newX, y: newY };
    };

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
        if (selectedPart && transformerRef.current) {
            transformerRef.current.nodes([selectedPart]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedPart]);

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
                        <Stage
                            width={stageWidth}
                            height={stageHeight}
                            onMouseDown={confirmRotation}
                        >
                            <Layer>
                                {/* Frame */}
                                {frameImage && (
                                    <Image
                                        image={frameImage}
                                        x={partPositions.frame.x}
                                        y={partPositions.frame.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, frameImage.width, frameImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("frame", e)}
                                    />
                                )}
                                {/* Fork */}
                                {forkImage && (
                                    <Image
                                        image={forkImage}
                                        x={partPositions.fork.x}
                                        y={partPositions.fork.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, forkImage.width, forkImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("fork", e)}
                                    />
                                )}
                                {/* Groupset */}
                                {groupsetImage && (
                                    <Image
                                        image={groupsetImage}
                                        x={partPositions.groupset.x}
                                        y={partPositions.groupset.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, groupsetImage.width, groupsetImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("groupset", e)}
                                    />
                                )}
                                {/* Front Wheel */}
                                {wheelsetImage && (
                                    <Image
                                        image={wheelsetImage}
                                        x={partPositions.frontWheel.x}
                                        y={partPositions.frontWheel.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, wheelsetImage.width, wheelsetImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("frontWheel", e)}
                                    />
                                )}
                                {/* Rear Wheel */}
                                {wheelsetImage && (
                                    <Image
                                        image={wheelsetImage}
                                        x={partPositions.rearWheel.x}
                                        y={partPositions.rearWheel.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, wheelsetImage.width, wheelsetImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("rearWheel", e)}
                                    />
                                )}
                                {/* Seat */}
                                {seatImage && (
                                    <Image
                                        image={seatImage}
                                        x={partPositions.seat.x}
                                        y={partPositions.seat.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, seatImage.width, seatImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("seat", e)}
                                    />
                                )}
                                {/* Cockpit */}
                                {cockpitImage && (
                                    <Image
                                        image={cockpitImage}
                                        x={partPositions.cockpit.x}
                                        y={partPositions.cockpit.y}
                                        draggable
                                        dragBoundFunc={(pos) => constrainDrag(pos, cockpitImage.width, cockpitImage.height, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragEnd={(e) => handleDragEnd("cockpit", e)}
                                    />
                                )}

                                <Transformer ref={transformerRef} />

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
