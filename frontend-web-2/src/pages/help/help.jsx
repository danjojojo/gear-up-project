import "./help.scss"
import React from "react";

const Help = () => {
    return (
        <div className="help">
            <div className="header">
                <h3>Assembly Guides</h3>
                <p>Having a hard time to put up your parts from our Bike Upgrader? Check our guides below to make your assembly smooth and stress-free.</p>
            </div>

            <div className="message">
                <i className="fa-solid fa-info"></i>
                <p>Make sure to follow the steps carefully on the guides provided below to make your installations come out in proper.</p>
            </div>

            <div className="guides">
                <div className="fork">
                    <h4>Fork Installation</h4>
                    <p>Learn how to install your MTB fork with this 19-minute detailed tutorial video from GMBN Tech.</p>
                    <a href="https://www.youtube.com/watch?v=P8N_oURJbDA" target="_blank" rel="noopener noreferrer">Watch the video &rarr;</a>
                </div>

                <div className="groupset">
                    <h4>Groupset Installation</h4>
                    <p>GMBN Tech's 25-minute comprehensive tutorial on how to install your groupset in your MTB.</p>
                    <a href="https://www.youtube.com/watch?v=vj344KNktKA" target="_blank" rel="noopener noreferrer">Watch the video &rarr;</a>
                </div>

                <div className="wheelset">
                    <h4>Wheelset Installation</h4>
                    <p>Learn how to install your MTB wheelset with this 9-minute detailed tutorial video from GMBN Tech.</p>
                    <a href="https://www.youtube.com/watch?v=8EPB6mT5Uio" target="_blank" rel="noopener noreferrer">Watch the video &rarr;</a>
                </div>

                <div className="seat">
                    <h4>Seat and Saddle Installation</h4>
                    <p>This 4-minute detailed tutorial video from GMBN Tech will make installing saddle and seat post easy.</p>
                    <a href="https://www.youtube.com/watch?v=VQMmfEWb8W8" target="_blank" rel="noopener noreferrer">Watch the video &rarr;</a>
                </div>

                <div className="cockpit">
                    <h4>Cockpit Setup</h4>
                    <p>Learn how to install your MTB cockpit with this 23-minute detailed tutorial video from GMBN Tech.</p>
                    <a href="https://www.youtube.com/watch?v=-6hRIEICiGg" target="_blank" rel="noopener noreferrer">Watch the video &rarr;</a>
                </div>

                <p>All guides and tutorials belong to GMBN Tech.</p>
            </div>
        </div>
    );

};

export default Help;