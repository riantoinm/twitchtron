"use strict";
import * as constants from "../../../utils/globals";
import { numberWithCommas } from "../../../utils/numberOps";
import { observer } from "mobx-react";
import CustomScroll from "../../common/CustomScroll";
import GameInfo from "./GameInfo";
import GamePreview from "./GamePreview";
import GeneralErrorComponent from "../../errors/GeneralErrorComponent";
import LoadingComponent from "../../common/LoadingComponent";
import LoadingOffsetComponent from "../../common/LoadingOffsetComponent";
import NoResults from "../../common/NoResults";
import React from "react";
import SearchForm from "../../search/SearchForm";
import SectionTitle from "../../common/SectionTitle";
import StreamActions from "../../../actions/streamActions";

/** Defines a list of games matching a specified game or top games if no game specified */
@observer
class GameListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.loadMoreContent = this.loadMoreContent.bind(this);
        this.getGamesList = this.getGamesList.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let store = this.props.store;
        let streamActionObj = new StreamActions();
        let searchQuery = this.props.location.query.searchQuery;

        if(searchQuery === undefined) {
            streamActionObj.setTwitchStreams(store, constants.TOP_GAMES);
        } else {
            streamActionObj.setSearchGamesData(searchQuery, store);
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextStore = nextProps.store;
        let streamActionObj = new StreamActions();
        let nextSearchQuery = nextProps.location.query.searchQuery;

        if(nextProps.location.action === "REPLACE" || nextSearchQuery !== this.props.location.query.searchQuery) {
            if(nextSearchQuery === undefined) {
                streamActionObj.setTwitchStreams(nextStore, constants.TOP_GAMES);
            } else {
                streamActionObj.setSearchGamesData(nextSearchQuery, nextStore);
            }
        }
    }

    /** Requests a fetch of offset channel follower data when Load More button is clicked */
    loadMoreContent() {
        let streamActionObj = new StreamActions();
        if(this.props.location.query.searchQuery === undefined) {
            streamActionObj.setTwitchStreamsOffset(this.props.store, constants.TOP_GAMES);
        }
    }

    /**
     * Returns a list of games from values stored in parsed data
     * @param { Object } parsedData
     */
    getGamesList(parsedData) {
        let self = this;
        if(parsedData.length === 0) {
            return <NoResults message="No games to show" />;
        } else {
            return parsedData.map(function(item) {
                return(
                    <div key={ item.game._id + Math.random() } className="top-game-container clickable-stream">
                        <GamePreview image={ item.game.box.large }
                                     gameName={ item.game.name }
                                     history={ self.props.route.history }
                                     store={ self.props.store }
                        />
                        <GameInfo name={ item.game.name } viewers={ item.viewers } />
                    </div>
                );
            });
        }
    }

    /** Returns markup to render based on stream data in the store, or a loading component if a network request is active */
    getRenderMarkup() {
        let store = this.props.store;
        let sectionTitle = "";
        let searchQuery = this.props.location.query.searchQuery;
        if(searchQuery === undefined) {
            sectionTitle = `${ constants.TITLE_TOP_GAMES } (${ numberWithCommas(store.streamDataTotals) })`;
        } else {
            sectionTitle = `Games matching ${ searchQuery } (${ numberWithCommas(store.streamDataTotals) })`;
        }

        if(store.isLoadingStreams) {
            return <LoadingComponent />;
        } else {
            let parsedData = store.streamData;
            return(
                <div className="section-container-inner content-container">
                    <CustomScroll id="scrollbars">
                        <div className="top-games-row scrollbar-inner">
                            <SectionTitle title={ sectionTitle } />
                            <div className="games-list-wrapper">{ this.getGamesList(parsedData) }</div>
                        </div>
                        <LoadingOffsetComponent loadMoreContent={ this.loadMoreContent } store={ store } />
                    </CustomScroll>
                </div>
            );
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

export default GameListContainer;