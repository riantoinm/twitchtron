"use strict";
import { observer } from "mobx-react";
import React from "react";

/** Defines an embedded live stream or past broadcast */
@observer
class StreamEmbed extends React.Component {
    constructor(props) {
        super(props);

        this.getLiveMarkup = this.getLiveMarkup.bind(this);
        this.getPastBroadcastMarkup = this.getPastBroadcastMarkup.bind(this);
    }

    componentWillMount() {
        this.props.store.isWatchingEmbededStream = true;
    }

    componentWillUnmount() {
        this.props.store.isWatchingEmbededStream = false;
    }

    /** Returns markup for embedded stream of live channel specified by channel name */
    getLiveMarkup() {
        return(
            <div className="stream-embed-container">
                <div className="stream-embed-wrapper">
                    <iframe
                        className="stream-embed"
                        src={`http://player.twitch.tv/?channel=${ this.props.channelName }`}
                        frameBorder="0"
                        height="360px"
                        width="640px"
                        scrolling="no"
                        allowFullScreen="true">
                    </iframe>
                </div>
            </div>
        );
    }

    /** Returns markup for embedded stream of past broadcast specified by video id */
    getPastBroadcastMarkup() {
        return(
            <div className="stream-embed-container">
                <div className="stream-embed-wrapper">
                    <iframe
                        className="stream-embed"
                        src={`http://player.twitch.tv/?video=${ this.props.videoId }`}
                        frameBorder="0"
                        height="360px"
                        width="640px"
                        scrolling="no"
                        allowFullScreen="true">
                    </iframe>
                </div>
            </div>
        );
    }

    render() {
        if(this.props.type === "live") {
            return this.getLiveMarkup();
        } else {
            return this.getPastBroadcastMarkup();
        }
    }
}

export default StreamEmbed;