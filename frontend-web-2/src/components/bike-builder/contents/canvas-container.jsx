import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';

const CanvasContainer = ({
    frameImage, forkImage, groupsetImage, wheelsetImage, seatImage, cockpitImage,
    partPositions, handleDragEnd, budget, buildStatsPrice
}) => {
    const canvasRef = useRef(null); // To reference the canvas container
    const [canvasSize, setCanvasSize] = useState({ width: 900, height: 600 });

    // Function to update the canvas size based on the container size
    const updateCanvasSize = () => {
        if (canvasRef.current) {
            const { offsetWidth, offsetHeight } = canvasRef.current;
            setCanvasSize({
                width: offsetWidth,
                height: offsetHeight
            });
        }
    };

    // Add event listener to window resize
    useEffect(() => {
        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Set the initial size

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

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

                <div className="canvas-container" ref={canvasRef}>
                    <div className="canvas-content">
                        <Stage width={canvasSize.width} height={canvasSize.height}>
                            <Layer>
                                {/* Frame */}
                                {frameImage && (
                                    <Image
                                        image={frameImage}
                                        x={partPositions.frame.x}
                                        y={partPositions.frame.y}
                                        draggable
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
                                        onDragEnd={(e) => handleDragEnd("cockpit", e)}
                                    />
                                )}
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
