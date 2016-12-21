"use strict";
import React from "react";

/** Defines the hexagonal shapes used on the startup container's background */
class Hexagons extends React.Component {
    render() {
        return(
            <div id="hexagons">
                <div id="top-center-outer"></div>
                <div id="top-left-outer"></div>
                <div id="top-left-inner"></div>
                <div id="top-right-outer"></div>
                <div id="top-right-inner"></div>
                <div id="bottom-center-outer"></div>
                <div id="bottom-center-inner"></div>
                <div id="bottom-left-outer"></div>
            </div>
        );
    }
}

export default Hexagons;