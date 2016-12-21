"use strict";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines the image specified in the props for a stream other than the main stream */
class NonMainStreamPreview extends React.Component {
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
                query: { channelName: this.props.channelName }
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
        document.getElementById(target).setAttribute("src", __dirname + "../../../../assets/images/streams_placeholder.png");
    }

    render() {
        let imgTypeClassName, containerTypeClassName = "";
        this.props.type === "featured" ? imgTypeClassName = "non-main-image" : imgTypeClassName = "live-stream-image";
        this.props.type === "featured" ? containerTypeClassName = "non-main-image-container" : containerTypeClassName = "live-stream-image-container";

        return(
            <div className={ containerTypeClassName } onClick={ this.handleLinkToChannel }>
                <img className={ imgTypeClassName } id={ this.props.channelName } src={ this.props.image } onError={ this.replaceMissingImage } />
            </div>
        );
    }
}

NonMainStreamPreview.propTypes = {
    channelName: React.PropTypes.string,
    image: React.PropTypes.string,
    type: React.PropTypes.string,
};

export default NonMainStreamPreview;