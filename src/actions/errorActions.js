"use strict";
import * as constants from "../utils/globals";
import { action } from "mobx";

/** Handles reporting errors related to network connections and updating resulting store values */
class ErrorActions {

    /**
     * Updates store to show that a network request error has occurred
     * @param { string } errorType
     * @param { Object } store
     */
    @action reportError(errorType, store) {
        if(errorType === constants.ERROR_UNAUTHORIZED) { //occurs when Twitch API returns that user has not authorized the app
            store.userIsAuthorized = false;
        }
        store.requestError = true;
        store.isLoadingStreams = false;
    }

    /**
     * Displays a snackbar message  and updates the store to show that a network request error has occurred while
     * loading offset streams
     * @param { Object } store
     */
    @action reportOffsetLoadError(store) {
        this.showSnackbar(`<i class="material-icons snackbar-icon">info_outline</i>Load failed. Please try again`);
        store.isLoadingOffsetStreams = false;
    }

    /**
     * Updates store to reflect status showing whether user is online or not when a change in connectivity has occurred
     * @param { Object } store
     * @param { bool } status
     */
    @action setOnlineStatus(store, status) {
        status ? store.isOnline = true : store.isOnline = false;
    }

    /**
     * Displays a message in the app's snackbar to the user
     * @param { string } message
     */
    @action showSnackbar(message) {
        let snackbarTarget = document.querySelector("#snackbar");
        snackbarTarget.innerHTML = message;
        snackbarTarget.className = "show-snackbar";
        setTimeout(function() {
            snackbarTarget.className = snackbarTarget.className.replace("show-snackbar", "");
        }, 4000);
    }
}

export default ErrorActions;