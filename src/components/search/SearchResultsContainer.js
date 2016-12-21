"use strict";
import * as constants from "../../utils/globals";
import ChannelsResults from "./ChannelsResults";
import GamesResults from "./GamesResults";
import React from "react";
import SearchForm from "./SearchForm";
import SearchResultsNav from "./SearchResultsNav";
import StreamsResults from "./StreamsResults";
import TopResults from "./TopResults";

/** Defines the container that wraps the main components and navigation used in displaying search results */
class SearchResultsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedContent : null,
            activeTab: null,
            locationData: {
                pathname: this.props.location.pathname,
                query: {
                    searchQuery: this.props.location.query.searchQuery
                }
            }
        };

        this.setResultsMarkup = this.setResultsMarkup.bind(this);
    }

    componentWillMount() {
        this.setState({
            activeTab: "top",
            locationData: {
                pathname: this.props.location.pathname,
                query: {
                    searchQuery: this.props.location.query.searchQuery
                }
            },
            renderedContent : <TopResults store={ this.props.store } searchQuery={ this.props.location.query.searchQuery } history={ this.props.route.history } location={ this.props.location } />
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeTab: "top",
            locationData: {
                pathname: this.props.location.pathname,
                query: {
                    searchQuery: nextProps.location.query.searchQuery
                }
            },
            renderedContent : <TopResults store={ nextProps.store } searchQuery={ nextProps.location.query.searchQuery } history={ nextProps.route.history } location={ nextProps.location } />
        });
    }

    /**
     * Sets component state to store markup that will render when onclick event is fired by a nav item click
     * @param { Object } event
     */
    setResultsMarkup(event) {
        let store = this.props.store;
        let history = this.props.route.history;
        let searchQuery = this.props.location.query.searchQuery;
        let location = this.props.location;

        switch(event.currentTarget.id) {
            case constants.SEARCH_ALL:
                this.setState({
                    activeTab: "top",
                    renderedContent: <TopResults store={ store } searchQuery={ searchQuery } history={ history } location={ location } />
                });
                break;
            case constants.SEARCH_CHANNELS:
                this.setState({
                    activeTab: "channels",
                    renderedContent: <ChannelsResults store={ store } searchQuery={ searchQuery } history={ history } location={ location } />
                });
                break;
            case constants.SEARCH_GAMES:
                this.setState({
                    activeTab: "games",
                    renderedContent: <GamesResults store={ store } searchQuery={ searchQuery } history={ history } location={ location } />
                });
                break;
            case constants.SEARCH_STREAMS:
                this.setState({
                    activeTab: "streams",
                    renderedContent: <StreamsResults store={ store } searchQuery={ searchQuery } history={ history } location={ location } />
                });
                break;
        }
    }

    render() {
        let store = this.props.store;
        return (
            <div className="main-wrapper">
                <SearchForm location={ this.state.locationData } store={ store } history={ this.props.route.history } />
                    <div className="section-container">
                        <SearchResultsNav activeTab={ this.state.activeTab }
                                          searchStreams={ this.setResultsMarkup }
                                          store={ store }
                        />
                        { this.state.renderedContent }
                    </div>
            </div>
        );
    }
}

export default SearchResultsContainer;