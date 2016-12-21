"use strict";
import { observer } from "mobx-react";
import ChannelVideosList from "./ChannelVideosStub";
import CustomScroll from "../../common/CustomScroll";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import MainStreamInfo from "../stream/MainStreamInfo";
import PlaybackSourceControls from "./PlaybackSourceControls";
import React from "react";
import StreamActions from "../../../actions/streamActions";
import StreamEmbed from "../stream/StreamEmbed";

/** Defines the past broadcast channel page for a specified channel name */
@observer
class ChannelPastBroadcastHome extends React.Component {
    constructor(props) {
        super(props);

        this.getPastBroadcastInfo = this.getPastBroadcastInfo.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.loadChannelPastBroadcast(this.props.channelName, this.props.videoId, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.channelName !== this.props.channelName || nextProps.videoId !== this.props.videoId) {
            streamActionObj.loadChannelPastBroadcast(nextProps.channelName, nextProps.videoId,  nextProps.store);
        }
    }

    /**
     * Returns markup representing information stored in past broadcast data and channel data objects for a specified
     * past broadcast
     * @param { Object } store
     * @param { Object } channelData
     * @param { Object } pastBroadcastData
     */
    getPastBroadcastInfo(store, channelData, pastBroadcastData) {
        return(
            <MainStreamInfo
                title={ pastBroadcastData.title }
                createdAt={ pastBroadcastData.recorded_at }
                displayName={ pastBroadcastData.channel.display_name }
                game={ pastBroadcastData.game }
                logo={ channelData.logo }
                viewers={ pastBroadcastData.views }
                streamText={ pastBroadcastData.description }
                channelName={ pastBroadcastData.channel.name }
                videoLength={ pastBroadcastData.length }
                followers={ channelData.followers }
                type="pastBroadcast"
                isMature={ channelData.mature }
                isPartner={ channelData.partner }
                language={ channelData.language }
                isRecorded={ true }
                store={ store }
            />
        );
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            let streamDataChannelKey = store.streamData.channel;
            let streamDataPastBroadcastKey = store.streamData.channelPastBroadcast;
            let renderMarkup = this.getPastBroadcastInfo(store, streamDataChannelKey, streamDataPastBroadcastKey);

            return(
                <div className="scrollbar-inner">
                    <div className="channel-main-stream-row">
                        <StreamEmbed type="pastBroadcast" channelName={ streamDataChannelKey.name } videoId={ this.props.videoId } store={ store } />
                        { renderMarkup }
                    </div>
                    <PlaybackSourceControls contentIdentifier={ streamDataPastBroadcastKey._id }
                                            contentType="video"
                                            contentUrl={ streamDataPastBroadcastKey.url }
                                            store={ store } />
                    <ChannelVideosList store={ store } history={ this.props.history } />
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

export default ChannelPastBroadcastHome;