"use strict";
import { observer } from "mobx-react";
import ErrorActions from "../../actions/errorActions";
import React from "react";

/** Defines the buttons used for navigating back, forward, and refreshing a page in the search form */
@observer
class PageNavButtons extends React.Component {
    constructor(props) {
        super(props);

        this.performNavigation = this.performNavigation.bind(this);
    }

    /**
     * Performs the requested navigation operation based on the button that fires the onclick event, or requests that a
     * snackbar error be shown if the user is not online
     * @param { Object } event
     */
    performNavigation(event) {
        if(this.props.store.isOnline) {
            let target = event.currentTarget.id;

            switch(target) {
                case "nav-back":
                    if(this.props.store.canGoBack) {
                        this.props.history.goBack();
                    }
                    break;
                case "nav-forward":
                    this.props.history.goForward();
                    break;
                case "nav-refresh":
                    this.props.history.replace(this.props.location);
                    break;
            }
        } else {
            let errorActionObj = new ErrorActions();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    render() {
        return(
            <div id="page-nav-container">
                <button className="button page-nav-button" id="nav-back" onClick={ this.performNavigation }>
                    <i className="material-icons page-nav-icon">chevron_left</i>
                </button>
                <button className="button page-nav-button" id="nav-forward" onClick={ this.performNavigation }>
                    <i className="material-icons page-nav-icon">chevron_right</i>
                </button>
                <button className="button page-nav-button" id="nav-refresh" onClick={ this.performNavigation }>
                    <i className="material-icons page-nav-icon">refresh</i>
                </button>
            </div>
        );
    }
}

export default PageNavButtons;