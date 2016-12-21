"use strict";
import React from "react";

/** Defines the images used in the startup container's background */
class Images extends React.Component {
    render() {
        return(
            <div id="startup-images">
                <img src="./src/assets/images/Glitch_White_RGB.png" id="startup-twitch-logo"/>
                <i className="material-icons startup-icons" id="live-tv">live_tv</i>
                <i className="material-icons startup-icons" id="videocam">videocam</i>
            </div>
        );
    }
}

export default Images;