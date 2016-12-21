"use strict";
import React from "react";

/** Defines the text that is displayed when an unauthenticated or unauthorized user attempts to access the user Homepage */
class HomepageForbidden extends React.Component {
    render() {
        return(
            <div id="no-results-container">
                <h2 className="no-results-text">You must be logged in and Twitchtron must be authorized to access your account.</h2>
            </div>
        );
    }
}

export default HomepageForbidden;