"use strict";
import NavFooter from "./NavFooter";
import NavHeader from "./NavHeader";
import NavItems from "./NavItems";
import React from "react";

/** Defines a wrapper for the app's main navigation components */
class NavContainer extends React.Component {
    render() {
        return(
            <div className="column nav-container">
                <NavHeader/>
                    <NavItems store={ this.props.store } />
                <NavFooter store={ this.props.store } />
            </div>
        );
    }
}

export default NavContainer;