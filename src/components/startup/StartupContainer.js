"use strict";
import { Link } from "react-router";
import { observer } from "mobx-react";
import Hexagons from "./Hexagons";
import Images from "./Images";
import Login from "./Login";
import React from "react";

const ipc = require("electron").ipcRenderer;

/** Defines the container which acts as the entrypoint for the application, allowing a user to login or enter as a guest */
@observer
class StartupContainer extends React.Component {
    constructor(props) {
        super(props);

        this.startLoginFlow = this.startLoginFlow.bind(this);
        this.showSnackbar = this.showSnackbar.bind(this);
    }

    componentWillUnmount() {
        this.hideAppWindow();
    }

    /** Sends message to main process to hide, then center and resize window to default size */
    hideAppWindow() {
        ipc.send("hide-window");
    }

    /** Updates the store to indicate that user has clicked on the login button, or requests that an error message be
     * shown in the snackbar if user is offline */
    startLoginFlow() {
        navigator.onLine ?  this.props.route.store.loginModalShown = true : this.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Please check your connection`);
    }

    /**
     * Shows specified message in the snackbar
     * @param { string } message
     */
    showSnackbar(message) {
        let snackbarTarget = document.querySelector("#startup-snackbar");
        snackbarTarget.innerHTML = message;
        snackbarTarget.className = "show-snackbar";
        setTimeout(function() {
            snackbarTarget.className = snackbarTarget.className.replace("show-snackbar", "");
        }, 4000);
    }

    render() {
        return(
            <div id="startup-container" className="">
                { this.props.route.store.loginModalShown ? <Login store={ this.props.route.store } history={ this.props.route.history } /> : null }
                <h1 className="startup-text" id="startup-app-name">Twitchtron</h1>
                <h4 className="startup-text" id="startup-subtext">Twitch on your desktop!</h4>
                <div id="startup-button-container">
                    <button className="button startup-button" onClick={ this.startLoginFlow }>Log In</button>
                    <Link to="/main" className="button startup-button">Guest</Link>
                </div>
                <h4 className="startup-text" id="startup-meta-text">Log in to your Twitch account to access more features!</h4>
                <div id="startup-snackbar"></div>
                <Hexagons />
                <Images />
                <div id="bits-triangle"></div>
            </div>
        );
    }
}

export default StartupContainer;
