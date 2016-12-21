"use strict";
import { numberWithCommas } from "../../../utils/numberOps";
import React from "react";

/** Defines the info specified in the props for a game */
class GameInfo extends React.Component {
    render() {
        return(
            <div className="game-info-container">
                <p className="game-name">{ this.props.name }</p>
                <p className="game-viewers">{ `${ numberWithCommas(this.props.viewers) } viewers` }</p>
            </div>
        );
    }
}

GameInfo.PropTypes = {
    name: React.PropTypes.string,
    viewers: React.PropTypes.number
};

export default GameInfo;