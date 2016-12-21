"use strict";
import { observer } from "mobx-react";
import PipControlChip from "./PipControlChip";
import React from "react";
import StreamPlaybackActions from "../../actions/streamPlaybackActions";
import WindowControls from "./WindowControls";

const ipc = require("electron").ipcRenderer;

/** Defines the container that wraps the window controls and interfaces with the app main process */
@observer
class WindowControlsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleWinClick = this.handleWinClick.bind(this);
        this.closePipBtnClick = this.closePipBtnClick.bind(this);
    }

    /**
     * Sends ipc message to main process for minimizing, maximizing, or closing the app window when onclick event fired
     * @param { Object } event
     */
    handleWinClick(event) {
        let target = event.currentTarget.id;

        ipc.send("window-control", target);
    }

    /**
     * Sends request to streamPlaybackActions to close the active PiP window
     */
    closePipBtnClick() {
        let streamPlaybackActionObj = new StreamPlaybackActions();

        streamPlaybackActionObj.closePipStream(this.props.store);
    }

    render() {
        return(
            <div id="win-controls-container">
                {
                    this.props.store.pipIsActive
                        ? <PipControlChip closePip={ this.closePipBtnClick } logo={ this.props.store.pipLogoUrl } channelDisplayName={ this.props.store.pipChannelName } isActive={ true } />
                        : <PipControlChip closePip={ this.closePipBtnClick } logo={ this.props.store.pipLogoUrl } channelDisplayName={ this.props.store.pipChannelName } isActive={ false } />
                }
                <WindowControls handleClick={ this.handleWinClick } store={ this.props.store }/>
            </div>
        );
    }
}

export default WindowControlsContainer;