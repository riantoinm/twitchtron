"use strict";
import React from "react";

/** Defines the loader that is shown in the nav while authenticated user data is being fetched */
class NavLoadingComponent extends React.Component {
    render() {
        return(
            <div id="offset-loader-container">
                <div className="offset-loader"></div>
            </div>
        );
    }
}

export default NavLoadingComponent;