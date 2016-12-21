"use strict";
import { observer } from "mobx-react";
import React from "react";

/** Defines the buttons that are used to control window minimize, maximize, unmaximize, and close states */
@observer
class WindowControls extends React.Component {
    render() {
        return(
            <div id="window-controls">
                <button type="button" className="button win-ctrl-btn" id="min-btn" onClick={ this.props.handleClick }>
                    <i className="material-icons">remove</i>
                </button>
                <button type="button" className="button win-ctrl-btn" id="max-btn" onClick={ this.props.handleClick }>
                    {
                        this.props.store.windowIsMax
                        ? <i className="material-icons">fullscreen_exit</i>
                        : <i className="material-icons">fullscreen</i>
                    }
                </button>
                <button type="button" className="button win-ctrl-btn" id="close-btn" onClick={ this.props.handleClick }>
                    <i className="material-icons">close</i>
                </button>
            </div>
        );
    }
}

WindowControls.PropTypes = {
    store: React.PropTypes.object
};

export default WindowControls;