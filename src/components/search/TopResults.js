"use strict";
import * as constants from "../../utils/globals";
import { observer } from "mobx-react";
import ChannelLogo from "../twitch/channel/ChannelLogo";
import ChannelSearchResultsInfo from "../twitch/channel/ChannelSearchResultsInfo";
import CustomScroll from "../common/CustomScroll";
import GameInfo from "../twitch/game/GameInfo";
import GamePreview from "../twitch/game/GamePreview";
import GeneralErrorComponent from "../errors/GeneralErrorComponent";
import LoadingComponent from "../common/LoadingComponent";
import NonMainStreamInfo from "../twitch/stream/NonMainStreamInfo";
import NonMainStreamPreview from "../twitch/stream/NonMainStreamPreview";
import NoResults from "../common/NoResults";
import React from "react";
import SectionTitle from "../common/SectionTitle";
import StreamActions from "../../actions/streamActions";

/** Defines a list of top results for of channels, live streams, and games shown after a search */
@observer
class TopResults extends React.Component {
    constructor(props) {
        super(props);

        this.getChannelsResultsMarkup = this.getChannelsResultsMarkup.bind(this);
        this.getStreamsResultsMarkup = this.getStreamsResultsMarkup.bind(this);
        this.getGamesResultsMarkup = this.getGamesResultsMarkup.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.setSearchAllStreamData(this.props.searchQuery, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.searchQuery !== this.props.searchQuery) {
            streamActionObj.setSearchAllStreamData(nextProps.searchQuery, nextProps.store);
        }
    }

    /**
     * Returns a list of channel results from values stored in parsed data
     * @param { Object } parsedData
     */
    getChannelsResultsMarkup(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message={ `No channels matching "${ this.props.searchQuery }"` } />;
        } else {
            let self = this;
            return parsedData.map(function(item) {
                return(
                    <div key={ item._id + Math.random() } className="channel-logos-container clickable-stream">
                        <ChannelLogo image={ item.logo }
                                     channelName={ item.name }
                                     history={ self.props.history }
                                     store={ self.props.store }
                        />
                        <ChannelSearchResultsInfo displayName={ item.display_name } />
                    </div>
                );
            });
        }
    }

    /**
     * Returns a list of live stream results from values stored in parsed data
     * @param { Object } parsedData
     */
    getStreamsResultsMarkup(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message={ `No live streams matching "${ this.props.searchQuery }"` } />;
        } else {
            let self = this;
            return parsedData.map(function (item) {
                return (
                    <div key={ item._id } className="live-stream-container clickable-stream">
                        <NonMainStreamPreview channelName={ item.channel.name } image={ item.preview.medium }
                                              type="nonFeatured" history={ self.props.history } store={ self.props.store }
                        />
                        <NonMainStreamInfo game={ item.channel.game }
                                           displayName={ item.channel.display_name }
                                           views={ item.viewers }
                                           store={ self.props.store }
                        />
                    </div>
                );
            });
        }
    }

    /**
     * Returns a list of game results from values stored in parsed data
     * @param { Object } parsedData
     */
    getGamesResultsMarkup(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message={ `No games matching "${ this.props.searchQuery }"` } />;
        } else {
            let self = this;
            return parsedData.map(function (item) {
                return (
                    <div key={ item._id + Math.random() } className="top-game-container clickable-stream">
                        <GamePreview image={ item.box.large }
                                     gameName={ item.name }
                                     history={ self.props.history }
                                     store={ self.props.store }
                        />
                        <GameInfo name={ item.name } viewers={ item.popularity }/>
                    </div>
                );
            });
        }
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            return(
                <div className="scrollbar-inner">
                    <SectionTitle title={ constants.TITLE_SEARCH_TOP_RESULTS } />
                    <h4 className="sub-title">LIVE</h4>
                    <div className="streams-list-wrapper">{ this.getStreamsResultsMarkup(store.streamData.streams) }</div>
                    <h4 className="sub-title">CHANNELS</h4>
                    <div className="channel-logo-list-wrapper">{ this.getChannelsResultsMarkup(store.streamData.channels) }</div>
                    <h4 className="sub-title">GAMES</h4>
                    <div className="games-list-wrapper">{ this.getGamesResultsMarkup(store.streamData.games) }</div>
                </div>
            );
        }
    }

    render() {
        return(
            <div className="section-container-inner container-with-nav content-container">
                <CustomScroll id="scrollbars">
                    { this.props.store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
                </CustomScroll>
            </div>
        );
    }
}
export default TopResults;
