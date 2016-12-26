"use strict";
import { numberWithCommas } from "../../../utils/numberOps";
import { observer } from "mobx-react";
import ChannelLogo from "../../twitch/channel/ChannelLogo";
import ChannelSearchResultsInfo from "./ChannelSearchResultsInfo";
import CustomScroll from "../../common/CustomScroll";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import LoadingOffsetComponent from "../../common/LoadingOffsetComponent";
import NoResults from "../../common/NoResults";
import React from "react";
import SectionTitle from "../../common/SectionTitle";
import StreamActions from "../../../actions/streamActions";

/** Defines a list of channels that a specified channel name is following */
@observer
class ChannelFollowing extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getFollowingList = this.getFollowingList.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.getFollowingChannels(this.props.channelName, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.channelName !== this.props.channelName) {
            streamActionObj.getFollowingChannels(nextProps.channelName, nextProps.store);
        }
    }

    /** Requests a fetch of offset channel following data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();
        streamActionObj.getFollowingChannelsOffset(this.props.channelName, this.props.store);
    }

    /**
     * Returns a list of channels from values stored in parsed data
     * @param { Object } parsedData
     */
    getFollowingList(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message="Not following any channels" />;
        } else {
            let self = this;
            return parsedData.map(function(item) {
                return(
                    <div key={ item.channel._id + Math.random() } className="channel-logos-container clickable-stream">
                        <ChannelLogo image={ item.channel.logo }
                                     channelName={ item.channel.name }
                                     history={ self.props.history }
                                     store={ self.props.store }
                        />
                        <ChannelSearchResultsInfo displayName={ item.channel.display_name } />
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
                    <SectionTitle title={ `Following (${ numberWithCommas(this.props.store.streamDataTotals) })` } />
                    <div className="streams-list-wrapper">{ this.getFollowingList(this.props.store.streamData) }</div>
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
export default ChannelFollowing;