"use strict";
import { formatTimeFromSeconds } from "../../../utils/dateTimeOps";
import { numberWithCommas } from "../../../utils/numberOps";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines the image specified in the props for a video */
class VideoPreview extends React.Component {
    constructor(props) {
        super(props);

        this.handleLinkToChannel = this.handleLinkToChannel.bind(this);
        this.replaceMissingImage = this.replaceMissingImage.bind(this);
    }

    /** Checks if a user is online based on value in the store. If so, links user to a specified channel name received
     * from props. Otherwise, requests that an error be shown in the snackbar */
    handleLinkToChannel() {
        if(this.props.store.isOnline) {
            let channelLinkObject = {
                pathname: "/main/channelPage",
                query: {
                    channelName: this.props.channelName,
                    videoId: this.props.videoId
                }
            };

            this.props.history.push(channelLinkObject);
        } else {
            let errorActionObj = new ErrorActions();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    /**
     * Replaces the image of the event's target with the image specified
     * @param { Object } event
     */
    replaceMissingImage(event) {
        let target = event.currentTarget.id;
        document.getElementById(target).setAttribute("src", __dirname + "../../../../assets/images/videos_placeholder.png");
    }

    render() {
        return(
            <div className="video-image-container" onClick={ this.handleLinkToChannel }>
                <div className="video-image-views-overlay">
                    <i className="material-icons video-views">visibility</i><p>{ numberWithCommas(this.props.views) }</p>
                </div>
                <div className="video-image-length-overlay">
                    <i className="material-icons video-length">schedule</i><p>{ formatTimeFromSeconds(this.props.videoLength) }</p>
                </div>
                <img className="video-image" src={ this.props.image } onError={ this.replaceMissingImage } />
            </div>
        );
    }
}

VideoPreview.PropTypes = {
    videoLength: React.PropTypes.string,
    videoId: React.PropTypes.string,
    views: React.PropTypes.number,
    image: React.PropTypes.string,
    channelName: React.PropTypes.string,
};

export default VideoPreview;