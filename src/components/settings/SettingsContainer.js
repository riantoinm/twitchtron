"use strict";
import * as constants from "../../utils/globals";
import SearchForm from "../search/SearchForm";
import SettingsStreamlink from "./SettingsStreamlink";
import SettingsNav from "./SettingsNav";
import React from "react";

/** Defines the container that wraps the settings components and navigation used in displaying app settings */
class SettingsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedContent: <SettingsStreamlink store={ this.props.store } />,
            activeTab: "streamlink"
        };

        this.setSettingsMarkup = this.setSettingsMarkup.bind(this);
    }

    /**
     * Sets component state to store markup that will render when onclick event is fired by a nav item click
     * @param { Object } event
     */
    setSettingsMarkup(event) {
        let store = this.props.store;

        switch(event.currentTarget.id) {
            case constants.SETTINGS_STREAMLINK:
                this.setState({
                    activeTab: "streamlink",
                    renderedContent: <SettingsStreamlink store={ store } />
                });
                break;
        }
    }

    render() {
        return(
            <div className="page-wrapper">
                <SearchForm location={ this.props.location.pathname } store={ this.props.store } history={ this.props.route.history } />
                <div className="section-container">
                <SettingsNav activeTab={ this.state.activeTab } loadSettingsContent={ this.setSettingsMarkup } />
                    { this.state.renderedContent }
                </div>
            </div>
        );
    }
}

export default SettingsContainer;