import React from 'react';
import backbutton from "../../../assets/icons/back-button.png";

const BuildSummary = ({ selectedParts, buildStatsPrice, finalBuildImage, goBackToBuild }) => {

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    return (
        <div className='build-summary-container'>
            <div className='summary-content'>
                <div className='upper-container'>
                    <div className='left-container'>
                        <div className='content'>
                            {finalBuildImage && <img src={finalBuildImage} alt="Final Build" />}
                        </div>
                    </div>
                    <div className='right-container'>
                        <div className='title'>
                            Build Summary
                        </div>
                        <div className='content'>
                            <div className='parts'>
                                <div className='iprice'>
                                    Frame: {PesoFormat.format(selectedParts.frame?.item_price)}
                                </div>
                                <div className='iname'>
                                    {selectedParts.frame?.item_name}
                                </div>
                            </div>
                            <div className='parts'>
                                <div className='iprice'>
                                    Fork: {PesoFormat.format(selectedParts.fork?.item_price)}
                                </div>
                                <div className='iname'>
                                    {selectedParts.fork?.item_name}
                                </div>
                            </div>
                            <div className='parts'>
                                <div className='iprice'>
                                    Groupset: {PesoFormat.format(selectedParts.groupset?.item_price)}
                                </div>
                                <div className='iname'>
                                    {selectedParts.groupset?.item_name}
                                </div>
                            </div>
                            <div className='parts'>
                                <div className='iprice'>
                                    Wheelset: {PesoFormat.format(selectedParts.wheelset?.item_price)}
                                </div>
                                <div className='iname'>
                                    {selectedParts.wheelset?.item_name}
                                </div>
                            </div>
                            <div className='parts'>
                                <div className='iprice'>
                                    Seat: {PesoFormat.format(selectedParts.seat?.item_price)}
                                </div>
                                <div className='iname'>
                                    {selectedParts.seat?.item_name}
                                </div>
                            </div>
                            <div className='parts'>
                                <div className='iprice'>
                                    Cockpit: {PesoFormat.format(selectedParts.cockpit?.item_price)}
                                </div>
                                <div className='iname'>
                                    {selectedParts.cockpit?.item_name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='lower-container'>
                    <div className='left-container'>
                        <div className='title'>
                            Build Cost:
                        </div>
                        <div className='tprice'>
                            {PesoFormat.format(buildStatsPrice)}
                        </div>
                    </div>
                    <div className='right-container'>
                        <div className="back-button" onClick={goBackToBuild}>
                            <img src={backbutton} alt="back-button" />
                        </div>
                        <button className='add-to-cart'>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildSummary;