"use strict";
import * as constants from "../../../utils/globals";
import { observer } from "mobx-react";
import CustomScroll from "../../common/CustomScroll";
import ErrorActions from '../../../actions/errorActions';
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import MainStreamInfo from "./MainStreamInfo";
import MainStreamPreview from "./MainStreamPreview";
import NonMainStreamInfo from "./NonMainStreamInfo";
import NonMainStreamPreview from "./NonMainStreamPreview";
import NoResults from "../../common/NoResults";
import React from "react";
import SearchForm from "../../search/SearchForm";
import SectionTitle from "../../common/SectionTitle";
import StreamActions from "../../../actions/streamActions";
import StreamEmbed from "./StreamEmbed";

/** Defines a list of featured streams */
@observer
class FeaturedStreamsPage extends React.Component {
    constructor(props) {
        super(props);

        this.startEmbedStream = this.startEmbedStream.bind(this);
        this.getNonMainStreamRow = this.getNonMainStreamRow.bind(this);
        this.getMainStreamRow = this.getMainStreamRow.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.setTwitchStreams(this.props.store, constants.FEATURED_STREAMS);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE") {
            streamActionObj.setTwitchStreams(nextProps.store, constants.FEATURED_STREAMS);
        }
    }

    /** Updates the store to specify that a request for an embedded stream has been made. Requests that an error be shown
     * in the snackbar if user is offline */
    startEmbedStream() {
        if(this.props.store.isOnline) {
            this.props.store.isWatchingEmbededStream = true;
        } else {
            let errorActionObj = new ErrorActions();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    /**
     * Returns a list of featured streams other than the main featured stream based on values in parsed data
     * @param { Object } parsedData
     */
    getNonMainStreamRow(parsedData) {
        let self = this;
        let renderedData = parsedData.map(function(item) {
            return(
                <div key={ item.stream._id } className="featured-stream-container clickable-stream">
                    <NonMainStreamPreview image={ item.image } channelName={ item.stream.channel.name }
                                          history={ self.props.route.history } store={ self.props.store } type="featured"
                    />
                    <NonMainStreamInfo displayName={ item.stream.channel.display_name }
                                       game={ item.stream.channel.game }
                                       isFeatured={ true }
                                       store={ self.props.store }
                    />
                </div>
            );
        });
        return renderedData = renderedData.slice(1, renderedData.length);
    }

    /**
     * Returns the main featured stream based on values in parsed data
     * @param { Object } parsedData
     */
    getMainStreamRow(parsedData) {
        let store = this.props.store;
        if( store.isWatchingEmbededStream ) {
            return <StreamEmbed store={ store } channelName={ parsedData[0].stream.channel.name } />;
        } else {
            return(
                <MainStreamPreview
                    image={ parsedData[0].stream.preview.large }
                    streamUrl={ parsedData[0].stream.channel.url }
                    store={ store }
                    type="featuredStream"
                    channelName={ parsedData[0].stream.channel.name }
                    handleClick={ this.startEmbedStream }
                />
            );
        }
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            if(store.streamData.length === 0) {
                return <NoResults message="No streams to show" />;
            } else {
                let parsedData = store.streamData;
                return(
                    <div className="section-container-inner content-container">
                        <CustomScroll id="scrollbars">
                            <div className="scrollbar-inner">
                                <SectionTitle title={ constants.TITLE_FEATURED_STREAMS } />
                                <div className="main-stream-row">
                                    { this.getMainStreamRow(parsedData) }
                                    <MainStreamInfo createdAt={ parsedData[0].stream.created_at }
                                                    displayName={ parsedData[0].stream.channel.display_name }
                                                    followers={ parsedData[0].stream.channel.followers }
                                                    game={ parsedData[0].stream.game }
                                                    logo={ parsedData[0].stream.channel.logo }
                                                    streamText={ parsedData[0].text }
                                                    title={ parsedData[0].title }
                                                    viewers={ parsedData[0].stream.viewers }
                                                    channelName={ parsedData[0].stream.channel.name }
                                                    store={ store }
                                    />
                                </div>
                                <div id="non-main-stream-row">
                                    { this.getNonMainStreamRow(parsedData) }
                                </div>
                            </div>
                        </CustomScroll>
                    </div>
                );
            }
        }
    }

    render() {
        let store = this.props.store;
        return (
            <div className="main-wrapper">
                <SearchForm location={ this.props.location.pathname } store={ store } history={ this.props.route.history } />
                <div className="section-container">
                    { store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
                </div>
            </div>
        );
    }
}

export default FeaturedStreamsPage;