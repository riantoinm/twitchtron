"use strict";
import * as constants from "../../../utils/globals";
import ErrorActions from "../../../actions/errorActions";
import React from "react";
import StreamPlaybackActions from "../../../actions/streamPlaybackActions";

/** Defines the buttons for selecting the source for stream playback */
class PlaybackSourceControls extends React.Component {
    constructor(props) {
        super(props);

        this.openInAppBtnClicked = this.openInAppBtnClicked.bind(this);
        this.openInPipBtnClicked = this.openInPipBtnClicked.bind(this);
        this.openInVlcBtnClicked = this.openInVlcBtnClicked.bind(this);
        this.toggleSourceDropdown = this.toggleSourceDropdown.bind(this);
    }

    componentDidMount() {
        window.onclick = function(event) {
            if(!event.target.matches(".dropbtn")) {
                let dropdowns = document.getElementsByClassName("dropdown-content");
                for(let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if(openDropdown.classList.contains("dropdown-show")) {
                        openDropdown.classList.remove("dropdown-show");
                    }
                }
            }
        };
    }

    /** Sends a request to Stream Playback Actions to open the stream of specified channel embedded in the app */
    openInAppBtnClicked() {
        if(this.props.store.isOnline) {
            let streamPlaybackActionObj = new StreamPlaybackActions();
            streamPlaybackActionObj.openStreamInApp(this.props.store);
        }
    }

    /** Sends a request to Stream Playback Actions to open the stream of specified channel in a PiP window */
    openInPipBtnClicked() {
        if(this.props.store.isOnline) {
            if(this.props.store.pipIsActive) {
                let errorActionObj = new ErrorActions();
                errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Only 1 stream may be opened using PIP at a time`);
            } else {
                let streamPlaybackActionObj = new StreamPlaybackActions();
                streamPlaybackActionObj.openStreamInPip(this.props.store, this.props.contentType, this.props.contentIdentifier, __dirname);
            }
        }
    }

    /** Sends a request to Stream Playback Actions to open the stream of specified channel in VLC media player */
    openInVlcBtnClicked(quality) {
        if(this.props.store.isOnline) {
            let streamPlaybackActionObj = new StreamPlaybackActions();
            streamPlaybackActionObj.openStreamInVlc(this.props.contentUrl, quality);
        }
    }

    /** Toggles the class of the specified button to show the dropdown menu */
    toggleSourceDropdown() {
        document.getElementById("vlc-source-dropdown").classList.toggle("dropdown-show");
    }

    render() {
        return(
            <div id="playback-source-controls-container">
                <button className="button general-button" id="play-in-app-btn" onClick={ this.openInAppBtnClicked }>Open in app</button>
                <button className="button general-button" id="play-in-pip-btn" onClick={ this.openInPipBtnClicked }>PiP</button>
                <div className="dropdown">
                    <button className="button dropbtn general-button" id="play-in-vlc-btn" onClick={ this.toggleSourceDropdown }>Open in VLC</button>
                    <div id="vlc-source-dropdown" className="dropdown-content">
                        <a href="#" onClick={ () => this.openInVlcBtnClicked(constants.STREAMLINK_QUALITY_HIGH) }>High</a>
                        <a href="#" onClick={ () => this.openInVlcBtnClicked(constants.STREAMLINK_QUALITY_MED) }>Medium</a>
                        <a href="#" onClick={ () => this.openInVlcBtnClicked(constants.STREAMLINK_QUALITY_LOW) }>Low</a>
                        <a href="#" onClick={ () => this.openInVlcBtnClicked(constants.STREAMLINK_QUALITY_AUDIO) }>Audio</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default PlaybackSourceControls;