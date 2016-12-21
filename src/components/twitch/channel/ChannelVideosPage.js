"use strict";
import * as constants from "../../../utils/globals";
import { numberWithCommas } from "../../../utils/numberOps";
import { observer } from "mobx-react";
import CustomScroll from "../../common/CustomScroll";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import LoadingOffsetComponent from "../../common/LoadingOffsetComponent";
import NoResults from "../../common/NoResults";
import React from "react";
import SectionTitle from "../../common/SectionTitle";
import StreamActions from "../../../actions/streamActions";
import VideoInfo from "../video/VideoInfo";
import VideoPreview from "../video/VideoPreview";

/** Defines a list of all past broadcasts for a specified channel */
@observer
class ChannelVideosPage extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.getVideosByChannel(this.props.channelName, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.channelName !== this.props.channelName) {
            streamActionObj.getVideosByChannel(nextProps.channelName, nextProps.store);
        }
    }

    /** Requests a fetch of offset channel past broadcast data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();

        streamActionObj.getVideosByChannelOffset(this.props.channelName, this.props.store);
    }

    /**
     * Returns a list of past broadcasts from values stored in parsed data
     * @param { Object } parsedData
     */
    getVideosList(parsedData) {
        let self = this;
        if(parsedData.length === 0) {
            return <NoResults message="No past broadcasts" />;
        } else {
            return parsedData.map(function(item) {
                return(
                    <div key={ item._id + Math.random() } className="top-video-container clickable-stream">
                        <VideoPreview videoLength={ item.length }
                                      videoId={ item._id }
                                      views={ item.views }
                                      image={ item.preview }
                                      channelName={ item.channel.name }
                                      history={ self.props.history }
                                      store={ self.props.store }
                        />
                        <VideoInfo recordedAt={ item.recorded_at } title={ item.title } displayName={ item.channel.display_name } />
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
                <div className="videos-row scrollbar-inner">
                    <SectionTitle title={ `${ constants.TITLE_PAST_BROADCASTS } (${ numberWithCommas(this.props.store.streamDataTotals) })` } />
                    <div className="streams-list-wrapper">{ this.getVideosList(store.streamDataChannelVideos) }</div>
                    <LoadingOffsetComponent loadMoreContent={ this.loadMoreContent } store={ store } />
                </div>
            );
        }
    }

    render() {
        return(
            <div id="channel-section-container" className="section-container-inner container-with-nav content-container">
                <CustomScroll id="scrollbars">
                    { this.props.store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
                </CustomScroll>
            </div>
        );
    }
}

export default ChannelVideosPage;