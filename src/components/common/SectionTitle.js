"use strict";
import React from "react";

/** Defines the text shown as the title of a section */
class SectionTitle extends React.Component {
    render() {
        return(
          <div id="section-title-container">
              <h1 id="section-title">{ this.props.title }</h1>
              <hr id="section-title-hr" />
          </div>
        );
    }
}

SectionTitle.PropTypes = {
    title: React.PropTypes.string
};

export default SectionTitle;