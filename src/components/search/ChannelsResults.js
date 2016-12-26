"use strict";
import * as constants from "../../utils/globals";
import { numberWithCommas } from "../../utils/numberOps";
import { observer } from "mobx-react";
import ChannelLogo from "../twitch/channel/ChannelLogo";
import ChannelSearchResultsInfo from "../twitch/channel/ChannelSearchResultsInfo";
import CustomScroll from "../common/CustomScroll";
import GeneralErrorComponent from "../errors/GeneralErrorComponent";
import LoadingComponent from "../common/LoadingComponent";
import LoadingOffsetComponent from "../common/LoadingOffsetComponent";
import NoResults from "../common/NoResults";
import React from "react";
import SectionTitle from "../common/SectionTitle";
import StreamActions from "../../actions/streamActions";

/** Defines a list of channels shown after a channel search */
@observer
class ChannelsResults extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getChannelsResultsList = this.getChannelsResultsList.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();
        streamActionObj.setSearchChannelsData(this.props.searchQuery, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.searchQuery !== this.props.searchQuery) {
            streamActionObj.setSearchChannelsDataOffset(nextProps.searchQuery, nextProps.store);
        }
    }

    /** Requests a fetch of offset channel data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();
        streamActionObj.setSearchChannelsDataOffset(this.props.searchQuery, this.props.store);
    }

    /**
     * Returns a list of channels from values stored in parsed data
     * @param { Object } parsedData
     */
    getChannelsResultsList(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message={ `No channels matching "${ this.props.searchQuery }"` } />;
        } else {
            let self = this;
            return parsedData.map(function(item) {
                return(
                    <div key={ item._id + Math.random() } className="channel-logos-container clickable-stream">
                        <ChannelLogo image={ item.logo }
                                     channelName={ item.name }
                                     history={ self.props.history }
                                     store={ self.props.store }
                        />
                        <ChannelSearchResultsInfo displayName={ item.display_name } />
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
                    <SectionTitle title={ `${ constants.TITLE_SEARCH_CHANNELS_RESULTS } (${ numberWithCommas(store.streamDataTotals) })` } />
                    <div className="streams-list-wrapper">{ this.getChannelsResultsList(store.streamData) }</div>
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
export default ChannelsResults;