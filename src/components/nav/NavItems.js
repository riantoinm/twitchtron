"use strict";
import { Link } from "react-router";
import ErrorActions from '../../actions/errorActions';
import React from "react";

/** Defines the app's main navigation links */
class NavItems extends React.Component {
    constructor(props) {
        super(props);

        this.checkOnlineStatus = this.checkOnlineStatus.bind(this);
    }

    /**
     * Checks user's online status in the store. If false, prevents link events from firing and requests that an error
     * message be shown
     * @param { Object } event
     */
    checkOnlineStatus(event) {
        if(!this.props.store.isOnline) {
            event.preventDefault();
            let errorActionObj = new ErrorActions();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    render() {
        return(
            <nav className="nav nav-items-container">
                <hr className="nav-hr" />
                <header className="nav-header">
                    <h1 className="nav-title">Browse</h1>
                </header>

                <div className="nav-item">
                    <div className="nav-item-container" id="featured-channels">
                        <Link to="/main/featuredStreams" id="featured-channels-wrapper" activeClassName="active" className="link-highlight-wrapper" onClick={ this.checkOnlineStatus }>
                            <i className="material-icons nav-icon">new_releases</i>
                            <button className="nav-button">Featured</button>
                        </Link>
                    </div>
                    <div className="nav-item-container" id="live-channels">
                        <Link to="/main/liveStreams" id="live-channels-wrapper" activeClassName="active" className="link-highlight-wrapper" onClick={ this.checkOnlineStatus }>
                            <i className="material-icons nav-icon">live_tv</i>
                            <button className="nav-button">Live</button>
                        </Link>
                    </div>
                    <div className="nav-item-container" id="top-games">
                        <Link to="/main/topGames" id="top-games-wrapper" activeClassName="active" className="link-highlight-wrapper" onClick={ this.checkOnlineStatus }>
                            <i className="material-icons nav-icon">games</i>
                            <button className="nav-button">Games</button>
                        </Link>
                    </div>
                    <div className="nav-item-container" id="top-videos">
                        <Link to="/main/topVideos" id="top-videos-wrapper" activeClassName="active" className="link-highlight-wrapper" onClick={ this.checkOnlineStatus }>
                            <i className="material-icons nav-icon">subscriptions</i>
                            <button className="nav-button">Videos</button>
                        </Link>
                    </div>
                </div>

                <hr className="nav-hr" />
                <header className="nav-header">
                    <h1 className="nav-title">User</h1>
                </header>

                <div className="nav-item">
                    <div className="nav-item-container" id="my-homepage">
                        <Link to="/main/userHomepage" id="my-homepage-wrapper" activeClassName="active" className="link-highlight-wrapper" onClick={ this.checkOnlineStatus }>
                            <i className="material-icons nav-icon">home</i>
                            <button className="nav-button">Homepage</button>
                        </Link>
                    </div>
                    <div className="nav-item-container" id="my-settings">
                        <Link to="/main/userSettings" id="my-settings-wrapper" activeClassName="active" className="link-highlight-wrapper" onClick={ this.checkOnlineStatus }>
                            <i className="material-icons nav-icon">settings</i>
                            <button className="nav-button">Settings</button>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavItems;