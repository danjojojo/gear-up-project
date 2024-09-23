import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './bike-builder-upgrader.scss';
import PageLayout from '../../components/page-layout/page-layout';
import frame from "../../assets/images/frame.png";
import { getItemCount } from '../../services/bbuService';

const BikeBuilderUpgrader = () => {
    const navigate = useNavigate();
    const [partCounts, setPartCounts] = useState({
        frame: 0,
        fork: 0,
        groupset: 0,
        wheelset: 0,
        cockpit: 0
        // headset: 0,
        // handlebar: 0,
        // stem: 0,
        // hubs: 0,
    });

    const handlePartClick = (part) => {
        navigate(`parts/${part}`);
    };

    const fetchPartCounts = async () => {
        const counts = await Promise.all([
            getItemCount('frame'),
            getItemCount('fork'),
            getItemCount('groupset'),
            getItemCount('wheelset'),
            getItemCount('cockpit')
            // getItemCount('headset'),
            // getItemCount('handlebar'),
            // getItemCount('stem'),
            // getItemCount('hubs'),
        ]);

        setPartCounts({
            frame: counts[0].count,
            fork: counts[1].count,
            groupset: counts[2].count,
            wheelset: counts[3].count,
            cockpit: counts[4].count
            // headset: counts[5].count,
            // handlebar: counts[6].count,
            // stem: counts[7].count,
            // hubs: counts[8].count,
        });
    };

    useEffect(() => {
        fetchPartCounts();
    }, []);

    return (
        <div className='bike-builder-upgrader p-3'>
            <PageLayout
                leftContent={
                    <div className='bike-builder-upgrader-container'>
                        <div className='upper-container d-flex'>
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
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Fork</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.fork} items</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='groupset-container'
                                onClick={() => handlePartClick('groupset')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Groupset</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.groupset} items</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='middle-container d-flex'>
                            <div
                                className='wheelset-container'
                                onClick={() => handlePartClick('wheelset')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Wheelset</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.wheelset} items</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='cockpit-container'
                                onClick={() => handlePartClick('cockpit')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Cockpit</div>
                                        <div className='item-count fw-light fs-7'>{partCounts.cockpit} items</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='headset-container'
                                onClick={() => handlePartClick('headset')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Headset</div>
                                        {/* <div className='item-count fw-light fs-7'>{partCounts.headset} items</div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='lower-container d-flex'>
                            <div
                                className='handlebar-container'
                                onClick={() => handlePartClick('handlebar')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Handlebar</div>
                                        {/* <div className='item-count fw-light fs-7'>{partCounts.handlebar} items</div> */}
                                    </div>
                                </div>
                            </div>

                            <div
                                className='stem-container'
                                onClick={() => handlePartClick('stem')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Stem</div>
                                        {/* <div className='item-count fw-light fs-7'>{partCounts.stem} items</div> */}
                                    </div>
                                </div>
                            </div>

                            <div
                                className='hubs-container'
                                onClick={() => handlePartClick('hubs')}
                            >
                                <div className='content'>
                                    <div className='image'></div>
                                    <div className='part-item-count'>
                                        <div className='part fs-6 fw-bold'>Hubs</div>
                                        {/* <div className='item-count fw-light fs-7'>{partCounts.hubs} items</div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
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
