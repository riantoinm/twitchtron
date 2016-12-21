"use strict";
import React from "react";

/** Defines the image specified in the props for a main stream */
class MainStreamPreview extends React.Component {
    constructor(props) {
        super(props);

        this.replaceMissingImage = this.replaceMissingImage.bind(this);
        this.hidePlaceholder = this.hidePlaceholder.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    /**
     * Replaces the image of the event's target with the image specified
     * @param { Object } event
     */
    replaceMissingImage(event) {
        let target = event.currentTarget.id;
        document.getElementById(target).setAttribute("src", __dirname + "../../../../assets/images/streams_placeholder.png");
    }

    /**
     * Adds style attributes to fade out placeholder image and fade in stream image
     * @param { Object } event
     */
    hidePlaceholder(event) {
        let target = event.currentTarget.id;
        document.querySelector("#main-stream-placeholder").setAttribute("style", "opacity: 0;");
        document.getElementById(target).setAttribute("style", "opacity: 1;");
    }

    /** Returns markup to render based on image received from props */
    getRenderMarkup() {
        let image, mainStreamStyle = null;

        if(this.props.image === null) {
            image = __dirname + "../../../../assets/images/streams_offline_placeholder.png";
            mainStreamStyle = { "opacity": 1 };
        } else {
            image = this.props.image;
            mainStreamStyle = { "opacity": 0 };
        }

        return(
            <div id={ this.props.streamUrl } className="main-stream-image-container" onClick={ this.props.handleClick }>
                { this.props.type != "channel" ? <i className="material-icons preview-play-icon">play_circle_outline</i> : null }
                <img id="main-stream-placeholder"
                     className="main-stream-image-placeholder"
                     src={ __dirname + "../../../../assets/images/streams_placeholder.png" }
                />
                <img id={ this.props.channelName }
                     className={ `main-stream-image ${ this.props.type != "channel" ? "clickable-image" : ""}` }
                     style={ mainStreamStyle }
                     src={ image }
                     onLoad={ this.hidePlaceholder }
                     onError={ this.replaceMissingImage }
                />
            </div>
        );
    }
    render() {
        return(
            <div className="main-preview-container preview-container">
                { this.getRenderMarkup() }
            </div>
        );
    }
}

MainStreamPreview.propTypes = {
    image: React.PropTypes.string,
    channelName: React.PropTypes.string
};

export default MainStreamPreview;