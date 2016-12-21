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

/** Defines a list of followers of a specified channel name */
@observer
class ChannelFollowers extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getFollowersList = this.getFollowersList.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();

        streamActionObj.getFollowerChannels(this.props.channelName, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.channelName !== this.props.channelName) {
            streamActionObj.getFollowerChannels(nextProps.channelName, nextProps.store);
        }
    }

    /** Requests a fetch of offset channel follower data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();
        streamActionObj.getFollowerChannelsOffset(this.props.channelName, this.props.store);
    }

    /**
     * Returns a list of channels from values stored in parsed data
     * @param { Object } parsedData
     */
    getFollowersList(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message="No followers to show" />;
        } else {
            let self = this;
            return parsedData.map(function(item) {
                return(
                    <div key={ item.user._id + Math.random() } className="channel-logos-container clickable-stream">
                        <ChannelLogo image={ item.user.logo }
                                     channelName={ item.user.name }
                                     history={ self.props.history }
                                     store={ self.props.store }
                        />
                        <ChannelSearchResultsInfo displayName={ item.user.display_name } />
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
                    <SectionTitle title={ `Followers (${ numberWithCommas(this.props.store.streamDataTotals) })` } />
                    <div className="channel-logo-list-full-wrapper">{ this.getFollowersList(this.props.store.streamData) }</div>
                    <LoadingOffsetComponent loadMoreContent={ this.loadMoreContent } store={ store } />
                </div>
            );
        }
    }

    render() {
        return(
            <div id="channel-section-container" className="section-container-inner container-with-nav content-container">
                <CustomScroll id="scrollbars">
                    { this.props.store.requestError ? <GeneralErrorComponent /> : this.getRenderMarkup() }
                </CustomScroll>
            </div>
        );
    }
}
export default ChannelFollowers;