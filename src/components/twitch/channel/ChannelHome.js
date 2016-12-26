"use strict";
import { observer } from "mobx-react";
import ChannelVideosStub from "./ChannelVideosStub";
import CustomScroll from "../../common/CustomScroll";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import MainStreamInfo from "../stream/MainStreamInfo";
import MainStreamPreview from "../stream/MainStreamPreview";
import PlaybackSourceControls from "./PlaybackSourceControls";
import React from "react";
import StreamActions from "../../../actions/streamActions";
import StreamEmbed from "../stream/StreamEmbed";

/** Defines the channel homepage for a live or offline specified channel name */
@observer
class ChannelHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = { channelUpdateInterval: null };

        this.setupChannelUpdateInterval = this.setupChannelUpdateInterval.bind(this);
        this.getLiveChannelInfo = this.getLiveChannelInfo.bind(this);
        this.getOfflineChannelInfo = this.getOfflineChannelInfo.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.loadChannelLive(this.props.channelName, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.channelName !== this.props.channelName) {
            streamActionObj.loadChannelLive(nextProps.channelName, nextProps.store);
        }
    }
    componentDidMount() {
        this.setupChannelUpdateInterval();
    }

    componentDidUpdate() {
        if(this.props.store.streamData.channelStream === null) {
            clearInterval(this.state.channelUpdateInterval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.channelUpdateInterval);
    }

    /** Sets up an interval in the component's state to fetch updates of the channel's data */
    setupChannelUpdateInterval() {
        let streamActionObj = new StreamActions();
        let self = this;
        let tempInterval = setInterval(() => {
            streamActionObj.loadChannelLiveUpdate(self.props.channelName, self.props.store);
        }, 120000);

        this.setState({ channelUpdateInterval: tempInterval });

    }

    /**
     * Returns markup representing information stored in channel stream data and channel data objects for a specified
     * live channel
     * @param { Object } store
     * @param { Object } channelData
     * @param { Object } channelStreamData
     */
    getLiveChannelInfo(store, channelData, channelStreamData) {
        return(
            <MainStreamInfo
                channelName={ channelData.name }
                createdAt={ store.streamDataChannelUptime }
                displayName={ channelData.display_name }
                followers={ channelData.followers }
                game={ channelStreamData.game }
                logo={ channelData.logo }
                streamText={ channelStreamData.channel.status}
                viewers={ store.streamDataChannelViewers }
                isMature={ channelData.mature }
                isPartner={ channelData.partner }
                language={ channelData.language }
                isLive={ true }
                store={ store }
            />
        );
    }

    /**
     * Returns markup representing information stored in channel data object for a specified offline channel
     * @param { Object } store
     * @param { Object } channelData
     */
    getOfflineChannelInfo(store, channelData) {
        return(
            <MainStreamInfo
                channelName={ channelData.name }
                createdAt={ null }
                displayName={ channelData.display_name }
                followers={ channelData.followers }
                game={ null }
                logo={ channelData.logo }
                streamText=""
                viewers={ 0 }
                isMature={ channelData.mature }
                isPartner={ channelData.partner }
                language={ channelData.language }
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
            let image = null;
            let markupType = null;
            let channelName = store.streamData.channel.name;
            let streamDataChannelKey = store.streamData.channel;
            let streamDataStreamKey = store.streamData.channelStream;
            let channelIsLive = (streamDataStreamKey != null);

            if(channelIsLive) {
                image = streamDataStreamKey.preview.large;
                markupType = this.getLiveChannelInfo(store, streamDataChannelKey, streamDataStreamKey);
            } else {
                image = streamDataChannelKey.video_banner;
                markupType = this.getOfflineChannelInfo(store, streamDataChannelKey);
            }
            return (
                <div className="scrollbar-inner">
                    <div id="channel-main-stream" className="main-stream-row">
                        {
                            store.isWatchingEmbededStream
                                ? <StreamEmbed type="live" channelName={ channelName } store={ store }/>
                                : <MainStreamPreview channelName={ channelName } image={ image } type="channel"/>
                        }
                        { markupType }
                    </div>
                    {
                        channelIsLive
                            ? <PlaybackSourceControls contentIdentifier={ channelName }
                                                      contentType="channel"
                                                      contentUrl={ streamDataChannelKey.url }
                                                      store={ store }/>
                            : null
                    }
                    <ChannelVideosStub store={ store } history={ this.props.history }/>
                </div>
            );
        }
    }

    render() {
        return(
            <CustomScroll id="scrollbars">
                { this.props.store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
            </CustomScroll>
        );
    }
}

export default ChannelHome;