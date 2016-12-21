"use strict";
import { observer } from "mobx-react";
import ErrorActions from "../../actions/errorActions";
import NavContainer from "../nav/NavContainer";
import React from "react";
import StreamActions from "../../actions/streamActions";
import WindowControlsContainer from "../common/WindowControlsContainer";

const ipc = require("electron").ipcRenderer;

/** Defines the parent component that wraps the app's other main components and acts as the point of entrance after a user
 * authenticates or logs as a guest */
@observer
class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liveChannelsCountUpdateInterval: null };

        this.localStorageChecks = this.localStorageChecks.bind(this);
        this.setupGetLiveChannelsCountInterval = this.setupGetLiveChannelsCountInterval.bind(this);
        this.registerWindowMaxUnmaxListener = this.registerWindowMaxUnmaxListener.bind(this);
        this.onlineStatusListenerChange = this.onlineStatusListenerChange.bind(this);

    }

    componentDidMount() {
        this.showWindow();
        this.localStorageChecks();
        this.registerWindowMaxUnmaxListener();
        this.props.route.store.userIsAuthenticated ? this.setupGetLiveChannelsCountInterval() : null;

        window.addEventListener("online", this.onlineStatusListenerChange);
        window.addEventListener("offline", this.onlineStatusListenerChange);

    }

    componentWillReceiveProps(nextProps) {
        nextProps.location.pathname === "/main" ? this.props.route.store.canGoBack = false : this.props.route.store.canGoBack = true;
    }

    componentWillUnmount() {
        this.props.route.store.userIsAuthenticated ? clearInterval(this.state.liveChannelsCountUpdateInterval) : null;
    }

    /** Sends message to main process to show app window after is has been hidden during startup */
    showWindow() {
        ipc.send("show-window");
    }

    /** Checks whether the user's persistent local storage holds a key for the Streamlink installation directory. Creates
     * the key if it doesn't exist, otherwise gets the value and stores it in the app's store */
    localStorageChecks() {
        if(localStorage.streamlinkLocation) {
            this.props.route.store.streamlinkLocation = localStorage.streamlinkLocation;
        } else {
            localStorage.streamlinkLocation = "";
            this.props.route.store.streamlinkLocation = localStorage.streamlinkLocation;
        }
    }

    /** Sets an interval for fetching updates to the count of live channels that the authenticated user is following */
    setupGetLiveChannelsCountInterval() {
        let streamActionObj = new StreamActions();
        let self = this;
        let tempInterval = setInterval(() => {
            streamActionObj.updateLiveChannelsFollowingCount(self.props.route.store);
        }, 120000);

        this.setState({ liveChannelsCountUpdateInterval: tempInterval });

    }

    /** Listens for messages from app's main process that specify that the app's window has been maxed or unmaxed and
     * updates the store accordingly */
    registerWindowMaxUnmaxListener() {
        ipc.on("sizeChange", (event, data) => {
            data.isMax ? this.props.route.store.windowIsMax = true: this.props.route.store.windowIsMax = false;
        });
    }

    /** Calls a method to set the status in the store of whether the user is online or not */
    onlineStatusListenerChange() {
        let errorActionObj = new ErrorActions();

        errorActionObj.setOnlineStatus(this.props.route.store, navigator.onLine);
    }

    render() {
        let store = this.props.route.store;
        return(
            <div id="main-container">
                <NavContainer store={ store } />
                <div className="main-column">
                    <WindowControlsContainer store={ store } />
                    <div id="content-container">
                        { React.cloneElement(this.props.children, { store: store }) }
                    </div>
                </div>
                <div id="snackbar"></div>
            </div>
        );
    }
}

export default MainContainer;