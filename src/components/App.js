"use strict";
import { Router, Route, IndexRoute } from "react-router";
import ChannelContainer from "./twitch/channel/ChannelContainer";
import FeaturedStreamsContainer from "./twitch/stream/FeaturedStreamsContainer";
import GameListContainer from "./twitch/game/GameListContainer";
import HomepageContainer from "./homepage/HomepageContainer";
import LiveStreamsContainer from "./twitch/stream/LiveStreamsContainer";
import MainContainer from "./main/MainContainer";
import React, { PropTypes } from "react";
import SearchResultsContainer from "./search/SearchResultsContainer";
import SettingsContainer from "./settings/SettingsContainer";
import StartupContainer from "./startup/StartupContainer";
import VideoListContainer from "./twitch/video/VideoListContainer";
import WrapperContainer from "./main/WrapperContainer";

/** Defines the router and routes used by the app for navigation */
class App extends React.Component {
    render() {
        const store = this.props.store;
        return(
            <Router history={ this.props.history }>
                <Route path="/" component={ WrapperContainer } history={ this.props.history } store={ store }>
                    <IndexRoute component={ StartupContainer } history={ this.props.history } store={ store } />
                    <Route path="main" component={ MainContainer } history={ this.props.history } store={ store }>
                        <IndexRoute component={ FeaturedStreamsContainer } history={ this.props.history } />
                        <Route name="featuredStreams" path="featuredStreams" component={ FeaturedStreamsContainer } history={ this.props.history } />
                        <Route name="liveStreams" path="liveStreams" component={ LiveStreamsContainer } history={ this.props.history } />
                        <Route name="topGames" path="topGames" component={ GameListContainer } history={ this.props.history } />
                        <Route name="topVideos" path="topVideos" component={ VideoListContainer } history={ this.props.history } />
                        <Route name="userHomepage" path="userHomepage" component={ HomepageContainer } history={ this.props.history } />
                        <Route name="userSettings" path="userSettings" component={ SettingsContainer } history={ this.props.history } />
                        <Route name="channelPage" path="channelPage" component={ ChannelContainer } history={ this.props.history } />
                        <Route name="searchResults" path="searchResults" component={ SearchResultsContainer } history={ this.props.history } />
                    </Route>
                </Route>
            </Router>
        );
    }
}

App.propTypes = {
    history: React.PropTypes.object,
    config: React.PropTypes.object,
    initialState: React.PropTypes.object
};

export default App;
