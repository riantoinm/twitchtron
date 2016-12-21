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
            <iframe
                src={`http://player.twitch.tv/?channel=${ this.props.channelName }`}
                frameBorder="0"
                height="360px"
                width="640px"
                scrolling="no"
                allowFullScreen="true">
            </iframe>
        );
    }

    /** Returns markup for embedded stream of past broadcast specified by video id */
    getPastBroadcastMarkup() {
        return(
            <iframe
                src={`http://player.twitch.tv/?video=${ this.props.videoId }`}
                frameBorder="0"
                height="360px"
                width="640px"
                scrolling="no"
                allowFullScreen="true">
            </iframe>
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