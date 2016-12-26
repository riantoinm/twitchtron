"use strict";
import * as constants from "../../utils/globals";
import { numberWithCommas } from "../../utils/numberOps";
import { observer } from "mobx-react";
import CustomScroll from "../common/CustomScroll";
import GeneralErrorComponent from "../errors/GeneralErrorComponent";
import LoadingComponent from "../common/LoadingComponent";
import LoadingOffsetComponent from "../common/LoadingOffsetComponent";
import NonMainStreamInfo from "../twitch/stream/NonMainStreamInfo";
import NonMainStreamPreview from "../twitch/stream/NonMainStreamPreview";
import NoResults from "../common/NoResults";
import React from "react";
import SectionTitle from "../common/SectionTitle";
import StreamActions from "../../actions/streamActions";

/** Defines a list of live streams shown after a live streams search */
@observer
class StreamsResults extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getStreamsResultsList = this.getStreamsResultsList.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();
        streamActionObj.setSearchStreamsData(this.props.searchQuery, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.searchQuery !== this.props.searchQuery) {
            streamActionObj.setSearchStreamsDataOffset(nextProps.searchQuery, nextProps.store);
        }
    }

    /** Requests a fetch of offset stream data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();
        streamActionObj.setSearchStreamsDataOffset(this.props.searchQuery, this.props.store);
    }

    /**
     * Returns a list of live streams from values stored in parsed data
     * @param { Object } parsedData
     */
    getStreamsResultsList(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message={ `No live streams matching "${ this.props.searchQuery }"` } />;
        } else {
            let self = this;
            return parsedData.map(function (item) {
                return (
                    <div key={ item._id } className="live-stream-container clickable-stream">
                        <NonMainStreamPreview channelName={ item.channel.name } image={ item.preview.medium }
                                              type="nonFeatured" history={ self.props.history } store={ self.props.store }
                        />
                        <NonMainStreamInfo game={ item.channel.game }
                                           displayName={ item.channel.display_name }
                                           views={ item.viewers }
                                           store={ self.props.store }
                        />
                    </div>
                );
            });
        }
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            return(
                <div className="scrollbar-inner">
                    <SectionTitle title={ `${ constants.TITLE_SEARCH_STREAMS_RESULTS } (${ numberWithCommas(store.streamDataTotals) })` } />
                    <div className="streams-list-wrapper">{ this.getStreamsResultsList(store.streamData) }</div>
                    <LoadingOffsetComponent loadMoreContent={ this.loadMoreContent } store={ store } />
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
export default StreamsResults;
