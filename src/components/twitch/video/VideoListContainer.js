"use strict";
import * as constants from "../../../utils/globals";
import { observer } from "mobx-react";
import CustomScroll from "../../common/CustomScroll";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import LoadingOffsetComponent from "../../common/LoadingOffsetComponent";
import NoResults from "../../common/NoResults";
import React from "react";
import SearchForm from "../../search/SearchForm";
import SectionTitle from "../../common/SectionTitle";
import StreamActions from "../../../actions/streamActions";
import VideoInfo from "./VideoInfo";
import VideoPreview from "./VideoPreview";

/** Defines a list of top videos */
@observer
class VideoListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getVideosList = this.getVideosList.bind(this);
        this.getPlaceholders = this.getPlaceholders.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.setTwitchStreams(this.props.store, constants.TOP_VIDEOS);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE") {
            streamActionObj.setTwitchStreams(nextProps.store, constants.TOP_VIDEOS);
        }
    }

    /** Requests a fetch of offset top video data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();
        streamActionObj.setTwitchStreamsOffset(this.props.store, constants.TOP_VIDEOS);
    }

    /**
     * Returns a list of top videos from values stored in parsed data
     * @param { Object } parsedData
     */
    getVideosList(parsedData) {
        let self = this;
        if(parsedData.length === 0) {
            return <NoResults message="No videos to show" />;
        } else {
            return parsedData.map(function(item) {
                return(
                    <div key={ item._id + Math.random() } className="top-video-container clickable-stream">
                        <VideoPreview videoLength={ item.length }
                                      videoId={ item._id }
                                      views={ item.views }
                                      image={ item.preview }
                                      channelName={ item.channel.name }
                                      history={ self.props.route.history }
                                      store={ self.props.store }
                        />
                        <VideoInfo recordedAt={ item.recorded_at } title={ item.title } displayName={ item.channel.display_name } />
                    </div>
                );
            });
        }
    }

    /** Returns an array of div elements to act as placeholders */
    getPlaceholders() {
        return [
            <div key={ Math.random() } className="video-placeholder"></div>,
            <div key={ Math.random() } className="video-placeholder"></div>,
            <div key={ Math.random() } className="video-placeholder"></div>,
            <div key={ Math.random() } className="video-placeholder"></div>,
            <div key={ Math.random() } className="video-placeholder"></div>
        ];
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            return(
                <CustomScroll id="scrollbars">
                    <div className="videos-row scrollbar-inner">
                        <SectionTitle title={ constants.TITLE_TOP_VIDEOS } />
                        <div className="streams-list-wrapper">{ this.getVideosList(store.streamData) }{ this.getPlaceholders() }</div>
                    </div>
                    <LoadingOffsetComponent loadMoreContent={ this.loadMoreContent } store={ store } />
                </CustomScroll>
            );
        }
    }

    render() {
        let store = this.props.store;
        return (
            <div className="page-wrapper">
                <SearchForm location={ this.props.location.pathname } store={ store } history={ this.props.route.history } />
                { store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
            </div>
        );
    }
}

export default VideoListContainer;