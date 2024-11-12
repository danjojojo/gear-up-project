import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './bike-builder-upgrader.scss';
import mountain from "../../assets/images/mountain.png";
import road from "../../assets/images/road.png";
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
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

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    const handlePartClick = (part) => {
        navigate(`${part}`);
    };


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

    if (loading) return <LoadingPage classStyle={"loading-in-page"} />

    return (
        <div className='bike-builder-upgrader p-3'>
            <ResponsivePageLayout
                rightContainer={rightContainerStyle}
                leftContent={
                    <div className='bike-builder-upgrader-container'>
                        <div
                            className='part-container'
                            onClick={() => handlePartClick('mountain-bike')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={mountain} alt='Mountain' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Mountain Bike</div>

                                </div>
                            </div>
                        </div>


                        <div
                            className='part-container'
                            onClick={() => handlePartClick('road-bike')}
                        >
                            <div className='content'>
                                <div className='image'>
                                    <img src={road} alt='Road' />
                                </div>
                                <div className='part-item-count'>
                                    <div className='part'>Road Bike</div>

                                </div>
                            </div>
                        </div>

                    </div>
                }
                rightContent={
                    <div className='description'>
                        Select bike type to view details
                    </div>
                }
            />
        </div>
    );
};

export default BikeBuilderUpgrader;
