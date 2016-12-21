"use strict";
import { checkGame } from "../../../utils/twitchDataChecks";
import { Link } from "react-router";
import { numberWithCommas } from "../../../utils/numberOps";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines the info specified in the props for a specified stream other than the main stream */
class NonMainStreamInfo extends React.Component {
    constructor(props) {
        super(props);

        this.checkOnlineStatus = this.checkOnlineStatus.bind(this);
        this.getGameTitleMarkup = this.getGameTitleMarkup.bind(this);
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
     * Returns the markup for the title of the specified game
     * @param { string } game
     */
    getGameTitleMarkup(game) {
        if(game === "Games") {
            return <p>{ game }</p>;
        } else {
            let liveStreamsLinkObject = {
                pathname: "/main/liveStreams",
                query: { game: game }
            };

            return <Link to={ liveStreamsLinkObject } className="clickable-link game-played" onClick={ this.checkOnlineStatus }>{ game }</Link>;
        }
    }

    render() {
        let game = checkGame(this.props.game);

        let displayNameMarkup = null;
        this.props.isFeatured
            ? displayNameMarkup = <p className="non-main-display-name">{ `${ this.props.displayName }` }</p>
            : displayNameMarkup = <p className="non-main-display-name">{ `${ this.props.displayName } - ${ numberWithCommas(this.props.views) } viewers` }</p>;

        return(
            <div className="non-main-info-container">
                { displayNameMarkup }
                { this.getGameTitleMarkup(game) }
            </div>
        );
    }
}

NonMainStreamInfo.propTypes = {
    displayName: React.PropTypes.string,
    game: React.PropTypes.string,
    views: React.PropTypes.number
};

export default NonMainStreamInfo;