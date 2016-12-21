"use strict";
import React from "react";

/** Defines the loader that displays when network requests are being made */
class LoadingComponent extends React.Component {

    render() {
        return(
            <div id="loader-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default LoadingComponent;