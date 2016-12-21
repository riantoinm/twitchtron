"use strict";
import React from "react";

/** Defines the text that is displayed when the app encounters a general error during a network operation
 * for which the user needs to refresh */
class GeneralErrorComponent extends React.Component {
    render() {
        return(
            <div id="no-results-container">
                <h2 className="no-results-text">An error occurred while getting stream data. Please try again</h2>
            </div>
        );
    }
}

export default GeneralErrorComponent;