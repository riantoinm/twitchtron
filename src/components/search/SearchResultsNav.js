"use strict";
import * as constants from "../../utils/globals";
import { observer } from "mobx-react";
import ErrorActions from "../../actions/errorActions";
import React from "react";

/** Defines the sub navigation buttons that are used in the search results container  */
@observer
class SearchResultsNav extends React.Component {
    render() {
        let onClickEvent = null;
        let errorActionObj = new ErrorActions();

        this.props.store.isOnline ? onClickEvent =  this.props.searchStreams : onClickEvent = errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        return(
            <div className="sub-nav-container">
                <div className="sub-nav">
                    <button className={`button search-results-button ${ this.props.activeTab === "top" ? "active" : null }`}
                            id={ constants.SEARCH_ALL }
                            onClick={ onClickEvent }>Top</button>
                    <button className={`button search-results-button ${ this.props.activeTab === "channels" ? "active" : null }`}
                            id={ constants.SEARCH_CHANNELS }
                            onClick={ onClickEvent }>Channels</button>
                    <button className={`button search-results-button ${ this.props.activeTab === "games" ? "active" : null }`}
                            id={ constants.SEARCH_GAMES }
                            onClick={ onClickEvent }>Games</button>
                    <button className={`button search-results-button ${ this.props.activeTab === "streams" ? "active" : null }`}
                            id={ constants.SEARCH_STREAMS }
                            onClick={ onClickEvent }>Streams</button>
                </div>
            </div>
        );
    }
}

export default SearchResultsNav;