"use strict";
import React from "react";

/** Defines a wrapper used as the app's parent Route for the Startup component and Main component */
class WrapperContainer extends React.Component {
    render() {
        return(
            <div id="wrapper-container">
                { this.props.children }
            </div>
        );
    }
}

export default WrapperContainer;