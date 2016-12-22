"use strict";
import { render } from "react-dom";
import "babel-polyfill";
import React from "react";

const ipc = require("electron").ipcRenderer;

/** Defines the markup of the PiP window */
class PipMarkup extends  React.Component {
    constructor(props) {
        super(props);
        this.state = { markup: <div></div> };
    }

    componentDidMount() {
        let self = this;
        ipc.on("pipInfoReceived", (event, data) => {
            self.setState(
                { markup: <iframe src={ `http://player.twitch.tv/?${ data.contentType }=${ data.contentIdentifier }` } frameBorder="0" height="180px" width="320px"
                                            scrolling="no" allowFullScreen="true"></iframe>
                });
        });

        ipc.on("pipCloseReceived", () => {
           self.setState({ markup: <div></div> });
        });
    }

    render() {
        return(this.state.markup);
    }
}

render(
    <PipMarkup />, document.getElementById("pip-container")
);