"use strict";
import * as constants from "../../utils/globals";
import { observer } from "mobx-react"; 
import ChannelFollowers from "../twitch/channel/ChannelFollowers";
import ChannelFollowing from "../twitch/channel/ChannelFollowing";
import ChannelVideosPage from "../twitch/channel/ChannelVideosPage";
import HomepageForbidden from "../errors/HomepageForbidden";
import HomepageNav from "./HomepageNav";
import LiveStreamsContainer from "../twitch/stream/LiveStreamsContainer";
import React from "react";
import SearchForm from "../search/SearchForm";

/** Defines the container that wraps the main components and navigation used on the user Homepage */
@observer
class HomepageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedContent : null,
            activeTab: null,
        };

        this.setStreamMarkup = this.setStreamMarkup.bind(this);
        this.getUserTypeMarkup = this.getUserTypeMarkup.bind(this);
    }

    componentWillMount() {
        this.setState({
            activeTab: "live",
            renderedContent: <LiveStreamsContainer store={ this.props.store } type="homepage" history={ this.props.route.history } location={ this.props.location } />,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeTab: "live",
            renderedContent: <LiveStreamsContainer store={ nextProps.store } type="homepage" history={ nextProps.route.history } location={ nextProps.location } />,
        });
    }

    /**
     * Sets component state to store markup that will render when onclick event is fired by a nav item click
     * @param { Object } event
     */
    setStreamMarkup(event) {
        let store = this.props.store;
        let history = this.props.route.history;
        let location = this.props.location;

        switch(event.currentTarget.id) {
            case constants.HOMEPAGE_LIVE:
                this.setState({
                    activeTab: "live",
                    renderedContent: <LiveStreamsContainer store={ store } type="homepage" history={ history } location={ location } />
                });
                break;
            case constants.HOMEPAGE_FOLLOWING:
                this.setState({
                    activeTab: "following",
                    renderedContent: <ChannelFollowing store={ store } channelName={ store.userData.name } history={ history } location={ location } />
                });
                break;
            case constants.HOMEPAGE_FOLLOWERS:
                this.setState({
                    activeTab: "followers",
                    renderedContent: <ChannelFollowers store={ store } channelName={ store.userData.name } history={ history } location={ location } />
                });
                break;
            case constants.HOMEPAGE_VIDEOS:
                this.setState({
                    activeTab: "videos",
                    renderedContent: <ChannelVideosPage store={ store } channelName={ store.userData.name } history={ history } location={ location } />
                });
                break;
        }
    }

    /**
     * Returns markup to render based on whether user is authenticated and authorized or not
     */
    getUserTypeMarkup() {
        if(this.props.store.userIsAuthorized && this.props.store.userIsAuthenticated) {
            return (
                <div id="homepage-container" className="section-container">
                    <HomepageNav activeTab={ this.state.activeTab }
                                 loadHomepageContent={ this.setStreamMarkup }
                                 store={ this.props.store }
                    />
                    { this.state.renderedContent }
                </div>
            );
        } else {
            return (
                <div id="homepage-container" className="section-container">
                    <HomepageForbidden />;
                </div>
            );
        }
    }

    render() {
        let store = this.props.store;
        return (
            <div className="main-wrapper">
                <SearchForm location={ this.props.location.pathname } store={ store } history={ this.props.route.history } />
                { this.getUserTypeMarkup() }
            </div>
        );
    }
}

export default HomepageContainer;