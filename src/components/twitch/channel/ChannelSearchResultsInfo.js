"use strict";
import React from "react";

/** Defines the information shown in search results for channels */
class ChannelSearchResultsInfo extends React.Component {
    render() {
        return(
            <div className="non-main-info-container">
                <p className="non-main-display-name">{ this.props.displayName }</p>
            </div>
        );
    }
}

ChannelSearchResultsInfo.PropTypes = {
    displayName: React.PropTypes.string,
};

export default ChannelSearchResultsInfo;