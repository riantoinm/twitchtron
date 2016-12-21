"use strict";
import { observer } from "mobx-react";
import StreamPlaybackActions from "../../actions/streamPlaybackActions";
import React from "react";

const shell = require("electron").shell;

/** Defines the settings for browsing for and storing directory of streamlink on a user's system */
@observer
class SettingsStreamlink extends React.Component {
    constructor(props) {
        super(props);

        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        const streamlinkLink = document.getElementById("streamlink-ext-link");
        const vlcLink = document.getElementById("vlc-ext-link");

        streamlinkLink.addEventListener("click", function (event) {
            shell.openExternal("http://streamlink.github.io/");
        });

        vlcLink.addEventListener("click", function (event) {
            shell.openExternal("http://www.videolan.org/vlc/index.html");
        });
    }

    /** Sends a request to Stream Playback Actions to open a system dialog for selecting directory of streamlink */
    handleBtnClick() {
        let streamPlaybackActionObj = new StreamPlaybackActions();
        streamPlaybackActionObj.selectStreamlinkLocation(this.props.store);
    }

    /** Sends a request to Stream Playback Actions to store the value of the event's input in the app's store */
    handleInputChange(event) {
        let streamPlaybackActionObj = new StreamPlaybackActions();
        streamPlaybackActionObj.setStreamlinkLocation(event.target.value, this.props.store);
    }

    render() {
        return(
            <div id="settings-section-container" className="section-container-inner container-with-nav content-container">
                <div id="streamlink-setting">
                    <div className="setting-text">
                        <h4 className="setting-title">Directory of Streamlink installation</h4>
                        <div className="setting-label">Select the location where Streamlink is installed on your system.</div>
                        <div className="setting-subtext">If left blank, Twitchtron will look in <strong>PATH</strong></div>
                    </div>
                    <div id="input-streamlink-directory" className="setting-inputs">
                        <div id="streamlink-input-button-wrapper">
                            <input type="text"
                                   value={ this.props.store.streamlinkLocation }
                                   placeholder="location of Streamlink executable"
                                   onChange={ this.handleInputChange }
                            />
                            <button id="streamlink-browse-button" className="button" onClick={ this.handleBtnClick }><i className="material-icons">search</i></button>
                        </div>
                        <div className="input-subtext">changes saved automatically</div>
                    </div>
                    <br />
                    <div id="streamlink-settings-ext-links-container">
                        <div>
                            <i className="material-icons">help_outline</i>
                            <p id="streamlink-settings-link-info">Twitchtron uses Streamlink to connect with VLC Media Player. Make sure you have both installed on your system.</p>
                        </div>
                        <p id="streamlink-vlc-links"><a href="#" id="streamlink-ext-link">Get Streamlink here</a> and <a href="#" id="vlc-ext-link">get VLC here</a>!</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsStreamlink;