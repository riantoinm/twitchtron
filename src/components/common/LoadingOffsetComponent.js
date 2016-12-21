"use strict";
import { observer } from "mobx-react";
import LoadMoreComponent from "./LoadMoreComponent";
import React from "react";

/** Defines the loader that is displayed when a network request is being made for offset data */
@observer
class LoadingOffsetComponent extends React.Component {
    render() {
        if(this.props.store.isLoadingOffsetStreams) {
            return(
                <div id="offset-loader-container">
                    <div className="offset-loader"></div>
                </div>
            );
        } else {
            return <LoadMoreComponent loadMoreContent={ this.props.loadMoreContent } store={ this.props.store } />;
        }
    }
}

export default LoadingOffsetComponent;