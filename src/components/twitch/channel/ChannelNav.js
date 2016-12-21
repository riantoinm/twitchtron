"use strict";
import * as constants from "../../../utils/globals";
import { observer } from "mobx-react";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines the sub navigation buttons that are used in the container  */
@observer
class ChannelNav extends React.Component {
    render() {
        let onClickEvent = null;
        let errorActionObj = new ErrorActions();

        this.props.store.isOnline ? onClickEvent =  this.props.loadChannelContent : onClickEvent = errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        return(
            <div id="channel-nav-container" className="sub-nav-container">
                <div id="channel-nav" className="sub-nav">
                    <button className={`button channel-nav-button ${ this.props.activeTab === "channelHome" ? "active" : null }`}
                            id={ constants.CHANNEL_PAGE }
                            onClick={ onClickEvent }>{ this.props.channelName }</button>
                    <button className={`button channel-nav-button ${ this.props.activeTab === "following" ? "active" : null }`}
                            id={ constants.CHANNEL_FOLLOWING }
                            onClick={ onClickEvent }>Following</button>
                    <button className={`button channel-nav-button ${ this.props.activeTab === "followers" ? "active" : null }`}
                            id={ constants.CHANNEL_FOLLOWERS }
                            onClick={ onClickEvent }>Followers</button>
                    <button className={`button channel-nav-button ${ this.props.activeTab === "videos" ? "active" : null }`}
                            id={ constants.CHANNEL_VIDEOS }
                            onClick={ onClickEvent }>Videos</button>
                </div>
            </div>
        );
    }
}

export default ChannelNav;