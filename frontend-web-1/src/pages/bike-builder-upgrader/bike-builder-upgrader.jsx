import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './bike-builder-upgrader.scss';
import PageLayout from '../../components/page-layout/page-layout';
import SearchBar from '../../components/search-bar/search-bar';
import filter from '../../assets/icons/filter.png';
import sort from '../../assets/icons/sort.png';

const BikeBuilderUpgrader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDetailView, setIsDetailView] = useState(false);
    const [selectedPart, setSelectedPart] = useState(''); // Default part

    // Handle navigation changes based on URL path
    useEffect(() => {
        const part = location.pathname.split('/')[2]; // Extract part type from URL
        if (part && ['frame', 'fork', 'groupset', 'wheelset', 'cockpit', 'headset', 'handlebar', 'stem', 'hubs'].includes(part)) {
            setSelectedPart(part);
            setIsDetailView(true);
        } else {
            // Default to grid view if path is invalid or part is not found
            setIsDetailView(false);
        }
    }, [location.pathname]);

    // Handle part click to navigate to the respective part type
    const handlePartClick = (part) => {
        setSelectedPart(part);
        navigate(`/bike-builder-upgrader/${part}`);
        setIsDetailView(true);
    };

    // Function to handle the "back" button
    const handleBackClick = () => {
        setIsDetailView(false);
        navigate('/bike-builder-upgrader');
    };

    // Grid view of the bike builder (with parts)
    const gridView = (
        <div className='bike-builder-upgrader-container'>
            <div className='upper-container d-flex'>
                <div className='frame-container' onClick={() => handlePartClick('frame')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Frame</div>
                    </div>
                </div>

                <div className='fork-container' onClick={() => handlePartClick('fork')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Fork</div>
                    </div>
                </div>

                <div className='groupset-container' onClick={() => handlePartClick('groupset')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Groupset</div>
                    </div>
                </div>
            </div>

            <div className='middle-container d-flex'>
                <div className='wheelset-container' onClick={() => handlePartClick('wheelset')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Wheelset</div>
                    </div>
                </div>

                <div className='cockpit-container' onClick={() => handlePartClick('cockpit')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Cockpit</div>
                    </div>
                </div>

                <div className='headset-container' onClick={() => handlePartClick('headset')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Headset</div>
                    </div>
                </div>
            </div>

            <div className='lower-container d-flex'>
                <div className='handlebar-container' onClick={() => handlePartClick('handlebar')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Handlebar</div>
                    </div>
                </div>

                <div className='stem-container' onClick={() => handlePartClick('stem')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Stem</div>
                    </div>
                </div>

                <div className='hubs-container' onClick={() => handlePartClick('hubs')}>
                    <div className='content'>
                        <div className='image'></div>
                        <div className='title'>Hubs</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Detail view for the selected part
    const detailView = (
        <div className='parts-content'>
            <div className='upper-container d-flex'>

                <div className='title'>
                    {selectedPart}
                </div>

                <button className='back-btn' onClick={handleBackClick}>
                    Back
                </button>

                <SearchBar />

                <button className='filter'>
                    <img src={filter} alt='Filter' className='button-icon' />
                </button>

                <button className='sort'>
                    <img src={sort} alt='Sort' className='button-icon' />
                </button>
            </div>

            <div className='lower-container'>
                {/* Display selected part details here */}
            </div>
        </div>
    );

    return (
        <div className='bike-builder-upgrader p-3'>
            <PageLayout
                leftContent={isDetailView ? detailView : gridView}
                rightContent={<div>{/* You can add content for the right side here */}</div>}
            />
        </div>
    );
};

export default BikeBuilderUpgrader;