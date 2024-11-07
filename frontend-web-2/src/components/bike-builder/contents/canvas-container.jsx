import React, { useRef, useState, useEffect } from 'react';
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

const CanvasContainer = ({
    partSelected, frameImage, forkImage, groupsetImage, wheelsetImage, seatImage, cockpitImage,
    partPositions, handleDragEnd, budget, buildStatsPrice, hitRegions, currentPart,
    lockedParts, resetBuild, captureCallback,
}) => {
    const transformerRef = useRef(null); // Reference for the transformer (for rotation)
    const [selectedPart, setSelectedPart] = useState(null); // To keep track of selected parts for rotation
    const [backgroundImage] = useImage(bikeguide); // Correct usage of useImage for background
    const stageRef = useRef(null);
    const partsLayerRef = useRef();
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
    const stageWidth = 1000;
    const stageHeight = 570;

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
        const partsLayer = partsLayerRef.current; // Reference to the parts layer (not the background layer)

        // Capture only the parts layer (excluding the background layer)
        const buildImage = partsLayer.toDataURL();

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
                            width={stageWidth}
                            height={stageHeight}
                            onMouseDown={confirmRotation}
                        >
                            <Layer>
                                {/* Background Image */}
                                {/* {backgroundImage && (
                                    <Image
                                        image={backgroundImage}
                                        x={(stageWidth - 570) / 2}
                                        y={(stageHeight - 570) / 2}
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
                                                    x={hitRegions.frontWheel.x}
                                                    y={hitRegions.frontWheel.y}
                                                    width={hitRegions.frontWheel.width}
                                                    height={hitRegions.frontWheel.height}
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
                                                    x={hitRegions.rearWheel.x}
                                                    y={hitRegions.rearWheel.y}
                                                    width={hitRegions.rearWheel.width}
                                                    height={hitRegions.rearWheel.height}
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
                                        hitRegions[selectedPart.name()] && (
                                            <Rect
                                                x={hitRegions[selectedPart.name()].x}
                                                y={hitRegions[selectedPart.name()].y}
                                                width={hitRegions[selectedPart.name()].width}
                                                height={hitRegions[selectedPart.name()].height}
                                                stroke="#00CED1" // Vivid teal color
                                                strokeWidth={1.5} // Slightly thicker stroke for visibility
                                                dash={[4, 2]} // Subtle dotted line
                                                shadowColor="#00CED1" // Shadow in the same color
                                                shadowBlur={8} // Light glow effect
                                                shadowOpacity={0.4} // Slightly stronger opacity for the glow
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
                                        height={225}
                                        width={225}
                                        opacity={selectedPart?.name() === 'frontWheel' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'frontWheel' && !lockedParts.includes("frontWheel")}
                                        listening={!lockedParts.includes("frontWheel")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 225, 225, stageWidth, stageHeight)} // Correct dimensions for front wheel
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".frontWheel");
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
                                            const part = partsLayerRef.current.findOne(".frontWheel");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("frontWheel", e);
                                        }}
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
                                        height={200}
                                        width={35}
                                        opacity={selectedPart?.name() === 'fork' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'fork' && !lockedParts.includes("fork")}
                                        listening={!lockedParts.includes("fork")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 97, 251, stageWidth, stageHeight)} // Correct dimensions for fork
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".fork");
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
                                            const part = partsLayerRef.current.findOne(".fork");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("fork", e);
                                        }}
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
                                        width={37}
                                        opacity={selectedPart?.name() === 'cockpit' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'cockpit' && !lockedParts.includes("cockpit")}
                                        listening={!lockedParts.includes("cockpit")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 46, 39, stageWidth, stageHeight)} // Correct dimensions for cockpit
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".cockpit");
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
                                            const part = partsLayerRef.current.findOne(".cockpit");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("cockpit", e);
                                        }}
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
                                        height={116}
                                        width={90}
                                        opacity={selectedPart?.name() === 'seat' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'seat' && !lockedParts.includes("seat")}
                                        listening={!lockedParts.includes("seat")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 90, 116, stageWidth, stageHeight)} // Correct dimensions for seat
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".seat");
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
                                            const part = partsLayerRef.current.findOne(".seat");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("seat", e);
                                        }}
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
                                        height={225}
                                        width={225}
                                        opacity={selectedPart?.name() === 'rearWheel' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'rearWheel' && !lockedParts.includes("rearWheel")}
                                        listening={!lockedParts.includes("rearWheel")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 225, 225, stageWidth, stageHeight)} // Correct dimensions for rear wheel
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".rearWheel");
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
                                            const part = partsLayerRef.current.findOne(".rearWheel");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("rearWheel", e);
                                        }}
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
                                        height={90} // The display height
                                        width={110} // Adjusted width to half of 220
                                        opacity={selectedPart?.name() === 'groupset' ? 0.85 : 1} // Slight opacity change when selected
                                        crop={{
                                            x: 0, // Crop starting from the left
                                            y: 0,
                                            width: groupsetImage.width / 2, // Crop to half of original 500 width
                                            height: groupsetImage.height, // Use original height
                                        }}
                                        draggable={selectedPart?.name() === 'groupset' && !lockedParts.includes("groupset")}
                                        listening={!lockedParts.includes("groupset")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 220, 90, stageWidth, stageHeight)}
                                        onClick={(e) => setSelectedPart(e.target)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".groupset");
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
                                            const part = partsLayerRef.current.findOne(".groupset");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("groupset", e);
                                        }}
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
                                        height={200}
                                        width={305}
                                        opacity={selectedPart?.name() === 'frame' ? 0.85 : 1} // Slight opacity change when selected
                                        draggable={selectedPart?.name() === 'frame' && !lockedParts.includes("frame")}
                                        listening={!lockedParts.includes("frame")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 305, 200, stageWidth, stageHeight)}
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
                                    />
                                )}

                                {/* Groupset Right Half (In Front of Frame) */}
                                {groupsetImage && (
                                    <Image
                                        name="groupset"
                                        image={groupsetImage}
                                        x={partPositions.groupset.x + 110} // Shift to the right for the second half
                                        y={partPositions.groupset.y}
                                        rotation={partPositions.groupset.rotation}
                                        height={90} // Same display height
                                        width={110} // Adjusted width
                                        opacity={selectedPart?.name() === 'groupset' ? 0.85 : 1} // Slight opacity change when selected
                                        crop={{
                                            x: groupsetImage.width / 2, // Start from middle of original 500 width
                                            y: 0,
                                            width: groupsetImage.width / 2, // Crop the second half of the image
                                            height: groupsetImage.height, // Use original height
                                        }}
                                        draggable={false}
                                        listening={!lockedParts.includes("groupset")}
                                        dragBoundFunc={(pos) => constrainDrag(pos, 220, 90, stageWidth, stageHeight)}
                                        onDragStart={() => {
                                            // Subtle highlight and scale when dragging starts
                                            const part = partsLayerRef.current.findOne(".groupset");
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
                                            const part = partsLayerRef.current.findOne(".groupset");
                                            part.to({
                                                stroke: '', // Remove border
                                                strokeWidth: 0,
                                                opacity: 1, // Reset opacity
                                                scaleX: 1, // Reset scale
                                                scaleY: 1,
                                                duration: 0.1,
                                            });
                                            handleDragEnd("groupset", e);
                                        }}
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
