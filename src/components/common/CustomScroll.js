"use strict";
import { Scrollbars } from "react-custom-scrollbars";
import React from "react";

/** Defines the custom scrollbar used by the app */
class CustomScroll extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.querySelector("#scrollbars > div:last-child").setAttribute("style", "position: absolute; width: 6px; right: 2px; bottom: 2px; top: 60px; border-radius: 3px");
    }

    render() {
        return(
            <Scrollbars { ...this.props }>
                { this.props.children }
            </Scrollbars>
        );
    }
}

export default CustomScroll;