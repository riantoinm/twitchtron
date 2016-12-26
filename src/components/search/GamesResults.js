"use strict";
import * as constants from "../../utils/globals";
import { observer } from "mobx-react";
import CustomScroll from "../common/CustomScroll";
import GameInfo from "../twitch/game/GameInfo";
import GamePreview from "../twitch/game/GamePreview";
import GeneralErrorComponent from "../errors/GeneralErrorComponent";
import LoadingComponent from "../common/LoadingComponent";
import LoadingOffsetComponent from "../common/LoadingOffsetComponent";
import NoResults from "../common/NoResults";
import React from "react";
import SectionTitle from "../common/SectionTitle";
import StreamActions from "../../actions/streamActions";

/** Defines a list of games shown after a game search */
@observer
class GamesResults extends React.Component {
    constructor(props) {
        super(props);

        this.getGamesResultsList = this.getGamesResultsList.bind(this);
        this.getRenderMarkup = this.getRenderMarkup.bind(this);
    }

    componentWillMount() {
        let streamActionObj = new StreamActions();
        streamActionObj.setSearchGamesData(this.props.searchQuery, this.props.store);
    }

    componentWillReceiveProps(nextProps) {
        let streamActionObj = new StreamActions();

        if(nextProps.location.action === "REPLACE" || nextProps.searchQuery !== this.props.searchQuery) {
            streamActionObj.setSearchGamesData(nextProps.searchQuery, nextProps.store);
        }
    }

    /**
     * Returns a list of games from values stored in parsed data
     * message be shown
     * @param { Object } parsedData
     */
    getGamesResultsList(parsedData) {
        if(parsedData.length === 0) {
            return <NoResults message={ `No games matching "${ this.props.searchQuery }"` } />;
        } else {
            let self = this;
            return parsedData.map(function (item) {
                return (
                    <div key={ item._id + Math.random() } className="top-game-container clickable-stream">
                        <GamePreview image={ item.box.large }
                                     gameName={ item.name }
                                     history={ self.props.history }
                                     store={ self.props.store }
                        />
                        <GameInfo name={ item.name } viewers={ item.popularity }/>
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
                    <SectionTitle title={ constants.TITLE_SEARCH_GAMES_RESULTS } />
                    <div className="games-list-wrapper">{ this.getGamesResultsList(this.props.store.streamData) }</div>
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
export default GamesResults;
