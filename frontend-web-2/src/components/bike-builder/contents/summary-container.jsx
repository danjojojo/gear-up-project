import React, { useRef } from 'react';
import backbutton from "../../../assets/icons/back-button.png";
import {
    addToBBCart
} from "../../../utils/cartDB";
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';

const BuildSummary = ({ selectedParts, buildStatsPrice, finalBuildImage, goBackToBuild, handleReset, setIsBuildFinalized }) => {
    const navigate = useNavigate();
    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

     const summaryRef = useRef(null);

     const handleCreateNewBuild = () => {
        // const currentUrl = new URL(window.location.href);
        // const baseUrl = `${currentUrl.origin}${currentUrl.pathname}`;
        handleReset();
        setIsBuildFinalized(false);
        navigate('/bike-builder');
        // window.history.pushState({}, '', baseUrl); // Reset URL to remove query params
    };

    // let build_id = 'build-' + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
    // make build_id unique using MM-DD-YYYY
    let build_id = 'BUILD-' + (new Date().getMonth() + 1) + new Date().getDate() + new Date().getFullYear() + '-' + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
    const finalBuild = {image: finalBuildImage, build_id: build_id, build_price : buildStatsPrice, parts : selectedParts };

    const handleAddBuild = async (build) => {
        const success = await addToBBCart(build);
        if (success) {
            console.log("Build added successfully!");
        } else {
            console.log("Build was not added due to duplication.");
        }
    };

    const handleExportImage = async () => {
        if (summaryRef.current) {
            try {
                // summaryRef.current.style.display = 'block';

                const dataUrl = await toPng(summaryRef.current, { cacheBust: true });

                // Revert visibility after rendering
                // summaryRef.current.style.display = 'none';

                const link = document.createElement('a');
                link.href = dataUrl;
                // link.download = 'build-summary.png';
                link.download = build_id + '.png';
                link.click();
            } catch (error) {
                console.error('Error generating image:', error);
            }
        }
    };

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
                            <p>{PesoFormat.format(buildStatsPrice)}</p>
                            <button
                                className='export-button'
                                onClick={handleExportImage}
                            ><i className="fa-solid fa-file-arrow-down"></i></button>
                        </div>
                    </div>
                    <div className='right-container'>
                        <div className="back-button" onClick={goBackToBuild}>
                            <img src={backbutton} alt="back-button" />
                        </div>
                        <div className="btns">
                            <button className='add-to-cart' onClick={() => handleAddBuild(finalBuild)}>
                                Add to Cart
                            </button>
                            <button className='new-build' onClick={handleCreateNewBuild}>
                                Create New Build
                            </button>
                        </div>
                        {/* 
                        <button type="button" onClick={() => handleCreateNewBuild()}>
                            Add to cart
                        </button>
                        
                        */}
                    </div>
                </div>
            </div>
            <div ref={summaryRef} className='summary-content-invisible'>
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
                            <p>{PesoFormat.format(buildStatsPrice)}</p>
                        </div>
                    </div>
                    <div className='right-container'>
                        <div className="back-button" onClick={goBackToBuild}>
                            <img src={backbutton} alt="back-button" />
                        </div>
                        <div className="btns">
                            {/* <h4>GEARUP</h4> */}
                            <span>made in <h4>GEARUP</h4></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildSummary;