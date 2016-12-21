"use strict";
import * as constants from "../../utils/globals";
import { observer } from "mobx-react";
import ErrorActions from "../../actions/errorActions";
import React from "react";

/** Defines the sub navigation buttons that are used in the Homepage  */
@observer
class HomepageNav extends React.Component {
    render() {
        let onClickEvent = null;
        let errorActionObj = new ErrorActions();

        this.props.store.isOnline ? onClickEvent =  this.props.loadHomepageContent : onClickEvent = errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        return(
            <div className="sub-nav-container">
                <div className="sub-nav">
                    <button className={`button homepage-nav-button ${ this.props.activeTab === "live" ? "active" : null }`}
                            id={ constants.HOMEPAGE_LIVE }
                            onClick={ onClickEvent }>Live</button>
                    <button className={`button homepage-nav-button ${ this.props.activeTab === "following" ? "active" : null }`}
                            id={ constants.HOMEPAGE_FOLLOWING }
                            onClick={ onClickEvent }>Following</button>
                    <button className={`button homepage-nav-button ${ this.props.activeTab === "followers" ? "active" : null }`}
                            id={ constants.HOMEPAGE_FOLLOWERS }
                            onClick={ onClickEvent }>Followers</button>
                    <button className={`button homepage-nav-button ${ this.props.activeTab === "videos" ? "active" : null }`}
                            id={ constants.HOMEPAGE_VIDEOS }
                            onClick={ onClickEvent }>Videos</button>
                </div>
            </div>
        );
    }
}

export default HomepageNav;