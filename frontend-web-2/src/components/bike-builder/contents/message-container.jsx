import React, { useState, useEffect } from 'react';
import leftarrow from "../../../assets/icons/left-arrow.png";
import rightarrow from "../../../assets/icons/right-arrow.png";

const MessageContainer = ({ currentPart, partSelected }) => {
    const [showHelp, setShowHelp] = useState(false); // Toggle between main message and help
    const [currentSlide, setCurrentSlide] = useState(0); // Track current slide in help text
    const [currentSlideGroup, setCurrentSlideGroup] = useState(0); // Track current slide group (0: riding, 1: height, etc.)

    let forkTravel;
    if (partSelected?.frame?.purpose === 'Cross-country (XC)') {
        forkTravel = '80mm to 120mm';
    } else if (partSelected?.frame?.purpose === 'Trail') {
        forkTravel = '120mm to 160mm';
    } else if (partSelected?.frame?.purpose === 'Enduro') {
        forkTravel = '150mm to 180mm';
    } else if (partSelected?.frame?.purpose === 'Downhill (DH)') {
        forkTravel = '180mm to 200mm';
    }

    // Initial message content for each part
    const initialMessagesByPart = {
        frame: {
            upperText: <>Let’s start your bike build by finding your frame!</>,
            lowerText: <>The frame is the core of your bike, holding everything together.</>
        },
        fork: {
            upperText: <>Now, let’s pick your fork! The fork helps smooth out the bumps and keeps your bike stable.</>,
            lowerText: <>To get the right one, we’ll check your frame’s setup.</>
        },
        groupset: {
            upperText: <>Let’s choose your groupset next! The groupset controls your gears and brakes that will help you ride smoothly.</>,
            lowerText: <>To get the right one, we’ll check your frame and fork’s setup.</>
        },
        wheelset: {
            upperText: <>Next, we will be finding your wheelset! Your wheelset is the pair of wheels on which your bike rolls; both the front and the back wheels.</>,
            lowerText: <>To get the right one, we’ll check your frame, fork, and groupset’s setup.</>
        },
        seat: {
            upperText: <>We are almost there! Next is the seat. You’ll want to pick a seat that fits your frame.</>,
            lowerText: <>To get the right one, we’ll check your frame’s setup.</>
        },
        cockpit: {
            upperText: <>Let’s finish strong by choosing your bike’s cockpit! The cockpit (handlebar, stem, and headset) is where you control your bike.</>,
            lowerText: <>To get the right one, we’ll check your frame and fork’s setup.</>
        }
        , finalize: {
           upperText: <>Great! You’ve picked all the parts for your bike!</>,
        //    lowerText: <>Click the Finalize Build on the left sidebar to proceed to Summary Details. </>
        }
    };

    // Help content for different parts (frame, fork, groupset, etc.)
    const slideGroupsByPart = {
        frame: [
            {
                upperText: <><b>What kind of riding do you plan to do?</b></>,
                slides: [
                    <>For smooth and paved paths, choose a <b>Cross-country frame</b>. It’s light and easy to handle, perfect for long, flat rides.</>,
                    <>For trails with a mix of flat sections, hills, and some bumps, go for a <b>Trail</b> frame. It gives you more control and stability on uneven ground.</>,
                    <>If you’re riding on rough, bumpy trails with rocks and roots, pick an <b>Enduro</b> frame. It’s sturdy and can handle a lot of punishment.</>,
                    <>For steep downhill slopes and rough terrain, you’ll need a <b>Downhill</b> frame. Built for maximum control and safety on the way down.</>
                ]
            },
            {
                upperText: <><b>What’s your height?</b></>,
                slides: [
                    <>If you are under 5'4" (162 cm), a <b>26er</b> bike frame is suitable for you. It offers quick handling and is great for smaller riders.</>,
                    <>If you are between 5'4" and 5'9" (162 cm – 175 cm), a <b>27.5er</b> frame is a great balance, providing a mix of agility and stability for most riders.</>,
                    <>If you are 5'9" (175 cm) or taller, a <b>29er</b> frame is ideal. It rolls smoothly over bumps and is perfect for taller riders who need a larger bike.</>
                ]
            }
        ],
        fork: [
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame is a <b>{partSelected?.frame?.purpose}</b>, so the fork must have a fork travel between <b>{forkTravel}</b></>
                ]
            },
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame is a <b>{partSelected?.frame?.frame_size}</b>, so the fork must also be in <b>{partSelected?.frame?.frame_size}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame has a <b>{partSelected?.frame?.head_tube_type}</b> head tube, so it is recommended that the fork steerer tube must be <b>{partSelected?.frame?.head_tube_type}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame rear axle type is a <b>{partSelected?.frame?.axle_type}</b>, so it is recommended that the fork axle must be also <b>{partSelected?.frame?.axle_type}</b>.</>
                ]
            }
        ],
        groupset: [
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame’s bottom bracket is a <b>{partSelected?.frame?.bottom_bracket_type}</b>, so the groupset must have a <b>{partSelected?.frame?.bottom_bracket_type}</b> BB.</>
                ]
            },
            {
                upperText: <>Your chosen frame’s and fork’s specs:</>,
                slides: [
                    <>Your frame and fork’s rotor size is <b>{partSelected?.frame?.rotor_size}</b>, so the groupset must have <b>{partSelected?.frame?.rotor_size}</b> rotors.</>
                ]
            }
        ],
        wheelset: [
            {
                upperText: <>Your chosen groupset’s specs:</>,
                slides: [
                    <>Your groupset’s cassette is a <b>{partSelected?.groupset?.cassette_type}</b>, so the wheelset’s Rear Hub must be <b>{partSelected?.groupset?.cassette_type}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen groupset’s specs:</>,
                slides: [
                    <>Your groupset’s cassette speed is <b>{partSelected?.groupset?.cassette_speed}</b>, so the wheelset’s Rear Hub speed must be also <b>{partSelected?.groupset?.cassette_speed}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen frame and fork’s specs:</>,
                slides: [
                    <>Your frame and fork size is <b>{partSelected?.frame?.frame_size}</b>, so the wheelset’s tire size must be also <b>{partSelected?.frame?.frame_size}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame’s rear hub width is <b>{partSelected?.frame?.rear_hub_width}</b>, so the wheelset’s rear hub width must be also <b>{partSelected?.frame?.rear_hub_width}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen fork’s specs:</>,
                slides: [
                    <>Your fork’s front hub width is <b>{partSelected?.fork?.front_hub_width}</b>, so the wheelset’s front hub width must be also <b>{partSelected?.fork?.front_hub_width}</b>.</>
                ]
            }
        ],
        seat: [
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame’s seat post diameter is <b>{partSelected?.frame?.seatpost_diameter}</b>, so the seat’s seat post diameter must be also <b>{partSelected?.frame?.seatpost_diameter}</b>.</>
                ]
            }
        ],
        cockpit: [
            {
                upperText: <>Your chosen fork’s specs:</>,
                slides: [
                    <>Your fork tube upper diameter is <b>{partSelected?.fork?.fork_tube_upper_diameter}</b>, so the cockpit’s stem to fork diameter must be <b>{partSelected?.fork?.fork_tube_upper_diameter}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame has a <b>{partSelected?.frame?.head_tube_type}</b> head tube, so it is recommended that the headset type must be <b>{partSelected?.frame?.head_tube_type}</b>.</>
                ]
            },
            {
                upperText: <>Your chosen frame’s specs:</>,
                slides: [
                    <>Your frame’s headtube dimension is <b>{partSelected?.frame?.head_tube_upper_diameter}</b> and <b>{partSelected?.frame?.head_tube_lower_diameter}</b>, so it is recommended that the headset dimensions must be <b>{partSelected?.frame?.head_tube_upper_diameter}</b> and <b>{partSelected?.frame?.head_tube_lower_diameter}</b> as well.</>
                ]
            }
        ]
    };


    const currentGroup = slideGroupsByPart[currentPart]?.[currentSlideGroup]; // Current group of slides for the current part
    const initialMessage = initialMessagesByPart[currentPart] || {}; // Get initial message for the current part

    // Reset the view when the current part changes
    useEffect(() => {
        setShowHelp(false); // Reset to the initial message
        setCurrentSlide(0); // Reset the slide index
        setCurrentSlideGroup(0); // Reset to the first group
    }, [currentPart]); // This will run every time the `currentPart` changes

    // Handler for toggling help view
    const handleNotSureClick = () => {
        setShowHelp(true); // Switch to the slide view
    };

    // Handler for going back to the main content
    const handleBackClick = () => {
        if (currentSlideGroup > 0) {
            setCurrentSlideGroup(currentSlideGroup - 1); // Move to the previous group
            setCurrentSlide(0); // Reset to the first slide of the previous group
        } else {
            setShowHelp(false); // Go back to the main content
            setCurrentSlide(0);
            setCurrentSlideGroup(0);
        }
    };

    // Handler for navigating to the next slide within the current group (using the arrow)
    const handleNextSlide = () => {
        if (currentGroup && currentSlide < currentGroup.slides.length - 1) {
            setCurrentSlide(currentSlide + 1); // Navigate to the next slide within the current group
        }
    };

    // Handler for navigating to the previous slide within the current group (using the arrow)
    const handlePreviousSlide = () => {
        if (currentGroup && currentSlide > 0) {
            setCurrentSlide(currentSlide - 1); // Navigate to the previous slide within the current group
        }
    };

    // Fix to ensure proper group progression and check
    const handleNextGroup = () => {
        const slideGroups = slideGroupsByPart[currentPart];
        if (slideGroups && slideGroups.length > 1 && currentSlideGroup < slideGroups.length - 1) {
            setCurrentSlideGroup(currentSlideGroup + 1); // Move to the next slide group
            setCurrentSlide(0); // Reset to the first slide of the next group
        } else if (slideGroups?.length === 1) {
            // If there is only one group, switch to the help view
            setShowHelp(true);
        } else {
            console.log("No more slide groups for this part.");
        }
    };


    return (
        <div className="message-container">
            <div className="content">
                {!showHelp ? (
                    <>
                        {/* Initial message for each part */}
                        <div className="upper-text">
                            <div className='text'>
                                {initialMessage.upperText} {/* Static upper text */}
                            </div>
                        </div>

                        <div className="lower-text d-flex">
                            <div className="text-slide">
                                <span>{initialMessage.lowerText}</span> {/* Static lower text */}
                            </div>
                        </div>

                        {/* Button text conditionally changes based on the current part */}
                        {currentPart !== "finalize" && (
                            <div className='btn-container-2'>
                                <button onClick={handleNotSureClick}>
                                    {currentPart === "frame" ? "Not sure what frame to pick?" : "Next"}
                                </button>
                            </div>
                        )}

                    </>
                ) : (
                    <>
                        {/* Upper text for the current group */}
                        <div className="upper-text">
                            <div className='text'>
                                {currentGroup?.upperText || "No information available"} {/* Static upper text for each group */}
                            </div>
                        </div>

                        <div className="lower-text">
                            {/* Left arrow button */}
                            {currentGroup && currentGroup.slides.length > 1 && (
                                <button
                                    className="back-slide p-0"
                                    onClick={handlePreviousSlide}
                                    disabled={currentSlide === 0}
                                    style={{ opacity: currentSlide === 0 ? 0.2 : 1 }} // Decrease opacity on the first slide
                                >
                                    <img src={leftarrow} alt="left-arrow" />
                                </button>
                            )}

                            {/* Slide text */}
                            <div className="text-slide">
                                <span>{currentGroup?.slides[currentSlide] || "No details available"} </span>{/* Only the lower text changes */}
                            </div>

                            {/* Right arrow button */}
                            {currentGroup && currentGroup.slides.length > 1 && (
                                <button
                                    className="proceed-slide p-0"
                                    onClick={handleNextSlide}
                                    disabled={currentSlide === currentGroup?.slides.length - 1}
                                    style={{ opacity: currentSlide === currentGroup?.slides.length - 1 ? 0.2 : 1 }} // Decrease opacity on the last slide
                                >
                                    <img src={rightarrow} alt="right-arrow" />
                                </button>
                            )}
                        </div>


                        <div className='btn-container'>
                            {/* Back button */}
                            <button onClick={handleBackClick}>
                                Back
                            </button>

                            {/* Next button to move to the next slide group */}
                            {currentPart !== "finalize" && currentGroup && currentSlideGroup < slideGroupsByPart[currentPart].length - 1 && (
                                <button onClick={handleNextGroup}>
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageContainer;
