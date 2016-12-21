"use strict";
import ErrorActions from "../../../actions/errorActions";
import React from "react";

/** Defines the image specified in the props for a game */
class GamePreview extends React.Component {
    constructor(props) {
        super(props);

        this.handleLinkToStreams = this.handleLinkToStreams.bind(this);
        this.replaceMissingImage = this.replaceMissingImage.bind(this);
    }

    /** Checks if a user is online based on value in the store. If so, links user to a list of streams matching specified
     * game received from props. Otherwise, requests that an error be shown in the snackbar */
    handleLinkToStreams() {
        if(this.props.store.isOnline) {
            let streamsLinkObject = {
                pathname: "/main/liveStreams",
                query: { game: this.props.gameName }
            };

            this.props.history.push(streamsLinkObject);
        } else {
            let errorActionObj = new ErrorActions();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    /**
     * Replaces the image of the event's target with the image specified
     * @param { Object } event
     */
    replaceMissingImage(event) {
        let target = event.currentTarget.id;
        document.getElementById(target).setAttribute("src", __dirname + "../../../../assets/images/games_placeholder.png");
    }

    render() {
        return(
            <div className="game-image-container" onClick={ this.handleLinkToStreams }>
                <img className="game-image" src={ this.props.image } onError={ this.replaceMissingImage } />
            </div>
        );
    }
}

GamePreview.PropTypes = {
    image: React.PropTypes.string,
    gameName: React.PropTypes.string,
};

export default GamePreview;