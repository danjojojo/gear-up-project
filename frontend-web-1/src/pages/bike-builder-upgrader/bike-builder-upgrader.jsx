import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './bike-builder-upgrader.scss';
import PageLayout from '../../components/page-layout/page-layout';
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import frame from "../../assets/images/frame.png";
import fork from "../../assets/images/fork.png";
import groupset from "../../assets/images/groupset.png";
import wheelset from "../../assets/images/wheelset.png";
import seat from "../../assets/images/seat.png";
import cockpit from "../../assets/images/cockpit.png";
import { getItemCount } from '../../services/bbuService';
import LoadingPage from '../../components/loading-page/loading-page';

const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};

const BikeBuilderUpgrader = () => {
    const navigate = useNavigate();
    const [partCounts, setPartCounts] = useState({
        frame: 0,
        fork: 0,
        groupset: 0,
        wheelset: 0,
        seat: 0,
        cockpit: 0,
    });
    const [loading, setLoading] = useState(true);
    

    const handlePartClick = (part) => {
        navigate(`parts/${part}`);
    };

    const fetchPartCounts = async () => {
        const counts = await Promise.all([
            getItemCount('frame'),
            getItemCount('fork'),
            getItemCount('groupset'),
            getItemCount('wheelset'),
            getItemCount('seat'),
            getItemCount('cockpit'),
        ]);

        setPartCounts({
            frame: counts[0].count,
            fork: counts[1].count,
            groupset: counts[2].count,
            wheelset: counts[3].count,
            seat: counts[4].count,
            cockpit: counts[5].count,
        });
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchPartCounts();
    }, []);

    const [isVisible, setIsVisible] = useState(true);
    const [rightContainerStyle, setRightContainerStyle] = useState("right-container");
    const [originalHeight, setOriginalHeight] = useState(window.innerHeight);

    const handleResize = () => {
        const isKeyboardOpen = window.innerHeight < originalHeight; // Check if keyboard is open
        if (!isKeyboardOpen) {
            if (window.innerWidth < 900) {
                setRightContainerStyle("right-container-close");
                setIsVisible(true);
            } else {
                setRightContainerStyle("right-container");
                setIsVisible(true);
            }
        }
    }

    useEffect(() => {
        handleResize();

        setOriginalHeight(window.innerHeight); // Store original height on mount
        const handleResizeDebounced = debounce(handleResize, 100);
        
        // Setup resize listener only if width is greater than 900
        const checkWindowSizeAndAddListener = () => {
            if (window.innerWidth > 900) {
                window.addEventListener("resize", handleResizeDebounced);
            }
        };

        checkWindowSizeAndAddListener(); // Check size and possibly add listener

        return () => {
            window.removeEventListener("resize", handleResizeDebounced);
        };
    }, []);

    if(loading) return <LoadingPage classStyle={"loading-in-page"}/>

    return (
        <div className='bike-builder-upgrader p-3'>
            <ResponsivePageLayout
                rightContainer={rightContainerStyle}
                leftContent={
                    <div className='bike-builder-upgrader-container'>
                        <div
                            className='part-container'
                            onClick={() => handlePartClick('frame')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={frame} alt='Frame' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Frame</div>
                                    <div className='item-count'>{partCounts.frame} items</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className='part-container'
                            onClick={() => handlePartClick('fork')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={fork} alt='Fork' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Fork</div>
                                    <div className='item-count'>{partCounts.fork} items</div>
                                </div>
                            </div>
                        </div>
                        
                        <div
                            className='part-container'
                            onClick={() => handlePartClick('groupset')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={groupset} alt='Groupset' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Groupset</div>
                                    <div className='item-count'>{partCounts.groupset} items</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className='part-container'
                            onClick={() => handlePartClick('wheelset')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={wheelset} alt='Wheelset' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Wheelset</div>
                                    <div className='item-count'>{partCounts.wheelset} items</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className='part-container'
                            onClick={() => handlePartClick('seat')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={seat} alt='Seat' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Seat</div>
                                    <div className='item-count'>{partCounts.seat} items</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className='part-container'
                            onClick={() => handlePartClick('cockpit')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={cockpit} alt='Cockpit' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Cockpit</div>
                                    <div className='item-count'>{partCounts.cockpit} items</div>
                                </div>
                            </div>
                        </div>


                        {/* <div className='upper-container d-flex'>
                            <div
                                className='frame-container'
                                onClick={() => handlePartClick('frame')}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img src={frame} alt='Frame' />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Frame</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.frame} items</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='fork-container'
                                onClick={() => handlePartClick('fork')}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img src={fork} alt='Fork' />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Fork</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.fork} items</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='middle-container d-flex'>
                            <div
                                className='groupset-container'
                                onClick={() => handlePartClick('groupset')}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img src={groupset} alt='Groupset' />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Groupset</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.groupset} items</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='wheelset-container'
                                onClick={() => handlePartClick('wheelset')}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img src={wheelset} alt='Wheelset' />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Wheelset</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.wheelset} items</div>
                                    </div>
                                </div>
                            </div>



                        </div>

                        <div className='lower-container d-flex'>
                            <div
                                className='seat-container'
                                onClick={() => handlePartClick('seat')}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img src={seat} alt='Seat' />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Seat</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.seat} items</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='cockpit-container'
                                onClick={() => handlePartClick('cockpit')}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img src={cockpit} alt='Cockpit' />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Cockpit</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.cockpit} items</div>
                                    </div>
                                </div>
                            </div>


                        </div> */}
                    </div>
                }
                rightContent={
                    <div className='description'>
                        Select parts to view details
                    </div>
                }
            />
        </div>
    );
};

export default BikeBuilderUpgrader;
