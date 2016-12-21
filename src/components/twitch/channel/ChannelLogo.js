"use strict";
import { checkLogo } from "../../../utils/twitchDataChecks";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines a channel logo image */
class ChannelLogo extends React.Component {
    constructor(props) {
        super(props);

        this.handleLinkToChannel = this.handleLinkToChannel.bind(this);
        this.replaceMissingImage = this.replaceMissingImage.bind(this);
    }

    /** Checks if a user is online based on value in the store. If so, links user to specified channel received from props.
     * Otherwise, requests that an error be shown in the snackbar */
    handleLinkToChannel() {
        if(this.props.store.isOnline) {
            if(this.props.type === "navLogo") {
                return;
            } else {
                let channelLinkObject = {
                    pathname: "/main/channelPage",
                    query: { channelName: this.props.channelName }
                };

                this.props.history.push(channelLinkObject);
            }
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
        document.getElementById(target).setAttribute("src", __dirname + "../../../../assets/images/channel_placeholder_404.png");
    }

    render() {
        let logoImageContainerClassName, logoImageClassName = null;
        this.props.type === "navLogo" ? logoImageContainerClassName = "channel-logo-container" : logoImageContainerClassName = "channel-logo-image-container";
        this.props.type === "navLogo" ? logoImageClassName = "" : logoImageClassName = "channel-logo-image";
        return(
            <div className={ logoImageContainerClassName } id={ this.props.channelName } onClick={ this.handleLinkToChannel }>
                <img className={ logoImageClassName }
                     id={ this.props.channelName }
                     src={ checkLogo(this.props.image) }
                     onError={ this.replaceMissingImage }
                />
            </div>
        );
    }
}

ChannelLogo.PropTypes = {
    image: React.PropTypes.string,
    channelName: React.PropTypes.string,
};

export default ChannelLogo;