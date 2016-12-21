"use strict";
import React from "react";

/** Defines the css chip that allows the user to close an active PiP window */
class PipControlChip extends React.Component {
    render() {
        let chipStyle = "";
        this.props.isActive ? chipStyle = { "visibility" : "visible" } : chipStyle = { "visibility" : "hidden" };

        return(
            <div className="chip-no-drag-region">
                <div className="chip" style={ chipStyle }>
                    <img id={ this.props.channelDisplayName } src={ this.props.logo } width="96" height="96" />
                    <span className="pip-text">{ this.props.channelDisplayName }</span>
                    <span className="close-btn" onClick={ this.props.closePip }>&times;</span>
                </div>
            </div>
        );
    }
}

export default PipControlChip;