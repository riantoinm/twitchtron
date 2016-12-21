"use strict";
import * as constants from "../../utils/globals";
import React from "react";

/** Defines the sub navigation buttons that are used in the settings container  */
class SettingsNav extends React.Component {
    render() {
        return(
            <div id="settings-nav-container" className="sub-nav-container">
                <div id="settings-nav" className="sub-nav">
                    <button className={`button settings-nav-button ${ this.props.activeTab === "streamlink" ? "active" : null }`}
                            id={ constants.SETTINGS_STREAMLINK }
                            onClick={ this.props.loadSettingsContent }>Streamlink</button>
                </div>
            </div>
        );
    }
}

export default SettingsNav;