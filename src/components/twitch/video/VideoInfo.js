"use strict";
import { formatDate } from "../../../utils/dateTimeOps";
import React from "react";

/** Defines the info specified in the props for a video */
class VideoInfo extends React.Component {
    render() {
        return(
            <div className="video-info-container">
                <p className="video-title">{ this.props.title }</p>
                <div className="video-date-username-container">
                    <p className="video-date">{ formatDate(this.props.recordedAt) }</p>
                    <p className="video-display-name">{ `by ${ this.props.displayName }` }</p>
                </div>
            </div>
        );
    }
}

VideoInfo.PropTypes = {
    recordedAt: React.PropTypes.string,
    title: React.PropTypes.string,
    displayName: React.PropTypes.string
};

export default VideoInfo;