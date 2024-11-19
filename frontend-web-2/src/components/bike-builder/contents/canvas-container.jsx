import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Image, Transformer, Rect } from 'react-konva';
import useImage from 'use-image'; // Correct import from use-image
import bikeguide from "../../../assets/images/bike-guide.png"; // Correct path for background image
import reset from "../../../assets/icons/reset.png";
import frame from "../../../assets/gif/0.frame.gif";
import fork from "../../../assets/gif/1.fork.gif";
import groupset from "../../../assets/gif/2.groupset.gif";
import wheelset from "../../../assets/gif/3.wheelset.gif";
import seat from "../../../assets/gif/4.seat.gif";
import cockpit from "../../../assets/gif/5.cockpit.gif";
import MessageContainer from './message-container';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote, faMessage, faWrench, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { Modal } from 'react-bootstrap';
const CanvasContainer = ({
    partSelected, frameImage, forkImage, groupsetImage, wheelsetImage, seatImage, cockpitImage,
    partPositions, handleDragEnd, budget, buildStatsPrice, hitRegions, currentPart,
    lockedParts, resetBuild, captureCallback, onUpdateAdjustedHitRegions
}) => {
    const transformerRef = useRef(null); // Reference for the transformer (for rotation)
    const [selectedPart, setSelectedPart] = useState(null); // To keep track of selected parts for rotation
    const [backgroundImage] = useImage(bikeguide); // Correct usage of useImage for background
    const stageRef = useRef(null);
    const partsLayerRef = useRef();
    // Define the steps in order
    const steps = ["frame", "fork", "groupset", "wheelset", "seat", "cockpit"];
    const isSmallScreen = window.innerWidth <= 768;
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [isModalVisible4, setIsModalVisible4] = useState(false);

    // Function to ensure the drag stays within the canvas bounds
    const constrainDrag = (pos, imageWidth, imageHeight) => {
        const stageWidth = isSmallScreen ? 500 : 1000;
        const stageHeight = isSmallScreen ? 350 : 570;

        const newX = Math.max(0, Math.min(pos.x, stageWidth - imageWidth));
        const newY = Math.max(0, Math.min(pos.y, stageHeight - imageHeight));
        return { x: newX, y: newY };
    };

    const [stageDimensions, setStageDimensions] = useState({
        width: 1000,
        height: 570,
    });

    const updateStageDimensions = () => {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 768) {
            stageRef.current?.width(490);
            stageRef.current?.height(300);
        } else {
            stageRef.current?.width(1000);
            stageRef.current?.height(570);
        }

        stageRef.current?.batchDraw(); // Ensure stage updates visually
    };


    const adjustedHitRegions = useMemo(() => {
        return isSmallScreen
            ? {
                frame: { x: 150, y: 73, width: 155, height: 110, rotation: 0 },
                fork: { x: 273, y: 72, width: 30, height: 120, rotation: -27 },
                groupset: { x: 135, y: 148, width: 68, height: 53, rotation: 0 },
                frontWheel: { x: 270, y: 109, width: 125, height: 117, rotation: 0 },
                rearWheel: { x: 92, y: 109, width: 125, height: 117, rotation: 0 },
                seat: { x: 173, y: 75, width: 55, height: 64, rotation: -5 },
                cockpit: { x: 282, y: 58, width: 26, height: 22, rotation: 0 },
            }
            : hitRegions;
    }, [isSmallScreen, hitRegions]);

    const adjustedImageDimensions = isSmallScreen
        ? {
            frame: { width: 150, height: 104 },
            fork: { width: 17.5, height: 100 },
            groupset: { width: 55, height: 45 },
            frontWheel: { width: 112.5, height: 112.5 },
            rearWheel: { width: 112.5, height: 112.5 },
            seat: { width: 45, height: 58 },
            cockpit: { width: 18.5, height: 19.5 },
        }
        : {
            frame: { width: 305, height: 200 },
            fork: { width: 35, height: 200 },
            groupset: { width: 110, height: 90 },
            frontWheel: { width: 225, height: 225 },
            rearWheel: { width: 225, height: 225 },
            seat: { width: 90, height: 116 },
            cockpit: { width: 37, height: 39 },
        };

    useEffect(() => {
        updateStageDimensions();
        window.addEventListener("resize", updateStageDimensions);

        return () => {
            window.removeEventListener("resize", updateStageDimensions);
        };
    }, []);

    useEffect(() => {
        if (onUpdateAdjustedHitRegions) {
            onUpdateAdjustedHitRegions(adjustedHitRegions);
        }
    }, [adjustedHitRegions, onUpdateAdjustedHitRegions]);

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
    // const stageDimensions.width = 1000;
    // const stageDimensions.height = 570;

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
        const stage = stageRef.current; // Reference to the entire Stage
        const partsLayer = partsLayerRef.current; // Reference to the parts layer

        if (!stage || !partsLayer) {
            console.warn("Stage or parts layer is not available for capture.");
            return null;
        }

        // Save the original dimensions and scale
        const originalWidth = stage.width();
        const originalHeight = stage.height();
        const originalScale = stage.scale();

        // Determine a consistent scale factor for high resolution
        const scaleFactor = 2; // 2x resolution, adjust as needed

        // Adjust stage and layer for capture
        stage.width(originalWidth * scaleFactor);
        stage.height(originalHeight * scaleFactor);
        stage.scale({ x: scaleFactor, y: scaleFactor });
        stage.batchDraw(); // Redraw with updated dimensions

        // Capture the stage as a high-resolution image
        const buildImage = stage.toDataURL({ pixelRatio: scaleFactor });

        // Reset stage to its original dimensions and scale
        stage.width(originalWidth);
        stage.height(originalHeight);
        stage.scale(originalScale);
        stage.batchDraw(); // Redraw the stage

        return buildImage;
    };


    return (
        <div className="bike-content d-flex">
            <div className="left-container">
                <div className="budget-stat-container d-flex">
                    <div className="budget">
                        <div className="content">
                            {budget && (
                                <div className='upper d-flex'>
                                    <div className="price">
                                        Budget:
                                        <span style={{ color: buildStatsPrice <= budget || !budget ? 'green' : 'red' }}>
                                            {" "} {PesoFormat.format(budget)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {!budget && (
                                <div className='upper d-flex'>
                                    <div className="price">
                                        Note:
                                    </div>
                                </div>
                            )}
                            <div className='lower'>
                                <span>Please select and drag the part exactly onto the highlighted hit region before proceeding.</span>
                            </div>
                        </div>
                    </div>

                    <MessageContainer currentPart={currentPart} partSelected={partSelected} />
                </div>

                <div className="canvas-container">
                    <div className="canvas-content">
                        <img src={reset} alt="reset" onClick={resetBuild} />
                        <Stage
                            ref={stageRef}
                            width={isSmallScreen ? 490 : 1000}
                            height={isSmallScreen ? 300 : 570}
                            onMouseDown={confirmRotation}
                        >
                            <Layer>
                                {/* Background Image */}
                                {/* {backgroundImage && (
                                    <Image
                                        image={backgroundImage}
                                        x={(stageDimensions.width - 570) / 2}
                                        y={(stageDimensions.height - 570) / 2}
                                        width={570}
                                        height={570}
                                        opacity={0.6}
                                    />
                                )} */}
                            </Layer>
                            <Layer ref={partsLayerRef}>
                                {selectedPart && (
                                    currentPart === "wheelset" ? (
                                        <>
                                            {/* Front Wheel Hit Region */}
                                            {selectedPart.name() === "frontWheel" && (
                                                <Rect
                                                    x={adjustedHitRegions.frontWheel.x}
                                                    y={adjustedHitRegions.frontWheel.y}
                                                    width={adjustedHitRegions.frontWheel.width}
                                                    height={adjustedHitRegions.frontWheel.height}
                                                    stroke="#00CED1" // Vivid teal color
                                                    strokeWidth={1.5} // Slightly thicker stroke for visibility
                                                    dash={[4, 2]} // Subtle dotted line
                                                    shadowColor="#00CED1" // Shadow in the same color
                                                    shadowBlur={8} // Light glow effect
                                                    shadowOpacity={0.4} // Slightly stronger opacity for the glow
                                                />
                                            )}
                                            {/* Rear Wheel Hit Region */}
                                            {selectedPart.name() === "rearWheel" && (
                                                <Rect
                                                    x={adjustedHitRegions.rearWheel.x}
                                                    y={adjustedHitRegions.rearWheel.y}
                                                    width={adjustedHitRegions.rearWheel.width}
                                                    height={adjustedHitRegions.rearWheel.height}
                                                    stroke="#00CED1" // Vivid teal color
                                                    strokeWidth={1.5} // Slightly thicker stroke for visibility
                                                    dash={[4, 2]} // Subtle dotted line
                                                    shadowColor="#00CED1" // Shadow in the same color
                                                    shadowBlur={8} // Light glow effect
                                                    shadowOpacity={0.4} // Slightly stronger opacity for the glow
                                                />
                                            )}
                                        </>
                                    ) : (
                                        adjustedHitRegions[selectedPart.name()] && (
                                            <Rect
                                                x={adjustedHitRegions[selectedPart.name()].x}
                                                y={adjustedHitRegions[selectedPart.name()].y}
                                                width={adjustedHitRegions[selectedPart.name()].width}
                                                height={adjustedHitRegions[selectedPart.name()].height}
                                                stroke="#00CED1" // Vivid teal color
                                                strokeWidth={1.5} // Slightly thicker stroke for visibility
                                                dash={[4, 2]} // Subtle dotted line
                                                shadowColor="#00CED1" // Shadow in the same color
                                                shadowBlur={8} // Light glow effect
                                                shadowOpacity={0.4} // Slightly stronger opacity for the glow
                                                rotation={adjustedHitRegions[selectedPart.name()].rotation}
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
                                        height={adjustedImageDimensions.frontWheel.height}
                                        width={adjustedImageDimensions.frontWheel.width}
                                        opacity={selectedPart?.name() === "frontWheel" ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={
                                            selectedPart?.name() === "frontWheel" &&
                                            !lockedParts.includes("frontWheel")
                                        }
                                        listening={!lockedParts.includes("frontWheel")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.frontWheel.width,
                                                adjustedImageDimensions.frontWheel.height
                                            )
                                        } // Correct dimensions for front wheel
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            const part = partsLayerRef.current.findOne(".frontWheel");
                                            part.to({
                                                stroke: "#888",
                                                strokeWidth: 1.5,
                                                opacity: 0.9,
                                                scaleX: 1.02,
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            const part = partsLayerRef.current.findOne(".frontWheel");
                                            part.to({
                                                stroke: "",
                                                strokeWidth: 0,
                                                opacity: 1,
                                                scaleX: 1,
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("frontWheel", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
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
                                        height={adjustedImageDimensions.fork.height}
                                        width={adjustedImageDimensions.fork.width}
                                        opacity={selectedPart?.name() === "fork" ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === "fork" && !lockedParts.includes("fork")}
                                        listening={!lockedParts.includes("fork")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.fork.width,
                                                adjustedImageDimensions.fork.height
                                            )
                                        } // Correct dimensions for fork
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".fork");
                                            part.to({
                                                stroke: "#888", // Light gray border to highlight
                                                strokeWidth: 1.5,
                                                opacity: 0.9, // Slight fade effect
                                                scaleX: 1.02, // Slightly increase scale
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            // Reset minimal effect when dragging ends
                                            const part = partsLayerRef.current.findOne(".fork");
                                            part.to({
                                                stroke: "", // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("fork", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
                                    />
                                )}

                                {cockpitImage && (
                                    <Image
                                        name="cockpit"
                                        image={cockpitImage}
                                        x={partPositions.cockpit.x}
                                        y={partPositions.cockpit.y}
                                        rotation={partPositions.cockpit.rotation}
                                        height={adjustedImageDimensions.cockpit.height}
                                        width={adjustedImageDimensions.cockpit.width}
                                        opacity={selectedPart?.name() === "cockpit" ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={
                                            selectedPart?.name() === "cockpit" && !lockedParts.includes("cockpit")
                                        }
                                        listening={!lockedParts.includes("cockpit")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.cockpit.width,
                                                adjustedImageDimensions.cockpit.height
                                            )
                                        } // Correct dimensions for cockpit
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            const part = partsLayerRef.current.findOne(".cockpit");
                                            part.to({
                                                stroke: "#888", // Light gray border to highlight
                                                strokeWidth: 1.5,
                                                opacity: 0.9, // Slight fade effect
                                                scaleX: 1.02, // Slightly increase scale
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            const part = partsLayerRef.current.findOne(".cockpit");
                                            part.to({
                                                stroke: "", // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("cockpit", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
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
                                        height={adjustedImageDimensions.seat.height}
                                        width={adjustedImageDimensions.seat.width}
                                        opacity={selectedPart?.name() === "seat" ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={
                                            selectedPart?.name() === "seat" && !lockedParts.includes("seat")
                                        }
                                        listening={!lockedParts.includes("seat")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.seat.width,
                                                adjustedImageDimensions.seat.height
                                            )
                                        } // Correct dimensions for seat
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            const part = partsLayerRef.current.findOne(".seat");
                                            part.to({
                                                stroke: "#888", // Light gray border to highlight
                                                strokeWidth: 1.5,
                                                opacity: 0.9, // Slight fade effect
                                                scaleX: 1.02, // Slightly increase scale
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            const part = partsLayerRef.current.findOne(".seat");
                                            part.to({
                                                stroke: "", // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("seat", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
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
                                        height={adjustedImageDimensions.rearWheel.height}
                                        width={adjustedImageDimensions.rearWheel.width}
                                        opacity={selectedPart?.name() === "rearWheel" ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={
                                            selectedPart?.name() === "rearWheel" &&
                                            !lockedParts.includes("rearWheel")
                                        }
                                        listening={!lockedParts.includes("rearWheel")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.rearWheel.width,
                                                adjustedImageDimensions.rearWheel.height
                                            )
                                        } // Correct dimensions for rear wheel
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            const part = partsLayerRef.current.findOne(".rearWheel");
                                            part.to({
                                                stroke: "#888",
                                                strokeWidth: 1.5,
                                                opacity: 0.9,
                                                scaleX: 1.02,
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            const part = partsLayerRef.current.findOne(".rearWheel");
                                            part.to({
                                                stroke: "",
                                                strokeWidth: 0,
                                                opacity: 1,
                                                scaleX: 1,
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("rearWheel", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
                                    />
                                )}


                                {/* Groupset Left Half (Behind Frame) */}
                                {groupsetImage && (
                                    <Image
                                        name="groupset"
                                        image={groupsetImage}
                                        x={partPositions.groupset.x}
                                        y={partPositions.groupset.y}
                                        rotation={partPositions.groupset.rotation}
                                        height={adjustedImageDimensions.groupset.height}
                                        width={adjustedImageDimensions.groupset.width}
                                        opacity={selectedPart?.name() === 'groupset' ? 0.85 : 1}
                                        crop={{
                                            x: 0,
                                            y: 0,
                                            width: groupsetImage.width / 2,
                                            height: groupsetImage.height,
                                        }}
                                        draggable={selectedPart?.name() === 'groupset' && !lockedParts.includes("groupset")}
                                        listening={!lockedParts.includes("groupset")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.groupset.width,
                                                adjustedImageDimensions.groupset.height
                                            )
                                        }
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            const part = partsLayerRef.current.findOne(".groupset");
                                            part.to({
                                                stroke: '#888',
                                                strokeWidth: 1.5,
                                                opacity: 0.9,
                                                scaleX: 1.02,
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            const part = partsLayerRef.current.findOne(".groupset");
                                            part.to({
                                                stroke: '',
                                                strokeWidth: 0,
                                                opacity: 1,
                                                scaleX: 1,
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("groupset", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
                                    />
                                )}

                                {/* Frame (Over Left Half of Groupset) */}
                                {frameImage && (
                                    <Image
                                        name="frame"
                                        image={frameImage}
                                        x={partPositions.frame.x}
                                        y={partPositions.frame.y}
                                        rotation={partPositions.frame.rotation}
                                        height={adjustedImageDimensions.frame.height}
                                        width={adjustedImageDimensions.frame.width}
                                        opacity={selectedPart?.name() === 'frame' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'frame' && !lockedParts.includes("frame")}
                                        listening={!lockedParts.includes("frame")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.frame.width,
                                                adjustedImageDimensions.frame.height
                                            )
                                        }
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".frame");
                                            part.to({
                                                stroke: '#888', // Light gray border to highlight
                                                strokeWidth: 1.5,
                                                opacity: 0.9, // Slight fade effect
                                                scaleX: 1.02, // Slightly increase scale
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            // Reset minimal effect when dragging ends
                                            const part = partsLayerRef.current.findOne(".frame");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("frame", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
                                    />
                                )}

                                {/* Groupset Right Half (In Front of Frame) */}
                                {groupsetImage && (
                                    <Image
                                        name="groupset"
                                        image={groupsetImage}
                                        x={partPositions.groupset.x + adjustedImageDimensions.groupset.width} // Use adjusted width
                                        y={partPositions.groupset.y}
                                        rotation={partPositions.groupset.rotation}
                                        height={adjustedImageDimensions.groupset.height}
                                        width={adjustedImageDimensions.groupset.width}
                                        opacity={selectedPart?.name() === 'groupset' ? 0.85 : 1}
                                        crop={{
                                            x: groupsetImage.width / 2,
                                            y: 0,
                                            width: groupsetImage.width / 2,
                                            height: groupsetImage.height,
                                        }}
                                        draggable={false}
                                        listening={!lockedParts.includes("groupset")}
                                        dragBoundFunc={(pos) =>
                                            constrainDrag(
                                                pos,
                                                adjustedImageDimensions.groupset.width,
                                                adjustedImageDimensions.groupset.height
                                            )
                                        }
                                        onDragStart={() => {
                                            const part = partsLayerRef.current.findOne(".groupset");
                                            part.to({
                                                stroke: '#888',
                                                strokeWidth: 1.5,
                                                opacity: 0.9,
                                                scaleX: 1.02,
                                                scaleY: 1.02,
                                                duration: 0.1,
                                            });
                                        }}
                                        onDragEnd={(e) => {
                                            const part = partsLayerRef.current.findOne(".groupset");
                                            part.to({
                                                stroke: '',
                                                strokeWidth: 0,
                                                opacity: 1,
                                                scaleX: 1,
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("groupset", e);
                                        }}
                                        onTouchStart={(e) => setSelectedPart(e.target)}
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

                <div className='builder-nav'>
                    <button onClick={() => setIsModalVisible1(true)}>
                        <FontAwesomeIcon icon={faStickyNote} />
                    </button>
                    <button onClick={() => setIsModalVisible2(true)}>
                        <FontAwesomeIcon icon={faMessage} />
                    </button>
                    <button
                        onClick={() => setIsModalVisible3(true)}
                        disabled={currentPart === "finalize"} // Disable when currentPart is "none"
                        style={{
                            cursor: currentPart === "finalize" ? "not-allowed" : "pointer", // Change cursor style
                            opacity: currentPart === "finalize" ? 0.5 : 1, // Add visual cue for disabled state
                        }}
                    >
                        <FontAwesomeIcon icon={faWrench} />
                    </button>
                    <button onClick={() => setIsModalVisible4(true)}>
                        <FontAwesomeIcon icon={faMoneyBill} />
                    </button>
                </div>

                <Modal show={isModalVisible1} onHide={() => setIsModalVisible1(false)} centered>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="budget">
                            <div className="content">
                                {budget && (
                                    <div className="upper d-flex">
                                        <div className="price">
                                            Budget:
                                            <span
                                                style={{
                                                    color:
                                                        buildStatsPrice <= budget || !budget
                                                            ? 'green'
                                                            : 'red',
                                                }}
                                            >
                                                {" "}
                                                {PesoFormat.format(budget)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {!budget && (
                                    <div className="upper d-flex">
                                        <div className="price">Note:</div>
                                    </div>
                                )}
                                <div className="lower">
                                    <span>
                                        Please select and drag the part exactly onto the highlighted hit region before proceeding.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Second Modal: Message */}
                <Modal show={isModalVisible2} onHide={() => setIsModalVisible2(false)} centered>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <MessageContainer currentPart={currentPart} partSelected={partSelected} />
                    </Modal.Body>
                </Modal>

                <Modal show={isModalVisible3} onHide={() => setIsModalVisible3(false)} centered>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        {currentPart !== "finalize" && (
                            <div className="guide-container">
                                <div className="content-container">
                                    {currentPart === "frame" && (
                                        <img src={frame} alt="frame-fork" />
                                    )}
                                    {currentPart === "fork" && (
                                        <img src={fork} alt="guide-fork" />
                                    )}
                                    {currentPart === "groupset" && (
                                        <img src={groupset} alt="guide-groupset" />
                                    )}
                                    {currentPart === "wheelset" && (
                                        <img src={wheelset} alt="guide-wheelset" />
                                    )}
                                    {currentPart === "seat" && (
                                        <img src={seat} alt="guide-seat" />
                                    )}
                                    {currentPart === "cockpit" && (
                                        <img src={cockpit} alt="guide-cockpit" />
                                    )}
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

                <Modal show={isModalVisible4} onHide={() => setIsModalVisible4(false)} centered>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="summary-container">
                            <div className="content-container">
                                <h4>Total Build: {PesoFormat.format(buildStatsPrice)}</h4>
                            </div>
                            {
                                !partSelected.frame &&
                                !partSelected.fork &&
                                !partSelected.groupset &&
                                !partSelected.wheelset &&
                                !partSelected.seat &&
                                !partSelected.cockpit &&
                                <div className="parts-none">
                                    No selected parts yet.
                                </div>}
                            {partSelected && <div className="parts-prices">
                                {partSelected.frame && <div className='part-price'>
                                    Frame:
                                    <div className='price'>
                                        <p>
                                            {partSelected.frame.item_name}
                                        </p>
                                        <p>
                                            {PesoFormat.format(partSelected?.frame?.item_price || 0)}
                                        </p>
                                    </div>
                                </div>}
                                {partSelected.fork &&
                                    <div className='part-price'>
                                        Fork:
                                        <div className='price'>
                                            <p>
                                                {partSelected.fork.item_name}
                                            </p>
                                            <p>
                                                {PesoFormat.format(partSelected?.fork?.item_price || 0)}
                                            </p>
                                        </div>
                                    </div>}
                                {partSelected.groupset && <div className='part-price'>
                                    Groupset:
                                    <div className='price'>
                                        <p>
                                            {partSelected.groupset.item_name}
                                        </p>
                                        <p>
                                            {PesoFormat.format(partSelected?.groupset?.item_price || 0)}
                                        </p>
                                    </div>
                                </div>}
                                {partSelected.wheelset && <div className='part-price'>
                                    Wheelset:
                                    <div className='price'>
                                        <p>
                                            {partSelected.wheelset.item_name}
                                        </p>
                                        <p>
                                            {PesoFormat.format(partSelected?.wheelset?.item_price || 0)}
                                        </p>
                                    </div>
                                </div>}
                                {partSelected.seat && <div className='part-price'>
                                    Seat:
                                    <div className='price'>
                                        <p>
                                            {partSelected.seat.item_name}
                                        </p>
                                        <p>
                                            {PesoFormat.format(partSelected?.seat?.item_price || 0)}
                                        </p>
                                    </div>
                                </div>}
                                {partSelected.cockpit && <div className='part-price'>
                                    Cockpit:
                                    <div className='price'>
                                        <p>
                                            {partSelected.cockpit.item_name}
                                        </p>
                                        <p>
                                            {PesoFormat.format(partSelected?.cockpit?.item_price || 0)}
                                        </p>
                                    </div>
                                </div>}
                            </div>}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

            <div className="right-container">
                {currentPart !== "finalize" && <div className="guide-container">
                    <div className="content-container">

                        {currentPart === "frame" && (
                            <img src={frame} alt="frame-fork" />
                        )}
                        {currentPart === "fork" && (
                            <img src={fork} alt="guide-fork" />
                        )}
                        {currentPart === "groupset" && (
                            <img src={groupset} alt="guide-groupset" />
                        )}
                        {currentPart === "wheelset" && (
                            <img src={wheelset} alt="guide-wheelset" />
                        )}
                        {currentPart === "seat" && (
                            <img src={seat} alt="guide-seat" />
                        )}
                        {currentPart === "cockpit" && (
                            <img src={cockpit} alt="guide-cockpit" />
                        )}


                    </div>
                </div>}
                <div className="summary-container">
                    <div className="content-container">
                        <h4>Total Build: {PesoFormat.format(buildStatsPrice)}</h4>
                    </div>
                    {
                        !partSelected.frame &&
                        !partSelected.fork &&
                        !partSelected.groupset &&
                        !partSelected.wheelset &&
                        !partSelected.seat &&
                        !partSelected.cockpit &&
                        <div className="parts-none">
                            No selected parts yet.
                        </div>}
                    {partSelected && <div className="parts-prices">
                        {partSelected.frame && <div className='part-price'>
                            Frame:
                            <div className='price'>
                                <p>
                                    {partSelected.frame.item_name}
                                </p>
                                <p>
                                    {PesoFormat.format(partSelected?.frame?.item_price || 0)}
                                </p>
                            </div>
                        </div>}
                        {partSelected.fork &&
                            <div className='part-price'>
                                Fork:
                                <div className='price'>
                                    <p>
                                        {partSelected.fork.item_name}
                                    </p>
                                    <p>
                                        {PesoFormat.format(partSelected?.fork?.item_price || 0)}
                                    </p>
                                </div>
                            </div>}
                        {partSelected.groupset && <div className='part-price'>
                            Groupset:
                            <div className='price'>
                                <p>
                                    {partSelected.groupset.item_name}
                                </p>
                                <p>
                                    {PesoFormat.format(partSelected?.groupset?.item_price || 0)}
                                </p>
                            </div>
                        </div>}
                        {partSelected.wheelset && <div className='part-price'>
                            Wheelset:
                            <div className='price'>
                                <p>
                                    {partSelected.wheelset.item_name}
                                </p>
                                <p>
                                    {PesoFormat.format(partSelected?.wheelset?.item_price || 0)}
                                </p>
                            </div>
                        </div>}
                        {partSelected.seat && <div className='part-price'>
                            Seat:
                            <div className='price'>
                                <p>
                                    {partSelected.seat.item_name}
                                </p>
                                <p>
                                    {PesoFormat.format(partSelected?.seat?.item_price || 0)}
                                </p>
                            </div>
                        </div>}
                        {partSelected.cockpit && <div className='part-price'>
                            Cockpit:
                            <div className='price'>
                                <p>
                                    {partSelected.cockpit.item_name}
                                </p>
                                <p>
                                    {PesoFormat.format(partSelected?.cockpit?.item_price || 0)}
                                </p>
                            </div>
                        </div>}
                    </div>}
                </div>
            </div>
        </div >
    );
};

export default CanvasContainer;
