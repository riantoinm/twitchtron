"use strict";
import * as constants from "../../../utils/globals";
import { observer } from "mobx-react";
import NoResults from "../../common/NoResults";
import React from "react";
import SectionTitle from "../../common/SectionTitle";
import VideoInfo from "../video/VideoInfo";
import VideoPreview from "../video/VideoPreview";

/** Defines a list of most recent past broadcasts of a specified channel name */
@observer
class ChannelVideosStub extends React.Component {
    constructor(props) {
        super(props);

        this.getVideosList = this.getVideosList.bind(this);
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

    render() {
        let store = this.props.store;
        return(
            <div className="videos-stub">
                <SectionTitle title={ constants.TITLE_PAST_BROADCASTS } />
                <div className="streams-list-wrapper">{ this.getVideosList(store.streamDataChannelVideos) }</div>
            </div>
        );
    }
}

export default ChannelVideosStub;