"use strict";
import * as constants from "../../../utils/globals";
import { numberWithCommas } from "../../../utils/numberOps";
import { observer } from "mobx-react";
import CustomScroll from "../../common/CustomScroll";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import LoadingOffsetComponent from "../../common/LoadingOffsetComponent";
import NonMainStreamInfo from "./NonMainStreamInfo";
import NonMainStreamPreview from "./NonMainStreamPreview";
import NoResults from "../../common/NoResults";
import React from "react";
import SearchForm from "../../search/SearchForm";
import SectionTitle from "../../common/SectionTitle";
import StreamActions from "../../../actions/streamActions";

/** Defines a list of live streams */
@observer
class LiveStreamsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getStreamsList = this.getStreamsList.bind(this);
        this.getSectionTitle = this.getSectionTitle.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let store = this.props.store;
        let streamActionObj = new StreamActions();

        if(this.props.type === "homepage") {
            streamActionObj.getHomepageLiveStreams(store);
        } else {
            let game = this.props.location.query.game;
            if(game === undefined) {
                streamActionObj.setTwitchStreams(store, constants.LIVE_STREAMS);
            } else {
                streamActionObj.getStreamsByGame(game, store);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextStore = nextProps.store;
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.location.query.game !== this.props.location.query.game) {
            if(this.props.type === "homepage") {
                streamActionObj.getHomepageLiveStreams(nextStore);
            } else {
                let nextGame = nextProps.location.query.game;
                if(nextGame === undefined) {
                    streamActionObj.setTwitchStreams(nextStore, constants.LIVE_STREAMS);
                } else {
                    streamActionObj.getStreamsByGame(nextGame, nextStore);
                }
            }
        }
    }

    /** Requests a fetch of offset live stream data when Load More button is clicked */
    loadMoreContent() {
        let store = this.props.store;
        let streamActionObj = new StreamActions();
        if(this.props.type === "homepage") {
            streamActionObj.getHomepageLiveStreamsOffset(store);
        } else {
            let game = this.props.location.query.game;
            if(game === undefined) {
                streamActionObj.setTwitchStreamsOffset(store, constants.LIVE_STREAMS);
            } else {
                streamActionObj.getStreamsByGameOffset(game, store);
            }
        }
    }

    /**
     * Returns a list of live streams from values stored in parsed data
     * @param { Object } parsedData
     */
    getStreamsList(parsedData) {
        let self = this;
        let history = null;
        if(parsedData.length === 0 && this.props.type === "homepage") {
            return <NoResults message="No channels you follow are live right now" />;
        } else if(parsedData.length === 0) {
            return <NoResults message="No live streams to show" />;
        } else {
            this.props.type === "homepage" ? history = this.props.history : history = this.props.route.history;
            return parsedData.map(function(item) {
                return(
                    <div key={ item._id + Math.random() } className="live-stream-container clickable-stream">
                        <NonMainStreamPreview history={ history } store={ self.props.store } type="nonFeatured"
                                              channelName={ item.channel.name } image={ item.preview.medium }
                        />
                        <NonMainStreamInfo game={ item.game }
                                           displayName={ item.channel.display_name }
                                           views={ item.viewers }
                                           store={ self.props.store }
                        />
                    </div>
                );
            });
        }
    }

    /** Returns section title based on whether the list is being rendered in the Homepage or whether the streams are for
     * a specified game, or just top streams */
    getSectionTitle() {
        let store = this.props.store;
        if(this.props.type === "homepage") {
            return `${ constants.TITLE_HOMEPAGE_LIVE } (${ numberWithCommas(store.streamDataTotals) })`;
        } else {
            let game = this.props.location.query.game;
            if(game === undefined) {
                return `${ constants.TITLE_TOP_STREAMS } (${ numberWithCommas(store.streamDataTotals) })`;
            } else {
                return `${ game } ${ constants.TITLE_LIVE_STREAMS } (${ numberWithCommas(store.streamDataTotals) })`;
            }
        }
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        let sectionTitle = this.getSectionTitle();

        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            let parsedData = store.streamData;
            return(
                <CustomScroll id="scrollbars">
                    <div className="scrollbar-inner">
                        <SectionTitle title={ sectionTitle } />
                        <div className="streams-list-wrapper">{ this.getStreamsList(parsedData) }</div>
                        <LoadingOffsetComponent loadMoreContent={ this.loadMoreContent } store={ store } />
                    </div>
                </CustomScroll>
            );
        }
    }

    render() {
        let store = this.props.store;
        let history = null;
        let pageWrapperId = "";

        if(this.props.type === "homepage") {
            history = this.props.history;
            pageWrapperId = "homepage";
        } else {
            history = this.props.route.history;
        }

        return (
            <div className="page-wrapper" id={ pageWrapperId }>
                { this.props.type === "homepage" ? null : <SearchForm location={ this.props.location.pathname } store={ store } history={ history } /> }
                { store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
            </div>
        );
    }
}

export default LiveStreamsContainer;