"use strict";
import * as constants from "../../../utils/globals";
import ChannelFollowers from "./ChannelFollowers";
import ChannelFollowing from "./ChannelFollowing";
import ChannelHome from "./ChannelHome";
import ChannelNav from "./ChannelNav";
import ChannelPastBroadcastHome from "./ChannelPastBroadcastHome";
import ChannelVideosPage from "./ChannelVideosPage";
import React from "react";
import SearchForm from "../../search/SearchForm";

/** Defines the container that wraps the main components and navigation used in displaying a channel */
class ChannelContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedContent : null,
            activeTab: null,
            locationData: {
                pathname: this.props.location.pathname,
                query: {
                    channelName: this.props.location.query.channelName,
                    videoId: this.props.location.query.videoId
                }
            }
        };

        this.setStreamMarkup = this.setStreamMarkup.bind(this);
    }

    componentWillMount() {
        let store = this.props.store;
        let channelName = this.props.location.query.channelName;
        let videoId = this.props.location.query.videoId;
        let history = this.props.route.history;
        let location = this.props.location;

        if(videoId === undefined) {
            this.setState({
                activeTab: "channelHome",
                locationData: {
                    pathname: this.props.location.pathname,
                    query: {
                        channelName: channelName
                    }
                },
                renderedContent: <ChannelHome store={ store } channelName={ channelName } history={ history } location={ location } />
            });
        } else {
            this.setState({
                activeTab: "channelHome",
                locationData: {
                    pathname: this.props.location.pathname,
                    query: {
                        channelName: channelName,
                        videoId: videoId
                    }
                },
                renderedContent: <ChannelPastBroadcastHome store={ store } channelName={ channelName } videoId={ videoId } history={ history } location={ location } />
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextStore = nextProps.store;
        let nextChannelName = nextProps.location.query.channelName;
        let nextVideoId = nextProps.location.query.videoId;
        let nextHistory = nextProps.route.history;
        let nextLocation = nextProps.location;

        if(nextVideoId === undefined) {
            this.setState({
                activeTab: "channelHome",
                locationData: {
                    pathname: nextProps.location.pathname,
                    query: {
                        channelName: nextChannelName
                    }
                },
                renderedContent: <ChannelHome store={ nextStore } channelName={ nextChannelName } history={ nextHistory } location={ nextLocation } />
            });
        } else {
            this.setState({
                activeTab: "channelHome",
                locationData: {
                    pathname: nextProps.location.pathname,
                    query: {
                        channelName: nextChannelName,
                        videoId: nextVideoId
                    }
                },
                renderedContent: <ChannelPastBroadcastHome store={ nextStore } channelName={ nextChannelName } videoId={ nextVideoId } history={ nextHistory } location={ nextLocation } />
            });
        }
    }

    /**
     * Sets component state to store markup that will render when onclick event is fired by a nav item click
     * @param { Object } event
     */
    setStreamMarkup(event) {
        let store = this.props.store;
        let channelName = this.props.location.query.channelName;
        let history = this.props.route.history;
        let location = this.props.location;

        switch(event.currentTarget.id) {
            case constants.CHANNEL_PAGE:
                this.setState({
                    activeTab: "channelHome",
                    renderedContent: <ChannelHome store={ store } channelName={ channelName } history={ history } location={ location } />
                });
                break;
            case constants.CHANNEL_FOLLOWING:
                this.setState({
                    activeTab: "following",
                    renderedContent: <ChannelFollowing store={ store } channelName={ channelName } history={ history } location={ location } />
                });
                break;
            case constants.CHANNEL_FOLLOWERS:
                this.setState({
                    activeTab: "followers",
                    renderedContent: <ChannelFollowers store={ store } channelName={ channelName } history={ history } location={ location } />
                });
                break;
            case constants.CHANNEL_VIDEOS:
                this.setState({
                    activeTab: "videos",
                    renderedContent: <ChannelVideosPage store={ store } channelName={ channelName } history={ history } location={ location } />
                });
                break;
        }
    }

    render() {
        let store = this.props.store;
        return(
            <div className="main-wrapper">
                <SearchForm location={ this.state.locationData } store={ store } history={ this.props.route.history } />
                <div id="channel-container" className="section-container">
                    <ChannelNav activeTab={ this.state.activeTab }
                                channelName={ this.props.location.query.channelName }
                                loadChannelContent={ this.setStreamMarkup }
                                store={ store }
                    />
                    { this.state.renderedContent }
                </div>
            </div>
        );
    }
}

export default ChannelContainer;