"use strict";
import * as constants from "../../utils/globals";
import NavLoadingComponent from "../nav/NavLoadingComponent";
import React from "react";

/** Defines the webview used for allowing users to authenticate through OAth */
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { webviewIsLoading: true };

        this.eventListenerDidStartLoading = this.eventListenerDidStartLoading.bind(this);
        this.eventListenerDidStopLoading = this.eventListenerDidStopLoading.bind(this);
        this.eventListenerRedirectRequest = this.eventListenerRedirectRequest.bind(this);
        this.checkForAccessToken = this.checkForAccessToken.bind(this);
    }

    componentDidMount() {
        let loginWebview = document.querySelector("#login-webview");

        loginWebview.addEventListener("did-start-loading", this.eventListenerDidStartLoading);

        loginWebview.addEventListener("did-stop-loading", this.eventListenerDidStopLoading);

        loginWebview.addEventListener("did-get-redirect-request", this.eventListenerRedirectRequest);
    }

    componentWillUnmount() {
        let loginWebview = document.querySelector("#login-webview");

        loginWebview.removeEventListener("did-start-loading", this.eventListenerDidStartLoading);

        loginWebview.removeEventListener("did-stop-loading", this.eventListenerDidStopLoading);

        loginWebview.removeEventListener("did-get-redirect-request", this.eventListenerRedirectRequest);
    }

    /** Sets state to show that webview has started loading data */
    eventListenerDidStartLoading() {
        this.setState({ webviewIsLoading: true });
    }

    /** Sets state to show that webview has finished loading data */
    eventListenerDidStopLoading() {
        this.setState({ webviewIsLoading: false });
    }

    /** Called after a redirect request is fired in the webview. Checks whether user has authenticated and authorized
     * the app and updates the store accordingly */
    eventListenerRedirectRequest(event) {
        let accessToken = this.checkForAccessToken(event.newURL);
        if(accessToken === -1) {
            this.props.store.loginModalShown = false;
        } else if( accessToken != 0) {
            this.props.store.userAccessToken = accessToken;
            this.props.store.userIsAuthorized = true;
            this.props.store.userIsAuthenticated = true;
            this.props.history.push("/main");
        }
    }

    /**
     * Parses the target url for an access token. Returns the access token, -1 if user has denied authorization, and 0 otherwise
     * @param { string } targetUrl
     */
    checkForAccessToken(targetUrl) {
        if(targetUrl.slice(0, 32) === constants.ACCESS_TOKEN_URI) {
            let urlSplit = targetUrl.split("&");
            return(urlSplit[0].slice(32));
        } else if(targetUrl === constants.ACCESS_DENIED_URI) {
            return -1;
        } else {
            return 0;
        }
    }

    render() {
        return(
            <div id="login-modal" className="modal">
                { this.state.webviewIsLoading ? <NavLoadingComponent /> : null }
                <div className="modal-content">
                    <webview id="login-webview" src={ constants.AUTH_URL } style={{ "width": "100%", "height": "100%" }}></webview>
                </div>
            </div>
        );
    }
}

export default Login;