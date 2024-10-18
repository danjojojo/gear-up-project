import "./bike-upgrader.scss"
import { useNavigate } from 'react-router-dom';
import React from "react";
import headset from "../../assets/images/headset.png";
import handlebar from "../../assets/images/handlebar.png";
import stem from "../../assets/images/stem.png";
import hub from "../../assets/images/hub.png";

const BikeUpgrader = () => {
    const navigate = useNavigate();

    return (
        <div className="bike-upgrader">

            <div className="upgrader-container">

                <div className="parts-container">

                    <div className="title">
                        What bike part are you planning to upgrade?
                    </div>

                    <div className="parts-content">
                        <div className="parts" onClick={() => navigate('/bike-upgrader/headset')}>
                            <div className="image">
                                <img src={headset} alt="Headset" />
                            </div>
                            <div className="title">
                                Headset
                            </div>
                        </div>

                        <div className="parts">
                            <div className="image">
                                <img src={handlebar} alt='bandlebar' />
                            </div>
                            <div className="title">
                                Handlebar
                            </div>
                        </div>

                        <div className="parts">
                            <div className="image">
                                <img src={stem} alt='Stem' />
                            </div>
                            <div className="title">
                                Stem
                            </div>
                        </div>

                        <div className="parts">
                            <div className="image">
                                <img src={hub} alt='Hub' />
                            </div>
                            <div className="title">
                                Hubs
                            </div>
                        </div>
                    </div>



                </div>

            </div>

        </div>
    );

};

export default BikeUpgrader;