"use strict";
import React from "react";

/** Defines the text that should be displayed to the user when a dataset is empty or null */
class NoResults extends React.Component {
    render() {
        return(
            <div id="no-results-container">
                <h2 className="no-results-text">{ this.props.message }</h2>
            </div>
        );
    }
}

NoResults.propTypes = {
    message: React.PropTypes.string
};

export default NoResults;