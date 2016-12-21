"use strict";
import { checkGame, checkLogo, checkStatus } from "../../../utils/twitchDataChecks";
import { formatTimeFromSeconds, formatDate } from "../../../utils/dateTimeOps";
import { getUptime } from "../../../utils/dateTimeOps";
import { Link } from "react-router";
import { numberWithCommas } from "../../../utils/numberOps";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines the info specified in the props for a specified main stream */
class MainStreamInfo extends React.Component {
    constructor(props) {
        super(props);

        this.checkOnlineStatus = this.checkOnlineStatus.bind(this);
        this.replaceMissingImage = this.replaceMissingImage.bind(this);
        this.getGameTitleMarkup = this.getGameTitleMarkup.bind(this);
        this.getStatusMarkup = this.getStatusMarkup.bind(this);
        this.getPastBroadcastBadges = this.getPastBroadcastBadges.bind(this);
        this.getLiveBadges = this.getLiveBadges.bind(this);
        this.getMetaInfo = this.getMetaInfo.bind(this);
    }

    /**
     * Checks user's online status in the store. If false, prevents link events from firing and requests that an error
     * message be shown
     * @param { Object } event
     */
    checkOnlineStatus(event) {
        if(!this.props.store.isOnline) {
            event.preventDefault();
            let errorActionObj = new ErrorActions();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    /**
     * Replaces the image of the event's target with the image specified
     * @param { Object } event
     */
    replaceMissingImage(event) {
        document.querySelector(`img#${ this.props.channelName }`)
            .setAttribute("src", __dirname + "../../../../assets/images/channel_placeholder_404.png");
    }

    /**
     * Returns the markup for the title of the specified game
     * @param { string } game
     */
    getGameTitleMarkup(game) {
        if(game === "Games") {
            return "Games";
        } else {
            let liveStreamsLinkObject = {
                pathname: "/main/liveStreams",
                query: { game: game }
            };

            return <Link to={ liveStreamsLinkObject } className="clickable-link" onClick={ this.checkOnlineStatus }>{ game }</Link>;
        }
    }

    /**
     * Returns the markup for the status of the stream specified in props
     * @param { string } status
     */
    getStatusMarkup(status) {
        if(this.props.status === null) {
            return <p>{ status }</p>;
        } else {
            return <p className="inactive-html" dangerouslySetInnerHTML={{ __html: status }} />;
        }
    }

    /** Returns markup displaying badges for a past broadcast */
    getPastBroadcastBadges() {
        return(
            <div id="past-broadcast-badges">
                <div className="info-badge" id="past-broadcast-badge">RECORDED</div>
                { this.props.isPartner === true ? <div className="info-badge" id="partner-badge">Partner</div> : null }
                { this.props.isMature === true ? <div className="info-badge" id="mature-badge">18+</div> : null }
                <div className="info-badge" id="language-badge">{ this.props.language.toUpperCase() }</div>
            </div>
        );
    }

    /** Returns markup displaying badges for a specified live channel */
    getLiveBadges() {
        return(
            <div id="live-badges">
                <div className="info-badge" id="live-badge">LIVE</div>
                { this.props.isPartner === true ? <div className="info-badge" id="partner-badge">Partner</div> : null }
                { this.props.isMature === true ? <div className="info-badge" id="mature-badge">18+</div> : null }
                <div className="info-badge" id="language-badge">{ this.props.language.toUpperCase() }</div>
            </div>
        );
    }

    /** Returns markup displaying stream viewers, uptime, and followers */
    getMetaInfo() {
        if(this.props.type === "pastBroadcast") {
            return(
                <div id="viewer-time-info">
                    <i className="material-icons stream-info-icons">visibility</i>
                    <p>{ numberWithCommas(this.props.viewers) }</p>
                    <i className="material-icons stream-info-icons">schedule</i>
                    <p>{ formatTimeFromSeconds(this.props.videoLength) }</p>
                    <i className="material-icons stream-info-icons">favorite</i>
                    <p>{ numberWithCommas(this.props.followers) }</p>
                </div>
            );
        } else {
            return(
                <div id="viewer-time-info">
                    <i className="material-icons stream-info-icons">group</i>
                    <p>{ numberWithCommas(this.props.viewers) }</p>
                    <i className="material-icons stream-info-icons">schedule</i>
                    <p id="stream-uptime">{ getUptime(this.props.createdAt) }</p>
                    <i className="material-icons stream-info-icons">favorite</i>
                    <p>{ numberWithCommas(this.props.followers) }</p>
                </div>
            );
        }
    }

    render() {
        let game = checkGame(this.props.game);
        let status = checkStatus(this.props.streamText);
        let channelLinkObject = {
            pathname: "/main/channelPage",
            query: { channelName: this.props.channelName }
        };

        return(
            <div id="main-info-container">
                <div id="stream-info-icon-title">
                    <div className="small-logo-image-container">
                        <img className="small-logo-image" id={ this.props.channelName } src={ checkLogo(this.props.logo) } onError={ this.replaceMissingImage } />
                    </div>
                    <div id="stream-info-title">
                        <h4 className="display-name">
                            <Link to={ channelLinkObject } onClick={ this.checkOnlineStatus }>{ this.props.displayName }</Link>
                        </h4>
                        <p className="main-game-played">Streaming { this.getGameTitleMarkup(game) }</p>
                    </div>
                </div>
                { this.props.isLive === true ? this.getLiveBadges() : null }
                { this.props.isRecorded === true ? this.getPastBroadcastBadges() : null }
                <div id="stream-title-container">
                    <h5 className="stream-title">{ this.props.title }</h5>>
                </div>
                <div id="stream-info-text-container">
                    { this.props.type === "pastBroadcast" ? <p>{ formatDate(this.props.createdAt) }</p> : null }
                    { this.getStatusMarkup(status) }
                </div>
                { this.getMetaInfo() }
            </div>
        );
    }
}

MainStreamInfo.propTypes = {
    createdAt: React.PropTypes.string,
    logo: React.PropTypes.string,
    displayName: React.PropTypes.string,
    followers: React.PropTypes.number,
    streamText: React.PropTypes.string,
    channelName: React.PropTypes.string,
};

export default MainStreamInfo;