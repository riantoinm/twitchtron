"use strict";
import ErrorActions from "../../actions/errorActions";
import PageNavButtons from "./PageNavButtons";
import React from "react";

/** Defines the search form used throughout the app */
class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ""
        };

        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    /**
     * Stores the value from the input event in the component's state
     * @param { Object } event
     */
    handleSearchInputChange(event) {
        this.setState( { searchValue: event.target.value } );
    }

    /**
     * Submits the value stored in the component's state to the Search Results container component
     * @param { Object } event
     */
    handleSearchSubmit(event) {
        if(this.props.store.isOnline && this.state.searchValue.length != 0) {
            event.preventDefault();
            let searchLinkObject = {
                pathname: "/main/searchResults",
                query: { searchQuery: this.state.searchValue }
            };

            this.setState({ searchValue: "" });
            this.props.history.push(searchLinkObject);
        } else if(this.state.searchValue.length === 0) {
            event.preventDefault();
        } else {
            let errorActionObj = new ErrorActions();

            event.preventDefault();
            errorActionObj.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>You are currently offline`);
        }
    }

    render() {
        return(
            <div id="page-nav-search-form">
                <PageNavButtons store={ this.props.store } location={ this.props.location } history={ this.props.history } />
                <form id="search-form" onSubmit={ this.handleSearchSubmit } >
                    <input type="text" className="search" name="search" placeholder="Search Twitch"
                           onChange={ this.handleSearchInputChange } value={ this.state.searchValue } />
                    <i className="material-icons" id="search-icon">search</i>
                </form>
            </div>
        );
    }
}

export default SearchForm;