"use strict";
import { Link } from "react-router";
import { numberWithCommas } from "../../utils/numberOps";
import { observer } from "mobx-react";
import ChannelLogo from "../twitch/channel/ChannelLogo";
import ErrorActions from "../../actions/errorActions";
import NavLoadingComponent from "./NavLoadingComponent";
import React from "react";

/** Defines the footer of the navigation panel */
@observer
class NavFooter extends React.Component {
    constructor(props) {
        super(props);

        this.checkOnlineStatus = this.checkOnlineStatus.bind(this);
        this.getFollowingStreamsLiveMarkup = this.getFollowingStreamsLiveMarkup.bind(this);
        this.getAuthenticatedUserMarkup = this.getAuthenticatedUserMarkup.bind(this);
        this.getGuestUserMarkup = this.getGuestUserMarkup.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    /**
     * Checks the online status in the app store and prevents outgoing links if user is not online, then requests an error
     * message to be shown in the snackbar
     * @param { Object } event
     */
    checkOnlineStatus(event) {
        if(!this.props.store.isOnline) {
            let errorActionObj = new ErrorActions();

            event.preventDefault();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    /** Returns markup that shows the current count of live channels that the authenticated user is following */
    getFollowingStreamsLiveMarkup() {
        let followingStreamsLiveCount = this.props.store.currentFollowingStreamsLiveCount;
        if(followingStreamsLiveCount === 0) {
            return <p><Link to="/main/liveStreams" id="nav-live-stream-count" className="clickable-link" onClick={ this.checkOnlineStatus }>Discover</Link> new channels!</p>
        } else if(followingStreamsLiveCount === 1) {
            return(
                <p>
                    <Link to="/main/userHomepage" id="nav-live-stream-count" className="clickable-link" onClick={ this.checkOnlineStatus }>
                        { `${ followingStreamsLiveCount }` } channel
                    </Link>
                    you follow is live now!
                </p>
            );
        } else {
            return(
                <p>
                    <Link to="/main/userHomepage" id="nav-live-stream-count" className="clickable-link" onClick={ this.checkOnlineStatus }>
                        { `${ numberWithCommas(followingStreamsLiveCount) }` } channels
                    </Link>
                    you follow are live now!
                </p>
            );
        }
    }

    /**
     * Returns markup that shows information about the authenticated user
     * @param { Object } store
     */
    getAuthenticatedUserMarkup(store) {
        return(
            <div id="nav-user-info-container">
                <ChannelLogo image={ store.userData.logo }
                             channelName={ store.userData.name }
                             store={ store }
                             type="navLogo"
                />
                <div id="nav-user-display-name"><h4>{ store.userData.display_name }</h4></div>
                <div>
                    { store.currentFollowingStreamsLiveCount === null ? null : this.getFollowingStreamsLiveMarkup() }
                </div>
            </div>
        );
    }

    /**
     * Returns markup that shows information about the guest user
     * @param { Object } store
     */
    getGuestUserMarkup(store) {
        return(
            <div id="nav-user-info-container">
                <ChannelLogo image={ __dirname + "../../../assets/images/guest_user_icon.png" }
                             channelName="Guest"
                             store={ store }
                             type="navLogo" />
                <div id="nav-user-display-name"><h4>Guest</h4></div>
            </div>
        );
    }

    /** Returns markup to render based on whether user is authenticated or a guest */
    getRenderMarkup() {
        let store = this.props.store;
        if(store.userIsAuthenticated) {
            if(store.userData === null) {
                return <NavLoadingComponent />;
            } else {
                return this.getAuthenticatedUserMarkup(store);
            }
        } else {
             return this.getGuestUserMarkup(store);
        }
    }


    render() {
        return(
            <footer className="nav-footer">
                { this.getRenderMarkup() }
                { !this.props.store.isOnline ? <div className="info-badge" id="offline-badge">OFFLINE</div>: null }
            </footer>
        );
    }

}

export default NavFooter;