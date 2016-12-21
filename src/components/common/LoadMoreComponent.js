"use strict";
import { observer } from "mobx-react";
import ErrorActions from "../../actions/errorActions";
import React from "react";

/** Defines the Load More button that is displayed when offset streams are available for fetching */
@observer
class LoadMoreComponent extends React.Component {
    render() {
        let buttonVisibility, onClickEvent = null;
        let errorActionObj = new ErrorActions();

        this.props.store.streamsRemaining < 1 ? buttonVisibility = { "display" : "none" } : buttonVisibility = { "display" : "block" };
        this.props.store.isOnline ? onClickEvent =  this.props.loadMoreContent : onClickEvent = errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        return(
            <div id="load-more-container">
                <button className="button general-button" style={ buttonVisibility } onClick={ onClickEvent }>Load more</button>
            </div>
        );
    }
}

LoadMoreComponent.PropTypes = { loadMoreContent: React.PropTypes.func };

export default LoadMoreComponent;